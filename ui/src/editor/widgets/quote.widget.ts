import { attrField, contentField, defineWidget } from './kit'

export default defineWidget({
  id: 'quote',
  title: '引用',
  description: '用于醒目展示引用或摘录。',
  category: '提示',
  kind: 'block',
  tagName: 'xhhao-com-quote',
  innerHTML: '保持清醒，保持热爱。',
  keywords: ['quote'],
  fields: [
    attrField('icon', '图标', 'text', '可填 SVG、图片 URL 或字符'),
    contentField('引用内容', '保持清醒，保持热爱。'),
  ],
})
