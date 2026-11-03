# 新增文章组件流程

一个文章组件由两部分组成，新增时需要同时维护两处：

| 层 | 位置 | 职责 |
| --- | --- | --- |
| 运行时渲染 | `packages/content-widgets/src/widgets/` | 定义 `xhhao-com-*` 自定义元素的挂载逻辑（Svelte 组件 + 样式） |
| 编辑器声明 | `ui/src/editor/widgets/` | 声明组件元信息（标题、分类、默认值）和编辑器配置表单字段 |

## 一、实现运行时组件（packages/content-widgets）

1. 新建 Svelte 组件 `src/components/Foo.svelte`，样式放 `src/styles/content-components/_foo.scss`。
2. 新建 `src/widgets/foo.ts`，导出 `tag` 和 `mount`（即 `WidgetModule`）：

```ts
import "../styles/base.scss";
import "../styles/content-components/_foo.scss";
import Foo from "../components/Foo.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-foo";

export function mount(element: HTMLElement) {
  mountComponent(element, Foo, { ...parseProps(element), content: innerHtml(element) });
}
```

3. 在 `src/widgets/index.ts` 中导入并追加到 `widgets` 数组。
4. 在 `src/loader/registry.ts` 的 `widgetLoaders` 中注册动态导入，键的顺序与 `widgets/index.ts` 保持一致（嵌套挂载按此顺序优先挂载内部组件）。
5. 在 `src/main/java/com/xhhao/contentwidgets/theme/ContentWidgetsHeadProcessor.java` 的 `WIDGET_TAGS` 中追加标签名。该清单用于生成首绘前隐藏未挂载标签的关键 CSS（防止无样式文本闪烁），漏加会导致新组件在挂载前直接露出原始文本。

## 二、声明编辑器组件（ui/src/editor/widgets）

1. 新建 `foo.widget.ts`，用 `defineWidget` 把「组件定义 + 编辑器字段」写在同一个文件里：

```ts
import { attrField, contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'foo',                    // 全局唯一
  title: '示例组件',
  description: '一句话描述，显示在组件选择器中。',
  category: '提示',             // 见下方「分类」约定
  kind: 'block',                // 'block' | 'inline'
  tagName: 'xhhao-com-foo',     // 必须与运行时 tag 一致
  attributes: { type: 'tip' },  // 插入时的默认属性（可选）
  innerHTML: '默认内容',         // 插入时的默认内部 HTML（可选）
  keywords: ['foo', 'demo'],    // 选择器搜索关键词（可选）
  fields: [                     // 编辑器配置表单（可选，省略则提示“无需配置”）
    attrField('type', '状态', 'select', undefined, statusOptions),
    attrField('title', '标题', 'text', '提醒'),
    contentField('正文', '这里写内容。'),
  ],
})
```

2. 在 `ui/src/editor/widgets/index.ts` 中导入并追加到 `widgetModules` 数组。**数组顺序即组件选择器中的展示顺序**，请追加到对应分类分组内。

注册表（`content-widget-registry.ts`）会自动聚合出组件列表、分类、块级/行内标签集合和编辑字段，无需改动其他文件。

## 三、字段构建器（kit.ts）

| 构建器 | 用途 |
| --- | --- |
| `attrField(name, label, type?, placeholder?, options?, accepts?)` | 编辑组件属性 |
| `contentField(label?, placeholder?)` | 编辑组件 `innerHTML` |
| `listField({...})` | 编辑子元素列表（如标签页、步骤），结果序列化为子标签 |
| `listItemAttrField(name, label, type?, placeholder?, options?)` | list 子项的属性字段 |
| `listItemContentField(label?, placeholder?)` | list 子项的内容字段 |

字段类型（`type`）：`text`、`textarea`、`select`（需配合 `options`）、`checkbox`（布尔属性，选中时写入空字符串属性）、`attachment`（Halo 附件选择，可用 `accepts` 限制类型，如 `['application/pdf']`）、`list`。

`listField` 关键配置：

- `childTagName`：子元素标签名；`wrapperTagName`：子元素外层的包裹标签（如 `<ul>`）。
- `itemFields` + `defaultItem`：子项表单与新增子项的默认值。
- `syncAttributeFromItems`：把子项某个字段同步为父元素属性（如 tab 的 `tabs="介绍,示例"`），`separator` 默认英文逗号。

共享选项：`statusOptions`、`resultOptions`、`noteColorOptions`、`badgeStatusOptions`、`buttonTypeOptions`，按需从 `./kit` 导入。

## 四、约定

- `tagName` 必须以 `xhhao-com-` 为前缀，且与运行时 `tag` 完全一致。
- `id` 在全部组件中唯一；文件名使用 kebab-case 的 `*.widget.ts`。
- `kind` 决定插入的编辑器节点类型：`block` 独占一行，`inline` 嵌入段落。
- `category` 从现有分类中选择：`提示`、`布局`、`代码`、`展示`、`行内`。确实需要新分类时直接填写新名称，选择器会自动出现该分类。
- 组件无配置项时省略 `fields`，编辑器会显示「这个组件无需配置」。
