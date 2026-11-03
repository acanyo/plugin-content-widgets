import { applyActionButtonPreset } from './action-button-presets'
import { setContentWidgetFieldValue } from './content-widget-field-values'
import { applyLinkCardPreset } from './link-card-presets'
import { applyLinkMetadata, type LinkMetadata } from './link-metadata'
import type {
  ContentWidgetEditorField,
  ContentWidgetEditorFieldValue,
  ContentWidgetNodeAttrs,
} from './content-widget-types'

type FieldValueHandler = (
  widget: ContentWidgetNodeAttrs,
  value: ContentWidgetEditorFieldValue,
) => ContentWidgetNodeAttrs

const fieldValueHandlers: Record<string, Record<string, FieldValueHandler>> = {
  'xhhao-com-action-button': {
    preset(widget, value) {
      if (typeof value !== 'string') return widget
      return {
        ...widget,
        attributes: applyActionButtonPreset(widget.attributes, value),
      }
    },
  },
  'xhhao-com-link-card': {
    preset(widget, value) {
      if (typeof value !== 'string') return widget
      return {
        ...widget,
        attributes: applyLinkCardPreset(widget.attributes, value),
      }
    },
  },
}

export function applyContentWidgetFieldValue(
  widget: ContentWidgetNodeAttrs,
  field: ContentWidgetEditorField,
  value: ContentWidgetEditorFieldValue,
) {
  let nextWidget = setContentWidgetFieldValue(widget, field, value)
  const handler = fieldValueHandlers[widget.tagName]?.[field.name]

  if (handler) {
    nextWidget = handler(nextWidget, value)
  }

  if (field.metadataRole === 'manual') {
    delete nextWidget.attributes['auto-metadata']
  }

  return nextWidget
}

export function applyContentWidgetMetadata(
  widget: ContentWidgetNodeAttrs,
  field: ContentWidgetEditorField,
  metadata: LinkMetadata,
  fallbackHref: string,
) {
  if (widget.tagName !== 'xhhao-com-link-card') return widget

  return {
    ...widget,
    attributes: applyLinkMetadata(
      widget.attributes,
      metadata,
      fallbackHref,
      field.metadata?.autoField || 'auto-metadata',
    ),
  }
}
