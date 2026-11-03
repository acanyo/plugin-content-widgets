import { attrField, contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'tip',
  title: '悬浮提示',
  description: '鼠标悬浮时显示补充说明。',
  category: '提示',
  kind: 'inline',
  tagName: 'xhhao-com-tip',
  attributes: { tip: '这里是提示内容' },
  innerHTML: '提示文本',
  keywords: ['tip', 'tooltip'],
  fields: [
    attrField('tip', '悬浮提示', 'text', '这里是提示内容'),
    contentField('触发文本', '提示文本'),
  ],
})
