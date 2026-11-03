import { attrField, badgeStatusOptions, contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'badge',
  title: '徽标',
  description: '行内短标签。',
  category: '展示',
  kind: 'inline',
  tagName: 'xhhao-com-badge',
  attributes: { type: 'info' },
  innerHTML: 'Beta',
  keywords: ['badge'],
  fields: [
    attrField('type', '类型', 'select', undefined, badgeStatusOptions),
    attrField('color', '自定义颜色', 'text', '#2f8df4'),
    attrField('outline', '描边', 'checkbox'),
    contentField('徽标文本', 'Beta'),
  ],
})
