import { attrField, badgeStatusOptions, contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'status',
  title: '状态',
  description: '展示轻量状态值。',
  category: '展示',
  kind: 'inline',
  tagName: 'xhhao-com-status',
  attributes: { label: '状态', type: 'success' },
  innerHTML: '正常',
  keywords: ['status'],
  fields: [
    attrField('label', '标签', 'text', '状态'),
    attrField('type', '状态', 'select', undefined, badgeStatusOptions),
    attrField('color', '自定义颜色', 'text', '#2fb579'),
    contentField('状态值', '正常'),
  ],
})
