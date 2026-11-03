import { attrField, defineWidget } from './kit'

export default defineWidget({
  id: 'compare',
  title: '对比',
  description: '并排展示前后或左右内容。',
  category: '布局',
  kind: 'block',
  tagName: 'xhhao-com-compare',
  attributes: {
    'left-title': '之前',
    'right-title': '之后',
    left: '之前的内容',
    right: '之后的内容',
  },
  keywords: ['compare'],
  fields: [
    attrField('left-title', '左侧标题', 'text', '之前'),
    attrField('right-title', '右侧标题', 'text', '之后'),
    attrField('left', '左侧内容', 'textarea', '之前的内容'),
    attrField('right', '右侧内容', 'textarea', '之后的内容'),
  ],
})
