import { attrField, contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'folding',
  title: '折叠面板',
  description: '默认收起一段补充内容。',
  category: '布局',
  kind: 'block',
  tagName: 'xhhao-com-folding',
  attributes: { title: '展开查看更多' },
  innerHTML: '这里写折叠内容。',
  keywords: ['folding', 'details'],
  fields: [
    attrField('title', '标题', 'text', '展开查看更多'),
    attrField('open', '默认展开', 'checkbox'),
    contentField('折叠内容', '这里写折叠内容。'),
  ],
})
