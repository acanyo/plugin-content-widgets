package com.xhhao.contentwidgets.mcp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class WidgetManifestLoaderTest {

    private final WidgetManifestLoader loader = new WidgetManifestLoader();

    @Test
    void shouldReadManifestWithNestedFields() throws Exception {
        var json = """
                {
                  "widgets": [
                    {
                      "id": "tab",
                      "title": "标签页",
                      "description": "将内容切分到多个页签中。",
                      "category": "布局",
                      "kind": "block",
                      "tagName": "xhhao-com-tab",
                      "attributes": {"tabs": "介绍,示例", "active": "1"},
                      "innerHTML": "<xhhao-com-tab-panel>内容</xhhao-com-tab-panel>",
                      "keywords": ["tab"],
                      "fields": [
                        {"name": "center", "label": "居中", "type": "checkbox",
                         "source": "attribute"},
                        {"name": "panels", "label": "标签页", "type": "list",
                         "source": "children", "childTagName": "xhhao-com-tab-panel",
                         "syncAttributeFromItems": {"attributeName": "tabs",
                         "itemName": "title"},
                         "itemFields": [{"name": "title", "label": "标签名",
                         "type": "text", "source": "attribute"}]}
                      ]
                    }
                  ]
                }
                """;
        var manifest = loader.read(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)));

        assertEquals(1, manifest.widgets().size());
        var widget = manifest.widgets().get(0);
        assertEquals("tab", widget.id());
        assertEquals("block", widget.kind());
        assertEquals("介绍,示例", widget.attributes().get("tabs"));
        assertEquals(2, widget.fields().size());

        var listField = widget.fields().get(1);
        assertEquals("xhhao-com-tab-panel", listField.childTagName());
        assertEquals("tabs", listField.syncAttributeFromItems().attributeName());
        assertEquals("title", listField.itemFields().get(0).name());
    }

    @Test
    void shouldIgnoreUnknownProperties() throws Exception {
        var json = """
                {"widgets": [{"id": "alert", "tagName": "xhhao-com-alert",
                "futureField": "ignored"}]}
                """;
        var manifest = loader.read(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)));
        assertEquals("alert", manifest.widgets().get(0).id());
    }

    @Test
    void shouldFailWhenClasspathResourceMissing() {
        var error = assertThrows(
                IllegalStateException.class, () -> loader.load("/missing.json"));
        assertTrue(error.getMessage().contains("Classpath resource not found"));
    }
}
