import { attrField, defineWidget, listField, listItemContentField } from './kit'

export default defineWidget({
  id: 'split',
  title: '分栏',
  description: '把内容横向拆成多个栏。',
  category: '布局',
  kind: 'block',
  tagName: 'xhhao-com-split',
  attributes: { cols: '2', gap: '1rem' },
  innerHTML: '<div>左侧内容</div><div>右侧内容</div>',
  keywords: ['split', 'columns'],
  fields: [
    attrField('cols', '列数', 'text', '2'),
    attrField('gap', '间距', 'text', '1rem'),
    listField({
      name: 'columns',
      label: '分栏',
      childTagName: 'div',
      addLabel: '添加分栏',
      itemLabel: '分栏',
      defaultItem: {
        content: '这里写分栏内容。',
      },
      itemFields: [listItemContentField('内容', '这里写分栏内容。')],
    }),
  ],
})
