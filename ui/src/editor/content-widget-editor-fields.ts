import type {
  ContentWidgetEditorField,
  ContentWidgetEditorListItemField,
} from './content-widget-types'
import { contentWidgetIconDefinitions } from '@xhhao/content-widgets'

const contentField = (label = '内容', placeholder = '输入组件内容'): ContentWidgetEditorField => ({
  name: 'innerHTML',
  label,
  type: 'textarea',
  source: 'innerHTML',
  placeholder,
})

const attrField = (
  name: string,
  label: string,
  type: ContentWidgetEditorField['type'] = 'text',
  placeholder?: string,
  options?: ContentWidgetEditorField['options'],
  accepts?: ContentWidgetEditorField['accepts'],
): ContentWidgetEditorField => ({
  name,
  label,
  type,
  source: 'attribute',
  placeholder,
  options,
  accepts,
})

const listItemAttrField = (
  name: string,
  label: string,
  type: ContentWidgetEditorListItemField['type'] = 'text',
  placeholder?: string,
  options?: ContentWidgetEditorListItemField['options'],
): ContentWidgetEditorListItemField => ({
  name,
  label,
  type,
  source: 'attribute',
  placeholder,
  options,
})

const listItemContentField = (
  label = '内容',
  placeholder = '输入内容',
): ContentWidgetEditorListItemField => ({
  name: 'content',
  label,
  type: 'textarea',
  source: 'content',
  placeholder,
})

const listField = ({
  name,
  label,
  childTagName,
  wrapperTagName,
  addLabel,
  itemLabel,
  itemFields,
  defaultItem,
  syncAttributeFromItems,
}: Pick<
  ContentWidgetEditorField,
  | 'name'
  | 'label'
  | 'childTagName'
  | 'wrapperTagName'
  | 'addLabel'
  | 'itemLabel'
  | 'itemFields'
  | 'defaultItem'
  | 'syncAttributeFromItems'
>): ContentWidgetEditorField => ({
  name,
  label,
  type: 'list',
  source: 'children',
  childTagName,
  wrapperTagName,
  addLabel,
  itemLabel,
  itemFields,
  defaultItem,
  syncAttributeFromItems,
})

const statusOptions = [
  { label: '提醒', value: 'tip' },
  { label: '信息', value: 'info' },
  { label: '问题', value: 'question' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' },
]

const resultOptions = [
  { label: '成功', value: 'success' },
  { label: '信息', value: 'info' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' },
]

const noteColorOptions = [
  { label: '黄色', value: 'yellow' },
  { label: '绿色', value: 'green' },
  { label: '蓝色', value: 'blue' },
  { label: '粉色', value: 'pink' },
  { label: '紫色', value: 'purple' },
]

const badgeStatusOptions = [
  { label: '默认', value: 'info' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' },
]

const buttonTypeOptions = [
  { label: '主要', value: 'primary' },
  { label: '次要', value: 'secondary' },
  { label: '幽灵', value: 'ghost' },
]

const buttonShapeOptions = [
  { label: '小圆角', value: 'square' },
  { label: '圆角', value: 'rounded' },
  { label: '胶囊', value: 'pill' },
]

const targetOptions = [
  { label: '当前窗口', value: '_self' },
  { label: '新窗口', value: '_blank' },
]

const iconPositionOptions = [
  { label: '不显示', value: 'none' },
  { label: '文字前', value: 'before' },
  { label: '文字后', value: 'after' },
]

const contentWidgetIconOptions = contentWidgetIconDefinitions.map((icon) => ({
  label: icon.label,
  value: icon.value,
  icon: icon.svg,
}))

const admonitionTypeOptions = [
  { label: '提醒', value: 'tip' },
  { label: '信息', value: 'info' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' },
  { label: '成功', value: 'success' },
  { label: '问题', value: 'question' },
  { label: '示例', value: 'example' },
  { label: '引用', value: 'quote' },
  { label: 'Bug', value: 'bug' },
]

const linkCardPresetOptions = [
  { label: 'GitHub', value: 'github' },
  { label: 'Bilibili', value: 'bilibili' },
  { label: 'Behance', value: 'behance' },
  { label: '小红书', value: 'xiaohongshu' },
  { label: '新片场', value: 'xinpianchang' },
  { label: 'Dribbble', value: 'dribbble' },
  { label: 'ArtStation', value: 'artstation' },
  { label: 'Pinterest', value: 'pinterest' },
  { label: '官方网站', value: 'website' },
  { label: '文档', value: 'docs' },
  { label: '下载', value: 'download' },
  { label: '在线工具', value: 'tools' },
  { label: '游戏', value: 'game' },
  { label: '社区', value: 'community' },
  { label: '问题反馈', value: 'feedback' },
]

export const contentWidgetEditorFields: Record<string, ContentWidgetEditorField[]> = {
  'xhhao-com-alert': [
    attrField('type', '状态', 'select', undefined, statusOptions),
    attrField('title', '标题', 'text', '提醒'),
    attrField('icon', '自定义图标', 'textarea', 'SVG 字符串或图片 URL'),
    contentField('正文', '这里写提示内容。'),
  ],
  'xhhao-com-admonition': [
    attrField('type', '类型', 'select', undefined, admonitionTypeOptions),
    attrField('title', '自定义标题', 'text', '留空时跟随类型'),
    attrField('show-title', '显示标题', 'checkbox'),
    attrField('collapsible', '允许折叠', 'checkbox'),
    attrField('default-open', '默认展开', 'checkbox'),
    attrField('accent-color', '强调色', 'color', '留空时跟随类型'),
    attrField('background-color', '背景色', 'color', '留空时跟随类型'),
    attrField('text-color', '文字色', 'color', '留空时跟随类型'),
    attrField('icon-name', '常用图标', 'icon', undefined, contentWidgetIconOptions),
    attrField('icon', '自定义图标', 'text', 'SVG、Emoji 或图片 URL；填写后覆盖常用图标'),
    contentField('正文', '这里写提示内容。'),
  ],
  'xhhao-com-tip': [
    attrField('tip', '悬浮提示', 'text', '这里是提示内容'),
    contentField('触发文本', '提示文本'),
  ],
  'xhhao-com-quote': [
    attrField('icon', '图标', 'text', '可填 SVG、图片 URL 或字符'),
    contentField('引用内容', '保持清醒，保持热爱。'),
  ],
  'xhhao-com-note': [
    attrField('color', '颜色', 'select', undefined, noteColorOptions),
    attrField('rotate', '旋转', 'checkbox'),
    contentField('便签内容', '这里写便签内容。'),
  ],
  'xhhao-com-result': [
    attrField('type', '状态', 'select', undefined, resultOptions),
    attrField('title', '标题', 'text', '完成'),
    contentField('结果说明', '这里写结果说明。'),
  ],
  'xhhao-com-tab': [
    attrField('active', '激活序号', 'text', '1'),
    attrField('center', '居中', 'checkbox'),
    listField({
      name: 'panels',
      label: '标签页',
      childTagName: 'xhhao-com-tab-panel',
      addLabel: '添加标签页',
      itemLabel: '标签页',
      syncAttributeFromItems: {
        attributeName: 'tabs',
        itemName: 'title',
      },
      defaultItem: {
        title: '新标签',
        content: '这里写标签页内容。',
      },
      itemFields: [
        listItemAttrField('title', '标签名', 'text', '介绍'),
        listItemContentField('内容', '这里写标签页内容。'),
      ],
    }),
  ],
  'xhhao-com-folding': [
    attrField('title', '标题', 'text', '展开查看更多'),
    attrField('open', '默认展开', 'checkbox'),
    contentField('折叠内容', '这里写折叠内容。'),
  ],
  'xhhao-com-split': [
    attrField('cols', '列数', 'text', '2'),
    attrField('gap', '间距', 'text', '1rem'),
    listField({
      name: 'columns',
      label: '分栏',
      childTagName: 'div',
      addLabel: '添加分栏',
      itemLabel: '分栏',
      defaultItem: {
        content: '这里写分栏内容。',
      },
      itemFields: [listItemContentField('内容', '这里写分栏内容。')],
    }),
  ],
  'xhhao-com-stepper': [
    listField({
      name: 'steps',
      label: '步骤',
      childTagName: 'xhhao-com-step',
      addLabel: '添加步骤',
      itemLabel: '步骤',
      defaultItem: {
        title: '新步骤',
        content: '说明这个步骤要做什么。',
      },
      itemFields: [
        listItemAttrField('title', '标题', 'text', '第一步'),
        listItemContentField('说明', '说明这个步骤要做什么。'),
      ],
    }),
  ],
  'xhhao-com-timeline': [
    listField({
      name: 'items',
      label: '时间线',
      childTagName: 'xhhao-com-timeline-item',
      addLabel: '添加节点',
      itemLabel: '节点',
      defaultItem: {
        time: '现在',
        content: '这里写事件内容。',
      },
      itemFields: [
        listItemAttrField('time', '时间', 'text', '09:00'),
        listItemContentField('内容', '这里写事件内容。'),
      ],
    }),
  ],
  'xhhao-com-card-list': [
    listField({
      name: 'cards',
      label: '卡片',
      childTagName: 'li',
      wrapperTagName: 'ul',
      addLabel: '添加卡片',
      itemLabel: '卡片',
      defaultItem: {
        content: '卡片内容',
      },
      itemFields: [listItemContentField('内容', '卡片内容')],
    }),
  ],
  'xhhao-com-compare': [
    attrField('left-title', '左侧标题', 'text', '之前'),
    attrField('right-title', '右侧标题', 'text', '之后'),
    attrField('left', '左侧内容', 'textarea', '之前的内容'),
    attrField('right', '右侧内容', 'textarea', '之后的内容'),
  ],
  'xhhao-com-link-card': [
    attrField('preset', '常用预设', 'select', undefined, linkCardPresetOptions),
    attrField('label', '顶部标签', 'text', '留空时跟随预设'),
    attrField('title', '标题', 'text', '留空时跟随预设'),
    attrField('description', '说明', 'textarea', '留空时跟随预设'),
    attrField('href', '链接', 'text', 'https://example.com'),
    attrField('target', '打开方式', 'select', undefined, targetOptions),
    attrField('accent-color', '强调色', 'color', '留空时跟随预设'),
    attrField('background-color', '背景色', 'color', '留空时跟随预设'),
    attrField('text-color', '文字色', 'color', '留空时跟随预设'),
    attrField('show-image', '显示右侧预览图', 'checkbox'),
    attrField('image', '预览图 URL', 'attachment', 'https://example.com/preview.jpg', undefined, [
      'image/*',
    ]),
    attrField('icon-name', '常用图标', 'icon', undefined, contentWidgetIconOptions),
    attrField('icon', '自定义图标', 'text', 'SVG、Emoji 或图片 URL；填写后覆盖常用图标'),
  ],
  'xhhao-com-copy': [
    attrField('prompt', '提示符', 'text', '$'),
    contentField('代码', 'pnpm install'),
  ],
  'xhhao-com-command-group': [
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
  'xhhao-com-key': [
    attrField('text', '显示文本', 'text', '⌘K'),
    attrField('cmd', 'Command', 'checkbox'),
    attrField('shift', 'Shift', 'checkbox'),
    attrField('alt', 'Alt', 'checkbox'),
    attrField('ctrl', 'Ctrl', 'checkbox'),
    attrField('code', '按键', 'text', 'K'),
  ],
  'xhhao-com-chat': [
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
  'xhhao-com-pic': [
    attrField('src', '图片地址', 'text', 'https://picsum.photos/960/540'),
    attrField('caption', '说明文字', 'text', '图片说明'),
    attrField('alt', '替代文本', 'text', '图片'),
    attrField('width', '宽度', 'text', '100%'),
    attrField('height', '高度', 'text', 'auto'),
  ],
  'xhhao-com-pdf': [
    attrField('src', 'PDF 地址', 'attachment', 'https://example.com/document.pdf', undefined, ['application/pdf']),
    attrField('title', '标题', 'text', 'PDF 文档'),
    attrField('width', '宽度', 'text', '100%'),
    attrField('height', '高度', 'text', '500px'),
  ],
  'xhhao-com-progress': [
    attrField('label', '标签', 'text', '进度'),
    attrField('value', '当前值', 'text', '70'),
    attrField('max', '最大值', 'text', '100'),
    attrField('color', '颜色', 'text', '#3b82f6'),
  ],
  'xhhao-com-status': [
    attrField('label', '标签', 'text', '状态'),
    attrField('type', '状态', 'select', undefined, badgeStatusOptions),
    attrField('color', '自定义颜色', 'text', '#2fb579'),
    contentField('状态值', '正常'),
  ],
  'xhhao-com-badge': [
    attrField('type', '类型', 'select', undefined, badgeStatusOptions),
    attrField('color', '自定义颜色', 'text', '#2f8df4'),
    attrField('outline', '描边', 'checkbox'),
    contentField('徽标文本', 'Beta'),
  ],
  'xhhao-com-button': [
    attrField('type', '类型', 'select', undefined, buttonTypeOptions),
    attrField('href', '链接', 'text', 'https://www.xhhao.com'),
    attrField('target', '打开方式', 'text', '_blank'),
    attrField('icon', '图标', 'textarea', 'SVG 字符串或图片 URL'),
    contentField('按钮文本', '访问链接'),
  ],
  'xhhao-com-action-button': [
    attrField('shape', '圆角', 'select', undefined, buttonShapeOptions),
    attrField('href', '链接', 'text', 'https://example.com'),
    attrField('target', '打开方式', 'select', undefined, targetOptions),
    attrField('gradient-start', '渐变起始色', 'color', '#0ea5ff'),
    attrField('gradient-end', '渐变结束色', 'color', '#1d3fd8'),
    attrField('text-color', '文字与图标色', 'color', '#ffffff'),
    attrField('icon-position', '图标位置', 'select', undefined, iconPositionOptions),
    attrField('icon-name', '常用图标', 'icon', undefined, contentWidgetIconOptions),
    attrField('icon', '自定义图标', 'text', 'SVG、Emoji 或图片 URL；填写后覆盖常用图标'),
    contentField('按钮文字', '前往访问'),
  ],
  'xhhao-com-task-list': [
    listField({
      name: 'tasks',
      label: '任务',
      childTagName: 'xhhao-com-task',
      addLabel: '添加任务',
      itemLabel: '任务',
      defaultItem: {
        checked: false,
        content: '待完成事项',
      },
      itemFields: [
        listItemAttrField('checked', '已完成', 'checkbox'),
        listItemContentField('任务内容', '待完成事项'),
      ],
    }),
  ],
  'xhhao-com-emoji-clock': [],
  'xhhao-com-blur': [contentField('隐藏内容', '隐藏内容')],
  'xhhao-com-annotation': [
    attrField('note', '批注', 'text', '说明'),
    contentField('正文', '需要批注的文本'),
  ],
  'xhhao-com-reading-time': [
    attrField('label', '标签', 'text', '阅读时间'),
    attrField('words', '字数', 'text', '1200'),
    attrField('minutes', '分钟', 'text', ''),
  ],
}

export function getContentWidgetEditorFields(tagName: string) {
  return contentWidgetEditorFields[tagName] || [contentField()]
}
