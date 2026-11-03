import { attrField, defineWidget } from './kit'

export default defineWidget({
  id: 'key',
  title: '快捷键',
  description: '展示键盘按键或组合键。',
  category: '代码',
  kind: 'inline',
  tagName: 'xhhao-com-key',
  attributes: { cmd: 'true', code: 'K' },
  keywords: ['key', 'keyboard'],
  fields: [
    attrField('text', '显示文本', 'text', '⌘K'),
    attrField('cmd', 'Command', 'checkbox'),
    attrField('shift', 'Shift', 'checkbox'),
    attrField('alt', 'Alt', 'checkbox'),
    attrField('ctrl', 'Ctrl', 'checkbox'),
    attrField('code', '按键', 'text', 'K'),
  ],
})
