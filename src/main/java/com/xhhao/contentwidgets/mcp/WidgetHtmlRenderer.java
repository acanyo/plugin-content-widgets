package com.xhhao.contentwidgets.mcp;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import run.halo.mcpserver.api.McpToolException;

/**
 * 将清单中的组件序列化为嵌入文章内容的 HTML 片段，并根据组件声明的字段和枚举选项
 * 校验调用方传入的属性。
 */
final class WidgetHtmlRenderer {

    private WidgetHtmlRenderer() {
    }

    static String render(WidgetManifest.Widget widget, Map<String, Object> arguments) {
        var rawAttributes = extractAttributes(arguments);
        var allowedAttributes = allowedAttributeNames(widget);
        var unknownAttributes = rawAttributes.keySet().stream()
                .filter(name -> !allowedAttributes.contains(name))
                .sorted()
                .toList();
        if (!unknownAttributes.isEmpty()) {
            throw new McpToolException(
                    "INVALID_ARGUMENT",
                    "Unknown attributes " + unknownAttributes + " for widget " + widget.id()
                            + ". Allowed attributes: " + allowedAttributes);
        }

        validateSelectValues(widget, rawAttributes);

        var serialized = new StringBuilder();
        for (var name : allowedAttributes) {
            if (rawAttributes.containsKey(name)) {
                appendProvidedAttribute(widget, serialized, name, rawAttributes.get(name));
            } else {
                var defaultValue = widget.attributes().get(name);
                if (defaultValue != null) {
                    appendAttribute(serialized, name, defaultValue);
                }
            }
        }

        var content = extractContent(widget, arguments);
        return "<" + widget.tagName() + serialized + ">" + content + "</"
                + widget.tagName() + ">";
    }

    /** 校验 select 类型属性的值是否在声明的枚举选项范围内。 */
    private static void validateSelectValues(
            WidgetManifest.Widget widget, Map<String, Object> rawAttributes) {
        if (widget.fields() == null) {
            return;
        }
        for (var field : widget.fields()) {
            if (!"attribute".equals(field.source())
                    || !"select".equals(field.type())
                    || !rawAttributes.containsKey(field.name())) {
                continue;
            }
            var value = rawAttributes.get(field.name());
            if (!(value instanceof String provided)) {
                continue;
            }
            var allowed = field.options() == null
                    ? List.<String>of()
                    : field.options().stream()
                            .map(WidgetManifest.Option::value)
                            .toList();
            if (!allowed.contains(provided)) {
                throw new McpToolException(
                        "INVALID_ARGUMENT",
                        "Invalid value '" + provided + "' for attribute '" + field.name()
                                + "' of widget " + widget.id() + ". Allowed values: " + allowed);
            }
        }
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> extractAttributes(Map<String, Object> arguments) {
        var value = arguments.get("attributes");
        if (value == null) {
            return Map.of();
        }
        if (!(value instanceof Map<?, ?> map)) {
            throw new McpToolException("INVALID_ARGUMENT", "attributes must be an object");
        }
        return (Map<String, Object>) map;
    }

    private static Set<String> allowedAttributeNames(WidgetManifest.Widget widget) {
        var names = new LinkedHashSet<String>();
        if (widget.fields() != null) {
            widget.fields().stream()
                    .filter(field -> "attribute".equals(field.source()))
                    .map(WidgetManifest.Field::name)
                    .forEach(names::add);
        }
        names.addAll(widget.attributes().keySet());
        return names;
    }

    private static void appendProvidedAttribute(
            WidgetManifest.Widget widget,
            StringBuilder serialized,
            String name,
            Object value) {
        if (value == null) {
            return;
        }
        if (value instanceof String string) {
            appendAttribute(serialized, name, string);
            return;
        }
        if (value instanceof Boolean flag) {
            var isCheckbox = widget.fields() != null
                    && widget.fields().stream()
                            .anyMatch(field -> "attribute".equals(field.source())
                                    && name.equals(field.name())
                                    && "checkbox".equals(field.type()));
            if (!isCheckbox) {
                throw new McpToolException(
                        "INVALID_ARGUMENT",
                        "Attribute '" + name + "' expects a string; boolean is only valid for"
                                + " checkbox attributes");
            }
            if (flag) {
                appendAttribute(serialized, name, "");
            }
            return;
        }
        throw new McpToolException(
                "INVALID_ARGUMENT",
                "Attribute '" + name + "' must be a string or boolean");
    }

    private static void appendAttribute(StringBuilder serialized, String name, String value) {
        serialized.append(' ')
                .append(name)
                .append("=\"")
                .append(escapeAttribute(value))
                .append('"');
    }

    private static String extractContent(
            WidgetManifest.Widget widget, Map<String, Object> arguments) {
        if (!arguments.containsKey("content")) {
            return widget.innerHTML() == null ? "" : widget.innerHTML();
        }
        var value = arguments.get("content");
        if (value == null) {
            return "";
        }
        if (!(value instanceof String string)) {
            throw new McpToolException("INVALID_ARGUMENT", "content must be a string");
        }
        return string;
    }

    private static String escapeAttribute(String value) {
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
