import { attrField, contentField, defineWidget } from './kit'
import {
  halfField,
  appearanceOptions,
  contentWidgetIconOptions,
  admonitionTypeOptions,
} from './appearance'

export default defineWidget({
  id: 'admonition',
  title: '增强提示框',
  description: '支持折叠、配色和常用图标的提示框。',
  category: '提示',
  kind: 'block',
  tagName: 'xhhao-com-admonition',
  attributes: {
    type: 'success',
    'show-title': 'true',
    collapsible: 'false',
    'default-open': 'true',
    appearance: 'auto',
  },
  innerHTML: '这里写提示内容。',
  keywords: ['admonition', 'alert', 'collapse', '提示框', '折叠', '配色'],

  fields: [
    halfField(attrField('type', '类型', 'select', undefined, admonitionTypeOptions)),
    halfField(attrField('appearance', '外观模式', 'select', undefined, appearanceOptions)),
    attrField('title', '自定义标题', 'text', '留空时跟随类型'),
    halfField(attrField('show-title', '显示标题', 'checkbox')),
    halfField(attrField('collapsible', '允许折叠', 'checkbox')),
    halfField(attrField('default-open', '默认展开', 'checkbox')),
    halfField(attrField('accent-color', '强调色', 'color', '留空时跟随类型')),
    halfField(attrField('background-color', '背景色', 'color', '留空时跟随类型')),
    halfField(attrField('text-color', '文字色', 'color', '留空时跟随类型')),
    attrField('icon-name', '常用图标', 'icon', undefined, contentWidgetIconOptions),
    attrField('icon', '自定义图标', 'text', 'SVG、Emoji 或图片 URL；填写后覆盖常用图标'),
    contentField('正文（支持 Markdown）', '支持标题、列表、链接、引用、代码块等 Markdown 语法'),
  ],
})
