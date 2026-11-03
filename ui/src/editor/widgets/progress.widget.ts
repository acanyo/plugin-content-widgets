import { attrField, defineWidget } from './kit'

export default defineWidget({
  id: 'progress',
  title: '进度条',
  description: '展示百分比或任务进度。',
  category: '展示',
  kind: 'block',
  tagName: 'xhhao-com-progress',
  attributes: { value: '70', max: '100', label: '进度' },
  keywords: ['progress'],
  fields: [
    attrField('label', '标签', 'text', '进度'),
    attrField('value', '当前值', 'text', '70'),
    attrField('max', '最大值', 'text', '100'),
    attrField('color', '颜色', 'text', '#3b82f6'),
  ],
})
