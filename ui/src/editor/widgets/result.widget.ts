import { attrField, contentField, defineWidget, resultOptions } from './kit'

export default defineWidget({
  id: 'result',
  title: '结果',
  description: '展示操作结果或阶段结论。',
  category: '提示',
  kind: 'block',
  tagName: 'xhhao-com-result',
  attributes: { type: 'success', title: '完成' },
  innerHTML: '这里写结果说明。',
  keywords: ['result', 'success'],
  fields: [
    attrField('type', '状态', 'select', undefined, resultOptions),
    attrField('title', '标题', 'text', '完成'),
    contentField('结果说明', '这里写结果说明。'),
  ],
})
