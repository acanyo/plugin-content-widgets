import type {
  ContentWidgetDefinition,
  ContentWidgetEditorField,
  ContentWidgetEditorListItemField,
  ContentWidgetModule,
} from '../content-widget-types'

export type ContentWidgetConfig = ContentWidgetDefinition & {
  fields?: ContentWidgetEditorField[]
}

export function defineWidget(config: ContentWidgetConfig): ContentWidgetModule {
  const { fields = [], ...definition } = config
  return { definition, editorFields: fields }
}

export const contentField = (
  label = '内容',
  placeholder = '输入组件内容',
): ContentWidgetEditorField => ({
  name: 'innerHTML',
  label,
  type: 'textarea',
  source: 'innerHTML',
  placeholder,
})

export const attrField = (
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

export const listItemAttrField = (
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

export const listItemContentField = (
  label = '内容',
  placeholder = '输入内容',
): ContentWidgetEditorListItemField => ({
  name: 'content',
  label,
  type: 'textarea',
  source: 'content',
  placeholder,
})

export const listField = ({
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

export const statusOptions = [
  { label: '提醒', value: 'tip' },
  { label: '信息', value: 'info' },
  { label: '问题', value: 'question' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' },
]

export const resultOptions = [
  { label: '成功', value: 'success' },
  { label: '信息', value: 'info' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' },
]

export const noteColorOptions = [
  { label: '黄色', value: 'yellow' },
  { label: '绿色', value: 'green' },
  { label: '蓝色', value: 'blue' },
  { label: '粉色', value: 'pink' },
  { label: '紫色', value: 'purple' },
]

export const badgeStatusOptions = [
  { label: '默认', value: 'info' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '错误', value: 'error' },
]

export const buttonTypeOptions = [
  { label: '主要', value: 'primary' },
  { label: '次要', value: 'secondary' },
  { label: '幽灵', value: 'ghost' },
]
