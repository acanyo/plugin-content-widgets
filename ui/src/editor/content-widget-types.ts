import type { Editor, Range } from '@halo-dev/richtext-editor'

export type ContentWidgetKind = 'block' | 'inline'

export interface ContentWidgetNodeAttrs {
  tagName: string
  attributes: Record<string, string>
  innerHTML: string
  title?: string
}

export interface ContentWidgetDefinition {
  id: string
  title: string
  description: string
  category: string
  kind: ContentWidgetKind
  tagName: string
  attributes?: Record<string, string>
  innerHTML?: string
  keywords?: string[]
}

export interface ContentWidgetInsertTarget {
  editor: Editor
  range?: Range
}

export type ContentWidgetEditorFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'attachment'
  | 'list'
export type ContentWidgetEditorFieldSource = 'attribute' | 'innerHTML' | 'children'
export type ContentWidgetEditorListItemFieldSource = 'attribute' | 'content'

export interface ContentWidgetEditorFieldOption {
  label: string
  value: string
}

export interface ContentWidgetEditorListItemField {
  name: string
  label: string
  type: Exclude<ContentWidgetEditorFieldType, 'list'>
  source: ContentWidgetEditorListItemFieldSource
  placeholder?: string
  options?: ContentWidgetEditorFieldOption[]
  accepts?: string[]
}

export interface ContentWidgetEditorListItemValue {
  attributes: Record<string, string>
  content: string
}

export type ContentWidgetEditorFieldValue = string | boolean | ContentWidgetEditorListItemValue[]

export interface ContentWidgetEditorField {
  name: string
  label: string
  type: ContentWidgetEditorFieldType
  source: ContentWidgetEditorFieldSource
  placeholder?: string
  options?: ContentWidgetEditorFieldOption[]
  accepts?: string[]
  childTagName?: string
  wrapperTagName?: string
  addLabel?: string
  itemLabel?: string
  itemFields?: ContentWidgetEditorListItemField[]
  defaultItem?: Record<string, string | boolean>
  syncAttributeFromItems?: {
    attributeName: string
    itemName: string
    separator?: string
  }
}

export interface ContentWidgetModule {
  definition: ContentWidgetDefinition
  editorFields: ContentWidgetEditorField[]
}
