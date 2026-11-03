import { attrField, contentField, defineWidget } from './kit'
import {
  halfField,
  buttonShapeOptions,
  actionButtonPresetOptions,
  targetOptions,
  iconPositionOptions,
  appearanceOptions,
  contentWidgetIconOptions,
} from './appearance'

export default defineWidget({
  id: 'action-button',
  title: '增强按钮',
  description: '可配置配色、圆角和图标的行内按钮。',
  category: '展示',
  kind: 'inline',
  tagName: 'xhhao-com-action-button',
  attributes: {
    href: 'https://example.com',
    target: '_blank',
    shape: 'square',
    preset: 'blue-solid',
    'text-color': '#ffffff',
    'icon-name': 'external-link',
    'icon-position': 'after',
    appearance: 'auto',
  },
  innerHTML: '前往访问',
  keywords: ['button', 'gradient', 'icon', '按钮', '渐变', '图标'],

  fields: [
    attrField('preset', '配色预设', 'select', undefined, actionButtonPresetOptions),
    attrField('appearance', '外观模式', 'select', undefined, appearanceOptions),
    halfField(attrField('shape', '圆角', 'select', undefined, buttonShapeOptions)),
    halfField(attrField('target', '打开方式', 'select', undefined, targetOptions)),
    attrField('href', '链接', 'text', 'https://example.com'),
    halfField(attrField('gradient-start', '渐变起始色', 'color', '#0ea5ff')),
    halfField(attrField('gradient-end', '渐变结束色', 'color', '#1d3fd8')),
    halfField(attrField('text-color', '文字与图标色', 'color', '#ffffff')),
    halfField(attrField('icon-position', '图标位置', 'select', undefined, iconPositionOptions)),
    attrField('icon-name', '常用图标', 'icon', undefined, contentWidgetIconOptions),
    attrField('icon', '自定义图标', 'text', 'SVG、Emoji 或图片 URL；填写后覆盖常用图标'),
    contentField('按钮文字', '前往访问'),
  ],
})
