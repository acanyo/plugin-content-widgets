import { attrField, defineWidget, listField, listItemAttrField, listItemContentField } from './kit'

export default defineWidget({
  id: 'command-group',
  title: '命令组',
  description: '展示多条命令并支持整体复制。',
  category: '代码',
  kind: 'block',
  tagName: 'xhhao-com-command-group',
  attributes: { title: '部署命令' },
  innerHTML:
    '<xhhao-com-command prompt="$">pnpm install</xhhao-com-command><xhhao-com-command prompt="$">pnpm build</xhhao-com-command>',
  keywords: ['command', 'terminal'],
  fields: [
    attrField('title', '标题', 'text', '部署命令'),
    listField({
      name: 'commands',
      label: '命令',
      childTagName: 'xhhao-com-command',
      addLabel: '添加命令',
      itemLabel: '命令',
      defaultItem: {
        prompt: '$',
        content: 'pnpm install',
      },
      itemFields: [
        listItemAttrField('prompt', '提示符', 'text', '$'),
        listItemContentField('命令', 'pnpm install'),
      ],
    }),
  ],
})
