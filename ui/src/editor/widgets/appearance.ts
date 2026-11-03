import type { ContentWidgetEditorField } from '../content-widget-types'
import {
  actionButtonPresetDefinitions,
  contentWidgetIconDefinitions,
  linkCardPresetDefinitions,
} from '@xhhao/content-widgets/presets'

export const halfField = (field: ContentWidgetEditorField): ContentWidgetEditorField => ({
  ...field,
  layout: 'half',
})

export const linkCardManualField = (field: ContentWidgetEditorField): ContentWidgetEditorField => ({
  ...field,
  metadataRole: 'manual',
})

export const buttonShapeOptions = [
  { label: '小圆角', value: 'square' },
  { label: '圆角', value: 'rounded' },
  { label: '胶囊', value: 'pill' },
]

export const actionButtonPresetOptions = actionButtonPresetDefinitions.map((preset) => ({
  label: preset.label,
  value: preset.value,
}))

export const targetOptions = [
  { label: '当前窗口', value: '_self' },
  { label: '新窗口', value: '_blank' },
]

export const iconPositionOptions = [
  { label: '不显示', value: 'none' },
  { label: '文字前', value: 'before' },
  { label: '文字后', value: 'after' },
]

export const appearanceOptions = [
  { label: '保持当前配色（旧内容）', value: '' },
  { label: '跟随博客主题', value: 'auto' },
  { label: '始终浅色', value: 'light' },
  { label: '始终暗色', value: 'dark' },
  { label: '自定义 / 兼容旧文章', value: 'custom' },
]

export const contentWidgetIconOptions = contentWidgetIconDefinitions.map((icon) => ({
  label: icon.label,
  value: icon.value,
  icon: icon.svg,
}))

export const admonitionTypeOptions = [
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

export const linkCardPresetOptions = linkCardPresetDefinitions.map((preset) => ({
  label: preset.label,
  value: preset.value,
}))
