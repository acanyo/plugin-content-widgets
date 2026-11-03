import { attrField, contentField, defineWidget, statusOptions } from './kit'

export default defineWidget({
  id: 'alert',
  title: '提示框',
  description: '带状态图标和标题的内容提示。',
  category: '提示',
  kind: 'block',
  tagName: 'xhhao-com-alert',
  attributes: { type: 'tip', title: '提醒' },
  innerHTML: '这里写提示内容。',
  keywords: ['alert', 'tip', 'info', 'warning'],
  fields: [
    attrField('type', '状态', 'select', undefined, statusOptions),
    attrField('title', '标题', 'text', '提醒'),
    attrField('icon', '自定义图标', 'textarea', 'SVG 字符串或图片 URL'),
    contentField('正文', '这里写提示内容。'),
  ],
})
