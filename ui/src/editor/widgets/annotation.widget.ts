import { attrField, contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'annotation',
  title: '批注',
  description: '给行内文本加小注释。',
  category: '行内',
  kind: 'inline',
  tagName: 'xhhao-com-annotation',
  attributes: { note: '说明' },
  innerHTML: '需要批注的文本',
  keywords: ['annotation'],
  fields: [attrField('note', '批注', 'text', '说明'), contentField('正文', '需要批注的文本')],
})
