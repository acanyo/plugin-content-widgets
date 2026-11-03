import { attrField, defineWidget } from './kit'
import {
  halfField,
  linkCardManualField,
  targetOptions,
  appearanceOptions,
  contentWidgetIconOptions,
  linkCardPresetOptions,
} from './appearance'

export default defineWidget({
  id: 'link-card',
  title: '外链卡片',
  description: '带常用网站预设的静态外部链接卡片。',
  category: '布局',
  kind: 'block',
  tagName: 'xhhao-com-link-card',
  attributes: {
    preset: 'github',
    href: 'https://github.com',
    target: '_blank',
    'show-image': 'false',
    'auto-metadata': 'true',
    appearance: 'auto',
  },
  keywords: ['link', 'card', 'github', 'bilibili', 'behance', '外链', '卡片'],

  fields: [
    linkCardManualField(
      halfField(attrField('preset', '常用预设', 'select', undefined, linkCardPresetOptions)),
    ),
    halfField(attrField('appearance', '外观模式', 'select', undefined, appearanceOptions)),
    linkCardManualField(
      halfField(attrField('target', '打开方式', 'select', undefined, targetOptions)),
    ),
    linkCardManualField(halfField(attrField('label', '顶部标签', 'text', '留空时跟随预设'))),
    linkCardManualField(halfField(attrField('title', '标题', 'text', '留空时跟随预设'))),
    linkCardManualField(attrField('description', '说明', 'textarea', '留空时跟随预设')),
    {
      ...attrField('href', '链接', 'text', 'https://example.com'),
      metadata: { autoField: 'auto-metadata', buttonLabel: '读取网站信息' },
      metadataRole: 'url',
    },
    halfField(attrField('auto-metadata', '链接变化后自动读取', 'checkbox')),
    linkCardManualField(halfField(attrField('accent-color', '强调色', 'color', '留空时跟随预设'))),
    linkCardManualField(
      halfField(attrField('background-color', '背景色', 'color', '留空时跟随预设')),
    ),
    linkCardManualField(halfField(attrField('text-color', '文字色', 'color', '留空时跟随预设'))),
    linkCardManualField(halfField(attrField('show-image', '显示右侧预览图', 'checkbox'))),
    linkCardManualField(
      attrField('image', '预览图 URL', 'attachment', 'https://example.com/preview.jpg', undefined, [
        'image/*',
      ]),
    ),
    linkCardManualField(
      attrField('icon-name', '常用图标', 'icon', undefined, contentWidgetIconOptions),
    ),
    linkCardManualField(
      attrField('icon', '自定义图标', 'text', 'SVG、Emoji 或图片 URL；填写后覆盖常用图标'),
    ),
  ],
})
