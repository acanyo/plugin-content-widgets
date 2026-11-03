package com.xhhao.contentwidgets.mcp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import run.halo.mcpserver.api.McpToolDefinition;
import run.halo.mcpserver.api.McpToolException;
import run.halo.mcpserver.api.McpToolInvocation;
import run.halo.mcpserver.api.McpToolResult;

class ContentWidgetsMcpToolProviderTest {

    private ContentWidgetsMcpToolProvider provider;

    @BeforeEach
    void setUp() {
        var alert = new WidgetManifest.Widget(
                "alert",
                "提示框",
                "带状态图标和标题的内容提示。",
                "提示",
                "block",
                "xhhao-com-alert",
                Map.of("type", "tip", "title", "提醒"),
                "这里写提示内容。",
                List.of("alert", "tip"),
                List.of(
                        selectField("type", "状态"),
                        attrField("title", "标题"),
                        contentField()));
        var tab = new WidgetManifest.Widget(
                "tab",
                "标签页",
                "将内容切分到多个页签中。",
                "布局",
                "block",
                "xhhao-com-tab",
                Map.of("tabs", "介绍,示例", "active", "1"),
                "<xhhao-com-tab-panel>第一个页签</xhhao-com-tab-panel>",
                List.of("tab"),
                List.of(
                        attrField("active", "激活序号"),
                        checkboxField("center", "居中"),
                        listField()));
        var manifest = new WidgetManifest(List.of(alert, tab));
        provider = new ContentWidgetsMcpToolProvider(manifest, new ObjectMapper());
    }

    @Test
    void shouldContributeTwoTools() {
        var names = provider.tools().map(McpToolDefinition::name).collectList().block();
        assertEquals(List.of("list_widgets", "render_widget"), names);
    }

    @Test
    void outputSchemasShouldMatchRealManifestPayloads() {
        var realManifest = new WidgetManifestLoader().load();
        var realProvider = new ContentWidgetsMcpToolProvider(realManifest, new ObjectMapper());
        var definitions = realProvider.tools()
                .collectMap(McpToolDefinition::name)
                .block();
        var listOutputSchema = definitions.get("list_widgets").outputSchema();
        var renderOutputSchema = definitions.get("render_widget").outputSchema();
        assertNotNull(listOutputSchema);
        assertNotNull(renderOutputSchema);

        // list_widgets: walk every page and validate the full payload, including nested
        // fields/options with their nullable variants.
        var pageSize = 5;
        var page = 1;
        var seen = 0;
        while (true) {
            var result = invoke(
                            realProvider,
                            "list_widgets",
                            Map.of("page", page, "page_size", pageSize))
                    .block();
            assertValidSchema(listOutputSchema, result.structuredContent());
            var widgets = (List<?>) result.structuredContent().get("widgets");
            seen += widgets.size();
            if (!Boolean.TRUE.equals(result.structuredContent().get("has_next"))) {
                break;
            }
            page++;
        }
        assertEquals(realManifest.widgets().size(), seen);

        // render_widget: every real widget must render with defaults and conform to its schema.
        for (var widget : realManifest.widgets()) {
            var result = invoke(
                            realProvider,
                            "render_widget",
                            Map.of("widget", widget.id()))
                    .block();
            assertFalse(result.error());
            assertValidSchema(renderOutputSchema, result.structuredContent());
        }
    }

    /** Minimal recursive JSON Schema subset checker (type/properties/required/items). */
    @SuppressWarnings("unchecked")
    private static void assertValidSchema(Map<String, Object> schema, Object value) {
        var typeDeclaration = schema.get("type");
        List<String> allowedTypes;
        if (typeDeclaration instanceof List<?> list) {
            allowedTypes = list.stream().map(String::valueOf).toList();
        } else {
            allowedTypes = List.of((String) typeDeclaration);
        }
        var actualType = jsonTypeOf(value);
        assertTrue(allowedTypes.contains(actualType),
                "value '" + value + "' does not match any type " + allowedTypes);

        if ("object".equals(actualType)) {
            var map = (Map<String, Object>) value;
            var properties = (Map<String, Object>) schema.get("properties");
            var required = (List<?>) schema.getOrDefault("required", List.of());
            for (var name : required) {
                assertTrue(map.containsKey(name), "missing required property '" + name + "'");
            }
            var additionalProperties = schema.get("additionalProperties");
            if (Boolean.FALSE.equals(additionalProperties)) {
                for (var name : map.keySet()) {
                    assertTrue(properties != null && properties.containsKey(name),
                            "undeclared property '" + name + "'");
                }
            } else if (additionalProperties instanceof Map<?, ?> additional) {
                for (var entry : map.entrySet()) {
                    if (properties == null || !properties.containsKey(entry.getKey())) {
                        assertValidSchema((Map<String, Object>) additional, entry.getValue());
                    }
                }
            }
            if (properties != null) {
                for (var entry : map.entrySet()) {
                    if (properties.containsKey(entry.getKey())) {
                        assertValidSchema(
                                (Map<String, Object>) properties.get(entry.getKey()),
                                entry.getValue());
                    }
                }
            }
        } else if ("array".equals(actualType)) {
            var items = schema.get("items");
            if (items instanceof Map<?, ?> itemSchema) {
                for (var element : (List<?>) value) {
                    assertValidSchema((Map<String, Object>) itemSchema, element);
                }
            }
        }
    }

    private static String jsonTypeOf(Object value) {
        if (value == null) {
            return "null";
        }
        if (value instanceof Boolean) {
            return "boolean";
        }
        if (value instanceof Integer || value instanceof Long) {
            return "integer";
        }
        if (value instanceof Number) {
            return "number";
        }
        if (value instanceof CharSequence) {
            return "string";
        }
        if (value instanceof List) {
            return "array";
        }
        if (value instanceof Map) {
            return "object";
        }
        throw new IllegalArgumentException("Unsupported value type: " + value.getClass());
    }

    @Test
    void shouldListAllWidgetsWithoutFilters() {
        invokeList(Map.of())
                .assertNext(result -> {
                    assertFalse(result.error());
                    var widgets = widgets(result);
                    assertEquals(2, widgets.size());
                    assertEquals(1, result.structuredContent().get("page"));
                    assertEquals(10, result.structuredContent().get("page_size"));
                    assertEquals(2, result.structuredContent().get("total"));
                    assertEquals(1, result.structuredContent().get("total_pages"));
                    assertEquals(false, result.structuredContent().get("has_next"));
                    assertEquals(false, result.structuredContent().get("has_previous"));
                })
                .verifyComplete();
    }

    @Test
    void shouldPaginateResults() {
        var pagedProvider = new ContentWidgetsMcpToolProvider(
                buildManyWidgets(25), new ObjectMapper());

        // First page
        invokeList(pagedProvider, Map.of("page_size", 5))
                .assertNext(result -> {
                    var widgets = widgets(result);
                    assertEquals(5, widgets.size());
                    assertEquals("widget-0", widgets.get(0).get("id"));
                    assertEquals("widget-4", widgets.get(4).get("id"));
                    assertEquals(1, result.structuredContent().get("page"));
                    assertEquals(25, result.structuredContent().get("total"));
                    assertEquals(5, result.structuredContent().get("total_pages"));
                    assertEquals(true, result.structuredContent().get("has_next"));
                    assertEquals(false, result.structuredContent().get("has_previous"));
                })
                .verifyComplete();

        // Last page
        invokeList(pagedProvider, Map.of("page", 5, "page_size", 5))
                .assertNext(result -> {
                    var widgets = widgets(result);
                    assertEquals(5, widgets.size());
                    assertEquals("widget-24", widgets.get(4).get("id"));
                    assertEquals(false, result.structuredContent().get("has_next"));
                    assertEquals(true, result.structuredContent().get("has_previous"));
                })
                .verifyComplete();

        // Page past the end: empty, no error
        invokeList(pagedProvider, Map.of("page", 6, "page_size", 5))
                .assertNext(result -> {
                    assertEquals(0, widgets(result).size());
                    assertEquals(false, result.structuredContent().get("has_next"));
                })
                .verifyComplete();
    }

    @Test
    void shouldRejectInvalidPaginationArguments() {
        var pagedProvider = new ContentWidgetsMcpToolProvider(
                buildManyWidgets(25), new ObjectMapper());

        expectInvalidArgument(
                pagedProvider,
                Map.of("page", 0),
                "greater than 0");

        expectInvalidArgument(
                pagedProvider,
                Map.of("page_size", 51),
                "must not exceed 50");

        expectInvalidArgument(
                pagedProvider,
                Map.of("page", "first"),
                "must be integers");
    }

    private static WidgetManifest buildManyWidgets(int count) {
        var widgets = new java.util.ArrayList<WidgetManifest.Widget>();
        for (var i = 0; i < count; i++) {
            widgets.add(new WidgetManifest.Widget(
                    "widget-" + i,
                    "组件" + i,
                    "分页测试组件。",
                    "测试",
                    "block",
                    "xhhao-com-test-" + i,
                    Map.of(),
                    "",
                    List.of(),
                    List.of()));
        }
        return new WidgetManifest(widgets);
    }

    @Test
    void shouldFilterWidgetsByKindCategoryAndKeyword() {
        invokeList(Map.of("category", "布局"))
                .assertNext(result -> assertEquals(1, widgets(result).size()))
                .verifyComplete();

        invokeList(Map.of("keyword", "ALERT"))
                .assertNext(result -> {
                    var widgets = widgets(result);
                    assertEquals(1, widgets.size());
                    assertEquals("alert", widgets.get(0).get("id"));
                })
                .verifyComplete();

        invokeList(Map.of("keyword", "nonexistent"))
                .assertNext(result -> assertEquals(0, widgets(result).size()))
                .verifyComplete();
    }

    @Test
    void shouldRenderWidgetByIdWithDefaultsAndContent() {
        var args = Map.<String, Object>of(
                "widget", "alert",
                "attributes", Map.of("type", "warning"),
                "content", "正文内容");
        invokeRender(args)
                .assertNext(result -> {
                    assertFalse(result.error());
                    assertEquals("xhhao-com-alert", result.structuredContent().get("tag_name"));
                    assertEquals(
                            "<xhhao-com-alert type=\"warning\" title=\"提醒\">正文内容"
                                    + "</xhhao-com-alert>",
                            result.structuredContent().get("html"));
                })
                .verifyComplete();
    }

    @Test
    void shouldRenderByTagNameAndEscapeAttributeValues() {
        var args = Map.<String, Object>of(
                "widget", "xhhao-com-alert",
                "attributes", Map.of("title", "A&B < \"quoted\" 'x'"));
        invokeRender(args)
                .assertNext(result -> assertEquals(
                        "<xhhao-com-alert type=\"tip\" title=\"A&amp;B &lt; "
                                + "&quot;quoted&quot; &#39;x&#39;\">这里写提示内容。"
                                + "</xhhao-com-alert>",
                        result.structuredContent().get("html")))
                .verifyComplete();
    }

    @Test
    void shouldHandleCheckboxAttributes() {
        var enabled = Map.<String, Object>of(
                "widget", "tab",
                "attributes", Map.of("center", true));
        invokeRender(enabled)
                .assertNext(result -> assertEquals(
                        "<xhhao-com-tab active=\"1\" center=\"\" tabs=\"介绍,示例\">"
                                + "<xhhao-com-tab-panel>第一个页签</xhhao-com-tab-panel>"
                                + "</xhhao-com-tab>",
                        result.structuredContent().get("html")))
                .verifyComplete();

        var disabled = Map.<String, Object>of(
                "widget", "tab",
                "attributes", Map.of("center", false));
        invokeRender(disabled)
                .assertNext(result -> assertEquals(
                        "<xhhao-com-tab active=\"1\" tabs=\"介绍,示例\">"
                                + "<xhhao-com-tab-panel>第一个页签</xhhao-com-tab-panel>"
                                + "</xhhao-com-tab>",
                        result.structuredContent().get("html")))
                .verifyComplete();
    }

    @Test
    void shouldReturnCompleteCatalogAsText() {
        invokeList(Map.of())
                .assertNext(result -> {
                    assertFalse(result.error());
                    // Full payload is present as structured content...
                    var widgets = widgets(result);
                    assertEquals(2, widgets.size());
                    // ...and no short summary replaces it, so the MCP server serializes the
                    // payload into text content for text-only AI clients.
                    var typeField = widgets.get(0).get("fields");
                    assertTrue(String.valueOf(typeField).contains("question"));
                })
                .verifyComplete();
    }

    @Test
    void shouldValidateSelectEnumValues() {
        // "danger" is not a legal alert type; legal values are returned in the error.
        expectInvalidArgument(
                Map.of(
                        "widget", "alert",
                        "attributes", Map.of("type", "danger")),
                "Allowed values: [tip, info, question, warning, error]");

        // A legal select value still renders.
        invokeRender(Map.of(
                        "widget", "alert",
                        "attributes", Map.of("type", "error")))
                .assertNext(result -> assertEquals(
                        "<xhhao-com-alert type=\"error\" title=\"提醒\">这里写提示内容。"
                                + "</xhhao-com-alert>",
                        result.structuredContent().get("html")))
                .verifyComplete();
    }

    @Test
    void shouldResolveWidgetNameVariants() {
        // plural form
        expectResolvedId(Map.of("widget", "tabs"), "tab");
        // tag name with prefix and different case
        expectResolvedId(Map.of("widget", "XHHAO-COM-ALERT"), "alert");
        // keyword
        expectResolvedId(Map.of("widget", "Tip"), "alert");
        // close misspelling
        expectResolvedId(Map.of("widget", "alart"), "alert");
    }

    @Test
    void shouldRejectInvalidArguments() {
        expectInvalidArgument(
                Map.of("widget", "unknown"),
                "Did you mean");

        expectInvalidArgument(
                Map.of("widget", ""),
                "non-empty");

        expectInvalidArgument(
                Map.of("widget", "completely-different-name"),
                "Unknown widget");

        expectInvalidArgument(
                Map.of(
                        "widget", "alert",
                        "attributes", Map.of("bogus", "value")),
                "Unknown attributes");

        expectInvalidArgument(
                Map.of(
                        "widget", "alert",
                        "attributes", Map.of("title", 42)),
                "must be a string or boolean");

        expectInvalidArgument(
                Map.of(
                        "widget", "alert",
                        "attributes", Map.of("title", true)),
                "expects a string");
    }

    @Test
    void permissionShouldDenyUnauthenticatedCaller() {
        var definition = provider.tools()
                .filter(tool -> tool.name().equals("list_widgets"))
                .blockFirst();
        assertNotNull(definition);
        StepVerifier.create(definition.permission()
                        .check(new McpToolInvocation("list_widgets", Map.of())))
                .assertNext(allowed -> assertFalse(allowed))
                .verifyComplete();
    }

    @Test
    void toolDefinitionsShouldBeReadOnly() {
        provider.tools().doOnNext(definition -> {
            assertTrue(definition.annotations().readOnlyHint());
        }).blockLast();
    }

    private void expectResolvedId(Map<String, Object> args, String expectedId) {
        invokeRender(args)
                .assertNext(result -> assertEquals(
                        expectedId, result.structuredContent().get("id")))
                .verifyComplete();
    }

    private void expectInvalidArgument(Map<String, Object> args, String messageFragment) {
        expectInvalidArgument(provider, "render_widget", args, messageFragment);
    }

    private void expectInvalidArgument(
            ContentWidgetsMcpToolProvider targetProvider,
            Map<String, Object> args,
            String messageFragment) {
        expectInvalidArgument(targetProvider, "list_widgets", args, messageFragment);
    }

    private void expectInvalidArgument(
            ContentWidgetsMcpToolProvider targetProvider,
            String toolName,
            Map<String, Object> args,
            String messageFragment) {
        StepVerifier.create(invoke(targetProvider, toolName, args))
                .expectErrorSatisfies(error -> {
                    var exception = assertThrows(McpToolException.class, () -> {
                        throw error;
                    });
                    assertEquals("INVALID_ARGUMENT", exception.code());
                    assertTrue(exception.getMessage().contains(messageFragment),
                            "Expected message to contain '" + messageFragment + "' but was: "
                                    + exception.getMessage());
                })
                .verify();
    }

    private StepVerifier.FirstStep<McpToolResult> invokeList(Map<String, Object> args) {
        return invokeList(provider, args);
    }

    private StepVerifier.FirstStep<McpToolResult> invokeList(
            ContentWidgetsMcpToolProvider targetProvider, Map<String, Object> args) {
        return StepVerifier.create(invoke(targetProvider, "list_widgets", args));
    }

    private StepVerifier.FirstStep<McpToolResult> invokeRender(Map<String, Object> args) {
        return StepVerifier.create(invoke(provider, "render_widget", args));
    }

    private Mono<McpToolResult> invoke(
            ContentWidgetsMcpToolProvider targetProvider,
            String toolName,
            Map<String, Object> args) {
        var definition = targetProvider.tools()
                .filter(tool -> tool.name().equals(toolName))
                .blockFirst();
        assertNotNull(definition);
        return definition.handler()
                .execute(new McpToolInvocation(toolName, args));
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> widgets(McpToolResult result) {
        return (List<Map<String, Object>>) result.structuredContent().get("widgets");
    }

    private static WidgetManifest.Field attrField(String name, String label) {
        return new WidgetManifest.Field(
                name, label, "text", "attribute", null, null, null,
                null, null, null, null, null, null, null);
    }

    private static WidgetManifest.Field selectField(String name, String label) {
        return new WidgetManifest.Field(
                name, label, "select", "attribute", null,
                List.of(
                        new WidgetManifest.Option("提醒", "tip"),
                        new WidgetManifest.Option("信息", "info"),
                        new WidgetManifest.Option("问题", "question"),
                        new WidgetManifest.Option("警告", "warning"),
                        new WidgetManifest.Option("错误", "error")),
                null,
                null, null, null, null, null, null, null);
    }

    private static WidgetManifest.Field checkboxField(String name, String label) {
        return new WidgetManifest.Field(
                name, label, "checkbox", "attribute", null, null, null,
                null, null, null, null, null, null, null);
    }

    private static WidgetManifest.Field contentField() {
        return new WidgetManifest.Field(
                "innerHTML", "正文", "textarea", "innerHTML", null, null, null,
                null, null, null, null, null, null, null);
    }

    private static WidgetManifest.Field listField() {
        return new WidgetManifest.Field(
                "panels",
                "标签页",
                "list",
                "children",
                null,
                null,
                null,
                "xhhao-com-tab-panel",
                null,
                "添加标签页",
                "标签页",
                List.of(
                        new WidgetManifest.ItemField(
                                "title", "标签名", "text", "attribute", null, null, null),
                        new WidgetManifest.ItemField(
                                "content", "内容", "textarea", "content", null, null, null)),
                Map.of("title", "新标签", "content", "这里写标签页内容。"),
                new WidgetManifest.SyncedAttribute("tabs", "title", null));
    }
}
