import { attrField, buttonTypeOptions, contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'button',
  title: '按钮',
  description: '行内按钮链接。',
  category: '展示',
  kind: 'inline',
  tagName: 'xhhao-com-button',
  attributes: { href: 'https://www.xhhao.com', target: '_blank' },
  innerHTML: '访问链接',
  keywords: ['button', 'link'],
  fields: [
    attrField('type', '类型', 'select', undefined, buttonTypeOptions),
    attrField('href', '链接', 'text', 'https://www.xhhao.com'),
    attrField('target', '打开方式', 'text', '_blank'),
    attrField('icon', '图标', 'textarea', 'SVG 字符串或图片 URL'),
    contentField('按钮文本', '访问链接'),
  ],
})
