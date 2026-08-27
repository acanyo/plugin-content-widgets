package com.xhhao.contentwidgets;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.server.RequestPredicates.GET;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;

@Component
public class LinkMetadataEndpoint implements CustomEndpoint {

    private static final Logger LOG = LoggerFactory.getLogger(LinkMetadataEndpoint.class);
    static final int MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    static final int MAX_REDIRECTS = 3;
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(8);
    private static final String USER_AGENT =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            + "(KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";
    private static final Pattern SHARED_URL = Pattern.compile("(?i)https?://[^\\s<>\\\"']+");
    private static final Pattern BILIBILI_VIDEO = Pattern.compile(
        "(?i)/(?:video/)?(BV[0-9A-Za-z]+|av[0-9]+)(?:[/\\?#]|$)"
    );

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .followRedirects(HttpClient.Redirect.NEVER)
        .build();

    @Override
    public GroupVersion groupVersion() {
        return GroupVersion.parseAPIVersion(
            "console.api.content-widgets.xhhao.com/v1alpha1"
        );
    }

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        return RouterFunctions.route(GET("/link-metadata"), this::getLinkMetadata);
    }

    private Mono<ServerResponse> getLinkMetadata(ServerRequest request) {
        var rawUrl = request.queryParam("url").orElse("");
        return Mono.fromCallable(() -> readMetadata(rawUrl))
            .subscribeOn(Schedulers.boundedElastic())
            .flatMap(metadata -> ServerResponse.ok()
                .contentType(APPLICATION_JSON)
                .bodyValue(metadata))
            .onErrorResume(error -> ServerResponse.badRequest()
                .contentType(APPLICATION_JSON)
                .bodyValue(Map.of("message", userMessage(error))));
    }

    LinkMetadataResponse readMetadata(String rawUrl) throws Exception {
        var requestedUri = normalizeAndValidate(rawUrl);
        final FetchResult fetched;
        try {
            fetched = fetch(requestedUri, 0);
        } catch (Exception error) {
            var platform = detectPlatform(requestedUri.getHost());
            if (!"website".equals(platform)) {
                LOG.warn("Unable to read metadata from host {}: {}", requestedUri.getHost(), error.toString());
                return platformFallback(requestedUri, platform);
            }
            throw error;
        }
        var document = Jsoup.parse(
            new ByteArrayInputStream(fetched.body()),
            null,
            fetched.uri().toString()
        );
        var host = fetched.uri().getHost().toLowerCase(Locale.ROOT);
        var platform = detectPlatform(host);
        var oembed = readOembed(document);
        var specialized = "bilibili".equals(platform)
            ? readBilibiliMetadata(fetched.uri())
            : JsonMetadata.empty();
        var siteName = firstNonBlank(
            specialized.siteName(),
            firstContent(document, "meta[property=og:site_name]", "content"),
            oembed.siteName(),
            jsonLdValue(document, "publisher", "provider", "brand")
        );
        if (siteName.isBlank()) {
            siteName = platformLabel(platform, host);
        }
        var title = firstNonBlank(
            specialized.title(),
            firstContent(document, "meta[property=og:title]", "content"),
            firstContent(document, "meta[name=twitter:title]", "content"),
            oembed.title(),
            jsonLdValue(document, "headline", "name"),
            document.title(),
            siteName
        );
        var description = firstNonBlank(
            specialized.description(),
            firstContent(document, "meta[property=og:description]", "content"),
            firstContent(document, "meta[name=description]", "content"),
            firstContent(document, "meta[name=twitter:description]", "content"),
            oembed.description(),
            jsonLdValue(document, "description", "abstract")
        );
        var iconUrl = firstPublicHttpUrl(
            specialized.iconUrl(),
            findIcon(document, fetched.uri())
        );
        var imageUrl = firstPublicHttpUrl(
            specialized.imageUrl(),
            absolute(document, "meta[property=og:image]", "content"),
            absolute(document, "meta[name=twitter:image]", "content"),
            oembed.imageUrl(),
            resolveUrl(fetched.uri(), jsonLdValue(document, "image", "thumbnailUrl"))
        );
        var canonicalUrl = firstHttpUrl(
            absolute(document, "link[rel=canonical]", "href"),
            fetched.uri().toString()
        );
        return new LinkMetadataResponse(
            canonicalUrl,
            host,
            platform,
            limit(siteName, 80),
            limit(title, 160),
            limit(description, 320),
            iconUrl,
            imageUrl,
            specialized.hasContent() ? "api" : "page"
        );
    }

    private JsonMetadata readBilibiliMetadata(URI pageUri) {
        var matcher = BILIBILI_VIDEO.matcher(pageUri.getPath());
        if (!matcher.find()) return JsonMetadata.empty();
        var videoId = matcher.group(1);
        var queryName = videoId.toLowerCase(Locale.ROOT).startsWith("av") ? "aid" : "bvid";
        var queryValue = queryName.equals("aid") ? videoId.substring(2) : videoId;
        var apiUri = URI.create(
            "https://api.bilibili.com/x/web-interface/view?" + queryName + "="
                + URLEncoder.encode(queryValue, StandardCharsets.UTF_8)
        );
        try {
            var root = fetchJson(apiUri, 0);
            if (root.path("code").asInt(-1) != 0) return JsonMetadata.empty();
            var data = root.path("data");
            var owner = data.path("owner").path("name").asText("").trim();
            var description = data.path("desc").asText("").trim();
            if ("-".equals(description)) description = "";
            if (!owner.isBlank()) {
                description = firstNonBlank(description, "UP 主：" + owner);
                if (!description.contains(owner)) description += " · UP 主：" + owner;
            }
            return new JsonMetadata(
                "Bilibili",
                data.path("title").asText(""),
                description,
                "https://www.bilibili.com/favicon.ico",
                forceHttps(data.path("pic").asText(""))
            );
        } catch (Exception ignored) {
            return JsonMetadata.empty();
        }
    }

    private JsonMetadata readOembed(Document document) {
        var link = document.selectFirst(
            "link[type=application/json+oembed], link[type=\"application/json+oembed\"]"
        );
        if (link == null || link.absUrl("href").isBlank()) return JsonMetadata.empty();
        try {
            var root = fetchJson(normalizeAndValidate(link.absUrl("href")), 0);
            var author = root.path("author_name").asText("").trim();
            var description = root.path("description").asText("").trim();
            if (description.isBlank() && !author.isBlank()) description = "作者：" + author;
            return new JsonMetadata(
                root.path("provider_name").asText(""),
                root.path("title").asText(""),
                description,
                "",
                firstNonBlank(
                    root.path("thumbnail_url").asText(""),
                    root.path("image").asText("")
                )
            );
        } catch (Exception ignored) {
            return JsonMetadata.empty();
        }
    }

    private JsonNode fetchJson(URI uri, int redirects) throws Exception {
        validatePublicHost(uri);
        var request = HttpRequest.newBuilder(uri)
            .timeout(REQUEST_TIMEOUT)
            .header("User-Agent", USER_AGENT)
            .header("Accept", "application/json,text/json;q=0.9,*/*;q=0.1")
            .header("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.6")
            .header("Accept-Encoding", "identity")
            .GET()
            .build();
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
        var status = response.statusCode();
        if (status >= 300 && status < 400) {
            if (redirects >= MAX_REDIRECTS) {
                throw new IllegalArgumentException("网站重定向次数过多。");
            }
            var location = response.headers().firstValue("location")
                .orElseThrow(() -> new IllegalArgumentException("网站返回了无效重定向。"));
            try (var ignored = response.body()) {
                return fetchJson(normalizeAndValidate(uri.resolve(location).toString()), redirects + 1);
            }
        }
        if (status < 200 || status >= 300) {
            throw new IllegalArgumentException("目标网站返回 HTTP " + status + "。");
        }
        try (var body = response.body()) {
            var bytes = body.readNBytes(MAX_RESPONSE_BYTES + 1);
            if (bytes.length > MAX_RESPONSE_BYTES) {
                throw new IllegalArgumentException("网站数据超过 2 MB，已停止读取。");
            }
            return objectMapper.readTree(bytes);
        }
    }

    private String jsonLdValue(Document document, String... keys) {
        for (var script : document.select("script[type=application/ld+json]")) {
            try {
                var root = objectMapper.readTree(script.data());
                for (var key : keys) {
                    var value = jsonText(root.findValue(key));
                    if (!value.isBlank()) return value;
                }
            } catch (Exception ignored) {
                // Some websites embed several invalid JSON-LD blocks; continue with the next one.
            }
        }
        return "";
    }

    private static String jsonText(JsonNode node) {
        if (node == null || node.isNull()) return "";
        if (node.isTextual() || node.isNumber() || node.isBoolean()) return node.asText("");
        if (node.isArray()) {
            for (var item : node) {
                var value = jsonText(item);
                if (!value.isBlank()) return value;
            }
            return "";
        }
        if (node.isObject()) {
            for (var key : new String[] {"url", "contentUrl", "@id", "name"}) {
                var value = jsonText(node.get(key));
                if (!value.isBlank()) return value;
            }
        }
        return "";
    }

    private static String resolveUrl(URI pageUri, String value) {
        if (value == null || value.isBlank()) return "";
        try {
            return pageUri.resolve(value.trim()).toString();
        } catch (IllegalArgumentException ignored) {
            return "";
        }
    }

    private static String forceHttps(String value) {
        return value == null ? "" : value.replaceFirst("(?i)^http://", "https://");
    }

    private static LinkMetadataResponse platformFallback(URI uri, String platform) {
        var host = uri.getHost().toLowerCase(Locale.ROOT);
        return new LinkMetadataResponse(
            uri.toString(),
            host,
            platform,
            platformLabel(platform, host),
            "",
            "",
            uri.resolve("/favicon.ico").toString(),
            "",
            "fallback"
        );
    }

    private FetchResult fetch(URI uri, int redirects) throws Exception {
        validatePublicHost(uri);
        var request = HttpRequest.newBuilder(uri)
            .timeout(REQUEST_TIMEOUT)
            .header("User-Agent", USER_AGENT)
            .header("Accept", "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1")
            .header("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.6")
            .header("Accept-Encoding", "identity")
            .GET()
            .build();
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
        var status = response.statusCode();
        if (status >= 300 && status < 400) {
            if (redirects >= MAX_REDIRECTS) {
                throw new IllegalArgumentException("网站重定向次数过多。");
            }
            var location = response.headers().firstValue("location")
                .orElseThrow(() -> new IllegalArgumentException("网站返回了无效重定向。"));
            try (var ignored = response.body()) {
                return fetch(normalizeAndValidate(uri.resolve(location).toString()), redirects + 1);
            }
        }
        if (status < 200 || status >= 300) {
            throw new IllegalArgumentException("目标网站返回 HTTP " + status + "。");
        }
        var contentType = response.headers().firstValue("content-type").orElse("")
            .toLowerCase(Locale.ROOT);
        if (!contentType.isBlank()
            && !contentType.contains("text/html")
            && !contentType.contains("application/xhtml+xml")) {
            throw new IllegalArgumentException("目标地址不是可读取的网页。");
        }
        try (var body = response.body()) {
            var bytes = body.readNBytes(MAX_RESPONSE_BYTES + 1);
            if (bytes.length > MAX_RESPONSE_BYTES) {
                throw new IllegalArgumentException("网页内容超过 2 MB，已停止读取。");
            }
            return new FetchResult(uri, bytes);
        }
    }

    static URI normalizeAndValidate(String rawUrl) {
        var value = rawUrl == null ? "" : rawUrl.trim();
        if (value.isBlank()) {
            throw new IllegalArgumentException("请先输入网站链接。");
        }
        var sharedUrl = SHARED_URL.matcher(value);
        if (sharedUrl.find()) {
            value = sharedUrl.group().replaceFirst("[\\]\\[)）}】>,，。；;！？!?]+$", "");
        }
        if (value.length() > 2048) {
            throw new IllegalArgumentException("链接过长。");
        }
        if (!value.matches("(?i)^https?://.*")) {
            value = "https://" + value;
        }
        final URI uri;
        try {
            uri = URI.create(value).normalize();
        } catch (IllegalArgumentException error) {
            throw new IllegalArgumentException("链接格式不正确。");
        }
        var scheme = uri.getScheme();
        if (!("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme))) {
            throw new IllegalArgumentException("只支持 http 或 https 链接。");
        }
        if (uri.getHost() == null || uri.getUserInfo() != null) {
            throw new IllegalArgumentException("链接必须包含有效的公网域名。");
        }
        var port = uri.getPort();
        if (port != -1 && port != 80 && port != 443) {
            throw new IllegalArgumentException("只允许访问网站的 80 或 443 端口。");
        }
        validatePublicHost(uri);
        return uri;
    }

    static void validatePublicHost(URI uri) {
        var host = uri.getHost().toLowerCase(Locale.ROOT);
        if (host.equals("localhost") || host.endsWith(".localhost")
            || host.endsWith(".local") || host.endsWith(".internal")) {
            throw new IllegalArgumentException("不允许读取本地或内网地址。");
        }
        final InetAddress[] addresses;
        try {
            addresses = InetAddress.getAllByName(host);
        } catch (UnknownHostException error) {
            throw new IllegalArgumentException("无法解析目标网站域名。");
        }
        for (var address : addresses) {
            if (!isPublicAddress(address)) {
                throw new IllegalArgumentException("不允许读取本地或内网地址。");
            }
        }
    }

    static boolean isPublicAddress(InetAddress address) {
        if (address.isAnyLocalAddress() || address.isLoopbackAddress()
            || address.isLinkLocalAddress() || address.isSiteLocalAddress()
            || address.isMulticastAddress()) {
            return false;
        }
        var bytes = address.getAddress();
        if (address instanceof Inet4Address) {
            var first = Byte.toUnsignedInt(bytes[0]);
            var second = Byte.toUnsignedInt(bytes[1]);
            var third = Byte.toUnsignedInt(bytes[2]);
            return first != 0
                && first != 127
                && !(first == 100 && second >= 64 && second <= 127)
                && !(first == 169 && second == 254)
                && !(first == 192 && second == 0 && third == 0)
                && !(first == 192 && second == 0 && third == 2)
                && !(first == 192 && second == 88 && third == 99)
                && !(first == 198 && (second == 18 || second == 19))
                && !(first == 198 && second == 51 && third == 100)
                && !(first == 203 && second == 0 && third == 113)
                && first < 224;
        }
        if (address instanceof Inet6Address) {
            var mappedPrefix = true;
            for (var index = 0; index < 10; index++) {
                if (bytes[index] != 0) {
                    mappedPrefix = false;
                    break;
                }
            }
            var ipv4Mapped = mappedPrefix
                && bytes[10] == (byte) 0xff && bytes[11] == (byte) 0xff;
            var compatiblePrefix = mappedPrefix && bytes[10] == 0 && bytes[11] == 0;
            if (ipv4Mapped || compatiblePrefix) {
                try {
                    return isPublicAddress(InetAddress.getByAddress(Arrays.copyOfRange(bytes, 12, 16)));
                } catch (UnknownHostException ignored) {
                    return false;
                }
            }
            var first = Byte.toUnsignedInt(bytes[0]);
            var documentationPrefix = first == 0x20
                && Byte.toUnsignedInt(bytes[1]) == 0x01
                && Byte.toUnsignedInt(bytes[2]) == 0x0d
                && Byte.toUnsignedInt(bytes[3]) == 0xb8;
            return (first & 0xfe) != 0xfc && !documentationPrefix;
        }
        return false;
    }

    static String detectPlatform(String host) {
        var value = host.toLowerCase(Locale.ROOT);
        if (matchesHost(value, "github.com")) return "github";
        if (matchesHost(value, "bilibili.com") || matchesHost(value, "b23.tv")) return "bilibili";
        if (matchesHost(value, "behance.net")) return "behance";
        if (matchesHost(value, "xiaohongshu.com") || matchesHost(value, "xhslink.com")) return "xiaohongshu";
        if (matchesHost(value, "xinpianchang.com")) return "xinpianchang";
        if (matchesHost(value, "dribbble.com")) return "dribbble";
        if (matchesHost(value, "artstation.com")) return "artstation";
        if (value.contains("pinterest.")) return "pinterest";
        return "website";
    }

    private static boolean matchesHost(String host, String domain) {
        return host.equals(domain) || host.endsWith("." + domain);
    }

    private static String platformLabel(String platform, String host) {
        return switch (platform) {
            case "github" -> "GitHub";
            case "bilibili" -> "Bilibili";
            case "behance" -> "Behance";
            case "xiaohongshu" -> "小红书";
            case "xinpianchang" -> "新片场";
            case "dribbble" -> "Dribbble";
            case "artstation" -> "ArtStation";
            case "pinterest" -> "Pinterest";
            default -> host;
        };
    }

    private static String findIcon(Document document, URI pageUri) {
        for (Element link : document.select("link[rel]")) {
            if (link.attr("rel").toLowerCase(Locale.ROOT).contains("icon")) {
                var icon = firstHttpUrl(link.absUrl("href"));
                if (!icon.isBlank()) return icon;
            }
        }
        return pageUri.resolve("/favicon.ico").toString();
    }

    private static String firstContent(Document document, String selector, String attribute) {
        var element = document.selectFirst(selector);
        return element == null ? "" : element.attr(attribute).trim();
    }

    private static String absolute(Document document, String selector, String attribute) {
        var element = document.selectFirst(selector);
        return element == null ? "" : element.absUrl(attribute).trim();
    }

    private static String firstNonBlank(String... values) {
        for (var value : values) {
            if (value != null && !value.isBlank()) return value.trim();
        }
        return "";
    }

    private static String firstHttpUrl(String... values) {
        for (var value : values) {
            if (value == null || value.isBlank()) continue;
            try {
                var uri = URI.create(value.trim());
                if (("http".equalsIgnoreCase(uri.getScheme())
                    || "https".equalsIgnoreCase(uri.getScheme())) && uri.getHost() != null) {
                    return uri.toString();
                }
            } catch (IllegalArgumentException ignored) {
                // Try the next metadata candidate.
            }
        }
        return "";
    }

    static String firstPublicHttpUrl(String... values) {
        for (var value : values) {
            var candidate = firstHttpUrl(value);
            if (candidate.isBlank()) continue;
            try {
                var uri = URI.create(candidate);
                var port = uri.getPort();
                if (port != -1 && port != 80 && port != 443) continue;
                validatePublicHost(uri);
                return candidate;
            } catch (IllegalArgumentException ignored) {
                // Metadata can contain private, malformed, or unreachable asset URLs.
            }
        }
        return "";
    }

    private static String limit(String value, int maxLength) {
        var normalized = value == null ? "" : value.replaceAll("\\s+", " ").trim();
        return normalized.length() <= maxLength
            ? normalized
            : normalized.substring(0, maxLength - 1) + "…";
    }

    private static String userMessage(Throwable error) {
        var message = error.getMessage();
        if (message == null || message.isBlank()) return "无法读取该网站信息。";
        return message;
    }

    record FetchResult(URI uri, byte[] body) {
    }

    record JsonMetadata(
        String siteName,
        String title,
        String description,
        String iconUrl,
        String imageUrl
    ) {
        static JsonMetadata empty() {
            return new JsonMetadata("", "", "", "", "");
        }

        boolean hasContent() {
            return !title.isBlank() || !description.isBlank() || !imageUrl.isBlank();
        }
    }

    public record LinkMetadataResponse(
        String url,
        String host,
        String platform,
        String siteName,
        String title,
        String description,
        String iconUrl,
        String imageUrl,
        String source
    ) {
    }
}
