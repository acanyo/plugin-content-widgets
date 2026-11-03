import { attrField, defineWidget } from './kit'

export default defineWidget({
  id: 'reading-time',
  title: '阅读时间',
  description: '展示估算阅读时间。',
  category: '行内',
  kind: 'inline',
  tagName: 'xhhao-com-reading-time',
  attributes: { words: '1200' },
  keywords: ['reading', 'time'],
  fields: [
    attrField('label', '标签', 'text', '阅读时间'),
    attrField('words', '字数', 'text', '1200'),
    attrField('minutes', '分钟', 'text', ''),
  ],
})
