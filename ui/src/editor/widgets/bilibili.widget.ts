import { attrField, defineWidget } from './kit'

export default defineWidget({
  id: 'bilibili',
  title: '哔哩哔哩视频',
  description: '嵌入哔哩哔哩视频播放器。',
  category: '展示',
  kind: 'block',
  tagName: 'xhhao-com-bilibili',
  attributes: { bvid: '', title: '视频标题' },
  keywords: ['bilibili', 'bvid', 'video', 'b站'],
  fields: [
    attrField('bvid', 'BV 号', 'text', 'BV1xx411c7mD'),
    attrField('aid', 'AV 号', 'text', '与 BV 号二选一'),
    attrField('title', '标题', 'text', '视频标题'),
    attrField('page', '分 P', 'text', '1'),
    attrField('autoplay', '自动播放', 'checkbox'),
    attrField('width', '宽度', 'text', '100%'),
    attrField('height', '高度', 'text', '默认 16:9'),
  ],
})
