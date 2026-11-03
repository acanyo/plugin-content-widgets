import { attrField, contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'copy',
  title: '复制命令',
  description: '可一键复制的命令行片段。',
  category: '代码',
  kind: 'block',
  tagName: 'xhhao-com-copy',
  attributes: { prompt: '$' },
  innerHTML: 'pnpm install',
  keywords: ['copy', 'code'],
  fields: [attrField('prompt', '提示符', 'text', '$'), contentField('代码', 'pnpm install')],
})
