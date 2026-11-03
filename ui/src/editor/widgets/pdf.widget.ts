import { attrField, defineWidget } from './kit'

export default defineWidget({
  id: 'pdf',
  title: 'PDF 预览',
  description: '嵌入并预览 PDF 文件。',
  category: '展示',
  kind: 'block',
  tagName: 'xhhao-com-pdf',
  attributes: { src: '', title: 'PDF 文档' },
  keywords: ['pdf', 'preview'],
  fields: [
    attrField('src', 'PDF 地址', 'attachment', 'https://example.com/document.pdf', undefined, [
      'application/pdf',
    ]),
    attrField('title', '标题', 'text', 'PDF 文档'),
    attrField('width', '宽度', 'text', '100%'),
    attrField('height', '高度', 'text', '500px'),
  ],
})
