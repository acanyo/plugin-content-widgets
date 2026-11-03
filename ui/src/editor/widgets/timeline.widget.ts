import { defineWidget, listField, listItemAttrField, listItemContentField } from './kit'

export default defineWidget({
  id: 'timeline',
  title: '时间线',
  description: '按时间顺序展示事件。',
  category: '布局',
  kind: 'block',
  tagName: 'xhhao-com-timeline',
  innerHTML:
    '<xhhao-com-timeline-item time="09:00">开始准备。</xhhao-com-timeline-item><xhhao-com-timeline-item time="10:30">完成关键节点。</xhhao-com-timeline-item>',
  keywords: ['timeline'],
  fields: [
    listField({
      name: 'items',
      label: '时间线',
      childTagName: 'xhhao-com-timeline-item',
      addLabel: '添加节点',
      itemLabel: '节点',
      defaultItem: {
        time: '现在',
        content: '这里写事件内容。',
      },
      itemFields: [
        listItemAttrField('time', '时间', 'text', '09:00'),
        listItemContentField('内容', '这里写事件内容。'),
      ],
    }),
  ],
})
