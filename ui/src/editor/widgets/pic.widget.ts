import { attrField, defineWidget } from './kit'

export default defineWidget({
  id: 'pic',
  title: '图片',
  description: '带说明文字的图片。',
  category: '展示',
  kind: 'block',
  tagName: 'xhhao-com-pic',
  attributes: { src: 'https://picsum.photos/960/540', caption: '图片说明' },
  keywords: ['pic', 'image'],
  fields: [
    attrField('src', '图片地址', 'text', 'https://picsum.photos/960/540'),
    attrField('caption', '说明文字', 'text', '图片说明'),
    attrField('alt', '替代文本', 'text', '图片'),
    attrField('width', '宽度', 'text', '100%'),
    attrField('height', '高度', 'text', 'auto'),
  ],
})
