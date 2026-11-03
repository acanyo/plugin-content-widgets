package com.xhhao.contentwidgets.mcp;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import run.halo.mcpserver.api.McpToolException;

/**
 * 将组件选择器（id、标签名或关键词）解析为清单中的组件，并兼容 AI 客户端常发送的
 * 各种变体：大小写差异、连字符、{@code xhhao-com-} 前缀、关键词以及单复数形式
 * （例如 {@code tabs} 可匹配 {@code tab}）。
 */
class WidgetResolver {

    private final WidgetManifest manifest;

    WidgetResolver(WidgetManifest manifest) {
        this.manifest = manifest;
    }

    WidgetManifest.Widget resolve(String selector) {
        if (selector == null || selector.isBlank()) {
            throw new McpToolException(
                    "INVALID_ARGUMENT", "widget must be a non-empty id or tag name");
        }
        var widgets = manifest.widgets();

        for (var widget : widgets) {
            if (widget.id().equalsIgnoreCase(selector)
                    || widget.tagName().equalsIgnoreCase(selector)) {
                return widget;
            }
        }

        var needle = normalize(selector);
        if (!needle.isEmpty()) {
            for (var widget : widgets) {
                if (needle.equals(normalize(widget.id()))
                        || needle.equals(normalize(widget.tagName()))
                        || matchesKeyword(widget, needle)) {
                    return widget;
                }
            }
            for (var widget : widgets) {
                if (candidateTokens(widget).stream()
                        .anyMatch(token -> singularPlural(needle, token))) {
                    return widget;
                }
            }
            var threshold = needle.length() <= 3 ? 1 : 2;
            WidgetManifest.Widget fuzzy = null;
            var bestDistance = Integer.MAX_VALUE;
            for (var widget : widgets) {
                var distance = minDistance(widget, needle);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    fuzzy = widget;
                }
            }
            if (fuzzy != null && bestDistance <= threshold) {
                return fuzzy;
            }
        }

        var suggestions = widgets.stream()
                .map(widget -> Map.entry(widget, minDistance(widget, needle)))
                .sorted(Map.Entry.<WidgetManifest.Widget, Integer>comparingByValue())
                .limit(3)
                .map(entry -> entry.getKey().id() + " (" + entry.getKey().tagName() + ")")
                .toList();
        throw new McpToolException(
                "INVALID_ARGUMENT",
                "Unknown widget '" + selector + "'. Did you mean one of: "
                        + String.join(", ", suggestions)
                        + "? Call list_widgets for all valid ids and tag names.");
    }

    static boolean matchesKeyword(WidgetManifest.Widget widget, String needle) {
        if (contains(widget.id(), needle)
                || contains(widget.title(), needle)
                || contains(widget.description(), needle)) {
            return true;
        }
        return widget.keywords() != null
                && widget.keywords().stream().anyMatch(keyword -> contains(keyword, needle));
    }

    private static boolean contains(String value, String needle) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(needle);
    }

    private static List<String> candidateTokens(WidgetManifest.Widget widget) {
        var tokens = new LinkedHashSet<String>();
        tokens.add(normalize(widget.id()));
        tokens.add(normalize(widget.tagName()));
        if (widget.keywords() != null) {
            widget.keywords().stream()
                    .map(WidgetResolver::normalize)
                    .forEach(tokens::add);
        }
        tokens.remove("");
        return List.copyOf(tokens);
    }

    private static int minDistance(WidgetManifest.Widget widget, String needle) {
        return candidateTokens(widget).stream()
                .mapToInt(token -> levenshtein(needle, token))
                .min()
                .orElse(Integer.MAX_VALUE);
    }

    private static boolean singularPlural(String left, String right) {
        return stripPluralS(left).equals(right) || left.equals(stripPluralS(right));
    }

    private static String stripPluralS(String value) {
        return value.length() > 3 && value.endsWith("s")
                ? value.substring(0, value.length() - 1)
                : value;
    }

    private static String normalize(String value) {
        var builder = new StringBuilder(value.length());
        for (var i = 0; i < value.length(); i++) {
            var character = Character.toLowerCase(value.charAt(i));
            if (character >= 'a' && character <= 'z'
                    || character >= '0' && character <= '9') {
                builder.append(character);
            }
        }
        return builder.toString();
    }

    private static int levenshtein(String left, String right) {
        var previous = new int[right.length() + 1];
        var current = new int[right.length() + 1];
        for (var j = 0; j <= right.length(); j++) {
            previous[j] = j;
        }
        for (var i = 1; i <= left.length(); i++) {
            current[0] = i;
            for (var j = 1; j <= right.length(); j++) {
                var cost = left.charAt(i - 1) == right.charAt(j - 1) ? 0 : 1;
                current[j] = Math.min(
                        Math.min(current[j - 1] + 1, previous[j] + 1),
                        previous[j - 1] + cost);
            }
            System.arraycopy(current, 0, previous, 0, current.length);
        }
        return previous[right.length()];
    }
}
