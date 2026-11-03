import type { ContentWidgetDefinition, ContentWidgetEditorField } from './content-widget-types'
import { widgetModules } from './widgets'
import { contentField } from './widgets/kit'

export const contentWidgetDefinitions: ContentWidgetDefinition[] = widgetModules.map(
  (widget) => widget.definition,
)

const editorFieldsByTagName = new Map<string, ContentWidgetEditorField[]>(
  widgetModules.map((widget) => [widget.definition.tagName, widget.editorFields]),
)

export const contentWidgetCategories = Array.from(
  new Set(contentWidgetDefinitions.map((item) => item.category)),
)

export const blockWidgetTags = contentWidgetDefinitions
  .filter((item) => item.kind === 'block')
  .map((item) => item.tagName)

export const inlineWidgetTags = contentWidgetDefinitions
  .filter((item) => item.kind === 'inline')
  .map((item) => item.tagName)

export function getContentWidgetDefinitionByTagName(tagName: string) {
  return contentWidgetDefinitions.find((item) => item.tagName === tagName)
}

export function getContentWidgetEditorFields(tagName: string) {
  return editorFieldsByTagName.get(tagName) ?? [contentField()]
}
