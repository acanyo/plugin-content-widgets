import { defineWidget, listField, listItemAttrField, listItemContentField } from './kit'

export default defineWidget({
  id: 'task-list',
  title: '任务清单',
  description: '展示已完成和待完成事项。',
  category: '展示',
  kind: 'block',
  tagName: 'xhhao-com-task-list',
  innerHTML:
    '<xhhao-com-task checked>已完成事项</xhhao-com-task><xhhao-com-task>待完成事项</xhhao-com-task>',
  keywords: ['task', 'todo'],
  fields: [
    listField({
      name: 'tasks',
      label: '任务',
      childTagName: 'xhhao-com-task',
      addLabel: '添加任务',
      itemLabel: '任务',
      defaultItem: {
        checked: false,
        content: '待完成事项',
      },
      itemFields: [
        listItemAttrField('checked', '已完成', 'checkbox'),
        listItemContentField('任务内容', '待完成事项'),
      ],
    }),
  ],
})
