package com.xhhao.contentwidgets.mcp;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** 描述 MCP 工具结构化输出的 JSON Schema。 */
final class WidgetOutputSchemas {

    private static final Map<String, Object> OUT_STRING = Map.of("type", "string");
    private static final Map<String, Object> OUT_INTEGER = Map.of("type", "integer");
    private static final Map<String, Object> OUT_BOOLEAN = Map.of("type", "boolean");
    private static final Map<String, Object> OUT_NULLABLE_STRING =
            Map.of("type", List.of("string", "null"));

    private WidgetOutputSchemas() {
    }

    static Map<String, Object> render() {
        return objectOutput(
                Map.of(
                        "id", OUT_STRING,
                        "tag_name", OUT_STRING,
                        "html", OUT_STRING),
                List.of("id", "tag_name", "html"));
    }

    static Map<String, Object> list() {
        return objectOutput(
                Map.of(
                        "widgets", arrayOf(widgetOutputSchema()),
                        "page", OUT_INTEGER,
                        "page_size", OUT_INTEGER,
                        "total", OUT_INTEGER,
                        "total_pages", OUT_INTEGER,
                        "has_next", OUT_BOOLEAN,
                        "has_previous", OUT_BOOLEAN),
                List.of(
                        "widgets", "page", "page_size", "total",
                        "total_pages", "has_next", "has_previous"));
    }

    private static Map<String, Object> widgetOutputSchema() {
        return objectOutput(
                Map.ofEntries(
                        Map.entry("id", OUT_STRING),
                        Map.entry("title", OUT_STRING),
                        Map.entry("description", OUT_STRING),
                        Map.entry("category", OUT_STRING),
                        Map.entry("kind", OUT_STRING),
                        Map.entry("tagName", OUT_STRING),
                        Map.entry("attributes", Map.of(
                                "type", "object",
                                "additionalProperties", OUT_STRING)),
                        Map.entry("innerHTML", OUT_STRING),
                        Map.entry("keywords", arrayOf(OUT_STRING)),
                        Map.entry("fields", arrayOf(fieldOutputSchema()))),
                List.of(
                        "id", "title", "description", "category", "kind", "tagName",
                        "attributes", "innerHTML", "keywords", "fields"));
    }

    private static Map<String, Object> fieldOutputSchema() {
        return objectOutput(
                Map.ofEntries(
                        Map.entry("name", OUT_STRING),
                        Map.entry("label", OUT_STRING),
                        Map.entry("type", OUT_STRING),
                        Map.entry("source", OUT_STRING),
                        Map.entry("placeholder", OUT_NULLABLE_STRING),
                        Map.entry("options", nullableArrayOf(optionOutputSchema())),
                        Map.entry("accepts", nullableArrayOf(OUT_STRING)),
                        Map.entry("childTagName", OUT_NULLABLE_STRING),
                        Map.entry("wrapperTagName", OUT_NULLABLE_STRING),
                        Map.entry("addLabel", OUT_NULLABLE_STRING),
                        Map.entry("itemLabel", OUT_NULLABLE_STRING),
                        Map.entry("itemFields", nullableArrayOf(itemFieldOutputSchema())),
                        Map.entry("defaultItem", Map.of("type", List.of("object", "null"))),
                        Map.entry("syncAttributeFromItems", syncAttributeOutputSchema())),
                List.of(
                        "name", "label", "type", "source", "placeholder", "options",
                        "accepts", "childTagName", "wrapperTagName", "addLabel",
                        "itemLabel", "itemFields", "defaultItem", "syncAttributeFromItems"));
    }

    private static Map<String, Object> optionOutputSchema() {
        return objectOutput(
                Map.of("label", OUT_STRING, "value", OUT_STRING),
                List.of("label", "value"));
    }

    private static Map<String, Object> itemFieldOutputSchema() {
        return objectOutput(
                Map.of(
                        "name", OUT_STRING,
                        "label", OUT_STRING,
                        "type", OUT_STRING,
                        "source", OUT_STRING,
                        "placeholder", OUT_NULLABLE_STRING,
                        "options", nullableArrayOf(optionOutputSchema()),
                        "accepts", nullableArrayOf(OUT_STRING)),
                List.of(
                        "name", "label", "type", "source",
                        "placeholder", "options", "accepts"));
    }

    private static Map<String, Object> syncAttributeOutputSchema() {
        var schema = new LinkedHashMap<String, Object>();
        schema.put("type", List.of("object", "null"));
        schema.put("properties", Map.of(
                "attributeName", OUT_STRING,
                "itemName", OUT_STRING,
                "separator", OUT_NULLABLE_STRING));
        schema.put("required", List.of("attributeName", "itemName", "separator"));
        schema.put("additionalProperties", false);
        return schema;
    }

    private static Map<String, Object> arrayOf(Map<String, Object> items) {
        return Map.of("type", "array", "items", items);
    }

    private static Map<String, Object> nullableArrayOf(Map<String, Object> items) {
        return Map.of("type", List.of("array", "null"), "items", items);
    }

    private static Map<String, Object> objectOutput(
            Map<String, Object> properties, List<String> required) {
        var schema = new LinkedHashMap<String, Object>();
        schema.put("type", "object");
        schema.put("properties", properties);
        schema.put("required", required);
        schema.put("additionalProperties", false);
        return schema;
    }
}
