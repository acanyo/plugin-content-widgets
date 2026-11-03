package com.xhhao.contentwidgets.mcp;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import run.halo.mcpserver.api.McpToolAnnotations;
import run.halo.mcpserver.api.McpToolDefinition;
import run.halo.mcpserver.api.McpToolException;
import run.halo.mcpserver.api.McpToolInvocation;
import run.halo.mcpserver.api.McpToolProvider;
import run.halo.mcpserver.api.McpToolResult;

/**
 * 通过 MCP Server 插件向 AI 客户端暴露本插件提供的文章组件。
 *
 * <p>{@code list_widgets} 返回根据 Console 编辑器元数据生成的组件目录；
 * {@code render_widget} 将选定的组件序列化为需要嵌入文章内容的 HTML 片段。
 */
public class ContentWidgetsMcpToolProvider implements McpToolProvider {

    static final int DEFAULT_PAGE_SIZE = 10;
    static final int MAX_PAGE_SIZE = 50;

    private final WidgetManifest manifest;
    private final ObjectMapper objectMapper;
    private final WidgetResolver resolver;
    private final AuthenticationTrustResolver authTrustResolver =
            new AuthenticationTrustResolverImpl();

    public ContentWidgetsMcpToolProvider(WidgetManifestLoader loader) {
        this(loader.load(), new ObjectMapper());
    }

    ContentWidgetsMcpToolProvider(WidgetManifest manifest, ObjectMapper objectMapper) {
        this.manifest = manifest;
        this.objectMapper = objectMapper;
        this.resolver = new WidgetResolver(manifest);
    }

    @Override
    public Flux<McpToolDefinition> tools() {
        return Flux.just(listWidgets(), renderWidget());
    }

    private McpToolDefinition listWidgets() {
        var properties = new LinkedHashMap<String, Object>();
        properties.put("category", Map.of("type", "string"));
        properties.put("kind", Map.of(
                "type", "string", "enum", List.of("block", "inline")));
        properties.put("keyword", Map.of(
                "type", "string",
                "description", "Matches id, title, description or keywords case-insensitively"));
        properties.put("page", Map.of(
                "type", "integer",
                "minimum", 1,
                "default", 1,
                "description", "1-based page number; defaults to 1"));
        properties.put("page_size", Map.of(
                "type", "integer",
                "minimum", 1,
                "maximum", MAX_PAGE_SIZE,
                "default", DEFAULT_PAGE_SIZE,
                "description", "Number of widgets per page (1-" + MAX_PAGE_SIZE
                        + "); defaults to " + DEFAULT_PAGE_SIZE));
        return McpToolDefinition.builder()
                .name("list_widgets")
                .title("List content widgets")
                .description("""
                        List the content widgets (custom HTML elements) provided by the 文章组件 \
                        plugin, including tag names, attribute fields, options and content \
                        requirements. Call this before render_widget to choose a suitable widget. \
                        For each widget, fields[].options lists the legal enum values for select \
                        attributes; always use these exact values. Block widgets occupy their own \
                        line; inline widgets embed inside a paragraph. Results are paginated: the \
                        response contains page, page_size, total, total_pages, has_next and \
                        has_previous. To retrieve the whole catalog, increment page while has_next \
                        is true, reusing the same filters. The current page is returned as JSON in \
                        the response content.""")
                .displayTitle("列出文章组件")
                .displayDescription("分页列出文章组件插件提供的组件及其标签名、属性字段和内容要求。")
                .inputSchema(schema(properties, List.of()))
                .outputSchema(WidgetOutputSchemas.list())
                .annotations(McpToolAnnotations.readOnly("List content widgets"))
                .permission(this::authenticated)
                .handler(this::handleListWidgets)
                .build();
    }

    private Mono<McpToolResult> handleListWidgets(McpToolInvocation invocation) {
        return Mono.defer(() -> {
            var arguments = invocation.arguments();
            var category = (String) arguments.get("category");
            var kind = (String) arguments.get("kind");
            var keyword = ((String) arguments.get("keyword"));
            var needle = keyword == null || keyword.isBlank()
                    ? null
                    : keyword.toLowerCase(Locale.ROOT);
            var page = positiveInt(arguments.get("page"), 1);
            var pageSize = positiveInt(arguments.get("page_size"), DEFAULT_PAGE_SIZE);
            if (pageSize > MAX_PAGE_SIZE) {
                throw new McpToolException(
                        "INVALID_ARGUMENT",
                        "page_size must not exceed " + MAX_PAGE_SIZE);
            }

            var matching = manifest.widgets().stream()
                    .filter(widget -> category == null || category.equals(widget.category()))
                    .filter(widget -> kind == null || kind.equals(widget.kind()))
                    .filter(widget -> needle == null
                            || WidgetResolver.matchesKeyword(widget, needle))
                    .map(this::widgetAsMap)
                    .toList();

            var total = matching.size();
            var totalPages = (total + pageSize - 1) / pageSize;
            var fromIndex = Math.min((page - 1) * pageSize, total);
            var toIndex = Math.min(fromIndex + pageSize, total);
            // 超出范围的页码返回空列表而不是报错，调用方可以通过 has_next 判断是否到达末尾。
            var pageWidgets = matching.subList(fromIndex, toIndex);

            var payload = new LinkedHashMap<String, Object>();
            payload.put("widgets", pageWidgets);
            payload.put("page", page);
            payload.put("page_size", pageSize);
            payload.put("total", total);
            payload.put("total_pages", totalPages);
            payload.put("has_next", page < totalPages);
            payload.put("has_previous", page > 1);
            // 不设置显式文本内容：MCP Server 随后会将整个 payload（包括字段和枚举选项）
            // 序列化为所有客户端都能读取的文本内容。
            return Mono.just(McpToolResult.success(payload));
        });
    }

    private static int positiveInt(Object value, int fallback) {
        if (value == null) {
            return fallback;
        }
        if (!(value instanceof Number number)) {
            throw new McpToolException(
                    "INVALID_ARGUMENT", "page and page_size must be integers");
        }
        var integer = number.intValue();
        if (integer < 1) {
            throw new McpToolException(
                    "INVALID_ARGUMENT", "page and page_size must be greater than 0");
        }
        return integer;
    }

    private McpToolDefinition renderWidget() {
        var properties = new LinkedHashMap<String, Object>();
        properties.put("widget", Map.of(
                "type", "string",
                "minLength", 1,
                "description", "Widget id or tag_name returned by list_widgets"));
        properties.put("attributes", Map.of(
                "type", "object",
                "description", "Attribute values declared by the widget fields",
                "additionalProperties", Map.of("oneOf", List.of(
                        Map.of("type", "string"),
                        Map.of("type", "boolean")))));
        properties.put("content", Map.of(
                "type", "string",
                "description", "Raw inner HTML of the widget; defaults to the widget template"));
        return McpToolDefinition.builder()
                .name("render_widget")
                .title("Render content widget HTML")
                .description("""
                        Render the HTML snippet for one content widget so it can be embedded in a \
                        post or page. The returned html must be inserted into the content verbatim \
                        and is rendered at runtime by the 文章组件 plugin on the site theme. The \
                        widget argument accepts the id, tag name (with or without the xhhao-com- \
                        prefix), keywords, and tolerates case differences and singular/plural \
                        forms; use exactly the id returned by list_widgets when possible.""")
                .displayTitle("渲染文章组件 HTML")
                .displayDescription("根据组件和属性生成可直接嵌入文章内容的 HTML 片段。")
                .inputSchema(schema(properties, List.of("widget")))
                .outputSchema(WidgetOutputSchemas.render())
                .annotations(McpToolAnnotations.readOnly("Render content widget HTML"))
                .permission(this::authenticated)
                .handler(this::handleRenderWidget)
                .build();
    }

    private Mono<McpToolResult> handleRenderWidget(McpToolInvocation invocation) {
        return Mono.defer(() -> {
            var arguments = invocation.arguments();
            var widget = resolver.resolve((String) arguments.get("widget"));
            var html = WidgetHtmlRenderer.render(widget, arguments);

            var data = Map.<String, Object>of(
                    "id", widget.id(),
                    "tag_name", widget.tagName(),
                    "html", html);
            return Mono.just(McpToolResult.success(
                    data, "Embed this HTML snippet in the post content verbatim:\n" + html));
        });
    }

    private Map<String, Object> widgetAsMap(WidgetManifest.Widget widget) {
        var map = objectMapper.convertValue(widget, Map.class);
        @SuppressWarnings("unchecked")
        var typed = (Map<String, Object>) map;
        return new LinkedHashMap<>(typed);
    }

    private Mono<Boolean> authenticated(McpToolInvocation invocation) {
        return ReactiveSecurityContextHolder.getContext()
                .map(context -> context.getAuthentication())
                .map(authTrustResolver::isAuthenticated)
                .defaultIfEmpty(false);
    }

    private static Map<String, Object> schema(
            Map<String, Object> properties, List<String> required) {
        return Map.of(
                "type", "object",
                "properties", properties,
                "required", required,
                "additionalProperties", false);
    }
}
