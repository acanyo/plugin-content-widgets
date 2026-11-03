import { defineWidget, listField, listItemAttrField, listItemContentField } from './kit'

export default defineWidget({
  id: 'stepper',
  title: '步骤',
  description: '展示流程步骤。',
  category: '布局',
  kind: 'block',
  tagName: 'xhhao-com-stepper',
  innerHTML:
    '<xhhao-com-step title="第一步">说明第一步要做什么。</xhhao-com-step><xhhao-com-step title="第二步">说明第二步要做什么。</xhhao-com-step>',
  keywords: ['stepper', 'steps'],
  fields: [
    listField({
      name: 'steps',
      label: '步骤',
      childTagName: 'xhhao-com-step',
      addLabel: '添加步骤',
      itemLabel: '步骤',
      defaultItem: {
        title: '新步骤',
        content: '说明这个步骤要做什么。',
      },
      itemFields: [
        listItemAttrField('title', '标题', 'text', '第一步'),
        listItemContentField('说明', '说明这个步骤要做什么。'),
      ],
    }),
  ],
})
