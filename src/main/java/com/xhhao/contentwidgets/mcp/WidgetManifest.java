package com.xhhao.contentwidgets.mcp;

import java.util.List;
import java.util.Map;

/**
 * 构建期生成的、描述本插件提供的所有文章组件的清单。
 *
 * <p>JSON 由 {@code ui/src/editor/widgets} 生成，与 Console 编辑器使用的元数据保持一致。
 */
public record WidgetManifest(List<Widget> widgets) {

    public record Widget(
            String id,
            String title,
            String description,
            String category,
            String kind,
            String tagName,
            Map<String, String> attributes,
            String innerHTML,
            List<String> keywords,
            List<Field> fields) {
    }

    public record Field(
            String name,
            String label,
            String type,
            String source,
            String placeholder,
            List<Option> options,
            List<String> accepts,
            String childTagName,
            String wrapperTagName,
            String addLabel,
            String itemLabel,
            List<ItemField> itemFields,
            Map<String, Object> defaultItem,
            SyncedAttribute syncAttributeFromItems) {
    }

    public record Option(String label, String value) {
    }

    public record ItemField(
            String name,
            String label,
            String type,
            String source,
            String placeholder,
            List<Option> options,
            List<String> accepts) {
    }

    public record SyncedAttribute(String attributeName, String itemName, String separator) {
    }
}
