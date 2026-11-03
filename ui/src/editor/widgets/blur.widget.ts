import { contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'blur',
  title: '模糊文本',
  description: '鼠标悬浮后显示隐藏内容。',
  category: '行内',
  kind: 'inline',
  tagName: 'xhhao-com-blur',
  innerHTML: '隐藏内容',
  keywords: ['blur'],
  fields: [contentField('隐藏内容', '隐藏内容')],
})
