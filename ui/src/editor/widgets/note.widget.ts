import { attrField, contentField, defineWidget, noteColorOptions } from './kit'

export default defineWidget({
  id: 'note',
  title: '便签',
  description: '纸条式重点记录。',
  category: '提示',
  kind: 'block',
  tagName: 'xhhao-com-note',
  attributes: { color: 'yellow' },
  innerHTML: '这里写便签内容。',
  keywords: ['note'],
  fields: [
    attrField('color', '颜色', 'select', undefined, noteColorOptions),
    attrField('rotate', '旋转', 'checkbox'),
    contentField('便签内容', '这里写便签内容。'),
  ],
})
