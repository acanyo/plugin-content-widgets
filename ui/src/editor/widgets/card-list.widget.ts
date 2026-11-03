import { defineWidget, listField, listItemContentField } from './kit'

export default defineWidget({
  id: 'card-list',
  title: '卡片列表',
  description: '把列表内容呈现为卡片网格。',
  category: '布局',
  kind: 'block',
  tagName: 'xhhao-com-card-list',
  innerHTML: '<ul><li>卡片一</li><li>卡片二</li><li>卡片三</li></ul>',
  keywords: ['card', 'list'],
  fields: [
    listField({
      name: 'cards',
      label: '卡片',
      childTagName: 'li',
      wrapperTagName: 'ul',
      addLabel: '添加卡片',
      itemLabel: '卡片',
      defaultItem: {
        content: '卡片内容',
      },
      itemFields: [listItemContentField('内容', '卡片内容')],
    }),
  ],
})
