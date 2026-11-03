import { defineWidget, listField, listItemAttrField, listItemContentField } from './kit'

export default defineWidget({
  id: 'chat',
  title: '聊天',
  description: 'QQ 风格对话内容。',
  category: '展示',
  kind: 'block',
  tagName: 'xhhao-com-chat',
  innerHTML:
    '<xhhao-com-chat-item name="小明" avatar="">你好呀。</xhhao-com-chat-item><xhhao-com-chat-item name="我" self>欢迎使用文章组件。</xhhao-com-chat-item>',
  keywords: ['chat'],
  fields: [
    listField({
      name: 'messages',
      label: '消息',
      childTagName: 'xhhao-com-chat-item',
      addLabel: '添加消息',
      itemLabel: '消息',
      defaultItem: {
        name: '我',
        avatar: '',
        badge: '',
        self: true,
        system: false,
        content: '这里写消息内容。',
      },
      itemFields: [
        listItemAttrField('name', '昵称', 'text', '小明'),
        listItemAttrField('avatar', '头像 URL', 'text', 'https://...'),
        listItemAttrField('badge', '徽标', 'text', '作者'),
        listItemAttrField('self', '自己', 'checkbox'),
        listItemAttrField('system', '系统消息', 'checkbox'),
        listItemContentField('消息内容', '这里写消息内容。'),
      ],
    }),
  ],
})
