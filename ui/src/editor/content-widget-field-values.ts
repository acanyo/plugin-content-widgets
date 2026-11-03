import type {
  ContentWidgetEditorField,
  ContentWidgetEditorFieldValue,
  ContentWidgetEditorListItemValue,
  ContentWidgetNodeAttrs,
} from './content-widget-types'

function createHtmlDocument(html: string) {
  return new DOMParser().parseFromString(`<div>${html || ''}</div>`, 'text/html')
}

function escapeAttributeValue(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function normalizeAttributeValue(value: unknown) {
  if (typeof value === 'boolean') {
    return value ? 'true' : ''
  }

  return String(value ?? '').trim()
}

function getAttributeValue(attrs: ContentWidgetNodeAttrs, field: ContentWidgetEditorField) {
  const value = attrs.attributes?.[field.name]

  if (field.type === 'checkbox') {
    return value === '' || value === 'true'
  }

  if (value) {
    return value
  }

  return getDerivedAttributeValue(attrs, field)
}

function getDerivedAttributeValue(attrs: ContentWidgetNodeAttrs, field: ContentWidgetEditorField) {
  if (attrs.tagName === 'xhhao-com-compare' && ['left', 'right'].includes(field.name)) {
    const doc = createHtmlDocument(attrs.innerHTML)
    const children = Array.from(doc.body.firstElementChild?.children || [])
    const child = field.name === 'left' ? children[0] : children[1]

    return child?.innerHTML || ''
  }

  if (attrs.tagName === 'xhhao-com-pic' && field.name === 'alt') {
    return attrs.attributes?.caption || ''
  }

  return ''
}

function getChildrenValue(
  attrs: ContentWidgetNodeAttrs,
  field: ContentWidgetEditorField,
): ContentWidgetEditorListItemValue[] {
  if (!field.childTagName) {
    return []
  }

  const doc = createHtmlDocument(attrs.innerHTML)
  const root = doc.body.firstElementChild
  const parent = field.wrapperTagName
    ? root?.querySelector(field.wrapperTagName)
    : root
  const children = Array.from(parent?.children || []).filter(
    (child) => child.tagName.toLowerCase() === field.childTagName?.toLowerCase(),
  )

  return children.map((child) => {
    const attributes: Record<string, string> = {}

    for (const attr of Array.from(child.attributes)) {
      attributes[attr.name] = attr.value
    }

    if (field.syncAttributeFromItems) {
      const titles = (attrs.attributes?.[field.syncAttributeFromItems.attributeName] || '')
        .split(field.syncAttributeFromItems.separator || ',')
        .map((item) => item.trim())
        .filter(Boolean)
      const childIndex = children.indexOf(child)
      const syncedValue = titles[childIndex]

      if (syncedValue && !attributes[field.syncAttributeFromItems.itemName]) {
        attributes[field.syncAttributeFromItems.itemName] = syncedValue
      }
    }

    return {
      attributes,
      content: child.innerHTML,
    }
  })
}

export function getContentWidgetFieldValue(
  attrs: ContentWidgetNodeAttrs,
  field: ContentWidgetEditorField,
): ContentWidgetEditorFieldValue {
  if (field.source === 'innerHTML') {
    return attrs.innerHTML || ''
  }

  if (field.source === 'children') {
    return getChildrenValue(attrs, field)
  }

  return getAttributeValue(attrs, field)
}

export function createDefaultListItem(field: ContentWidgetEditorField): ContentWidgetEditorListItemValue {
  const attributes: Record<string, string> = {}
  let content = ''

  for (const itemField of field.itemFields || []) {
    const defaultValue = field.defaultItem?.[itemField.name]

    if (itemField.source === 'content') {
      content = typeof defaultValue === 'boolean' ? '' : String(defaultValue || '')
      continue
    }

    if (typeof defaultValue === 'boolean') {
      if (defaultValue) {
        attributes[itemField.name] = ''
      }
      continue
    }

    if (defaultValue) {
      attributes[itemField.name] = String(defaultValue)
    }
  }

  return { attributes, content }
}

export function setContentWidgetFieldValue(
  attrs: ContentWidgetNodeAttrs,
  field: ContentWidgetEditorField,
  value: ContentWidgetEditorFieldValue,
): ContentWidgetNodeAttrs {
  if (field.source === 'innerHTML') {
    return {
      ...attrs,
      innerHTML: String(value ?? ''),
    }
  }

  if (field.source === 'children') {
    const items = Array.isArray(value) ? value : []
    const nextAttributes = { ...attrs.attributes }

    if (field.syncAttributeFromItems) {
      const syncedValue = items
        .map((item) => item.attributes[field.syncAttributeFromItems!.itemName] || '')
        .filter(Boolean)
        .join(field.syncAttributeFromItems.separator || ',')

      if (syncedValue) {
        nextAttributes[field.syncAttributeFromItems.attributeName] = syncedValue
      } else {
        delete nextAttributes[field.syncAttributeFromItems.attributeName]
      }
    }

    return {
      ...attrs,
      attributes: nextAttributes,
      innerHTML: serializeContentWidgetChildren(field, items),
    }
  }

  const nextAttributes = { ...attrs.attributes }

  if (field.type === 'checkbox') {
    if (value) {
      nextAttributes[field.name] = ''
    } else {
      delete nextAttributes[field.name]
    }
  } else {
    const normalizedValue = normalizeAttributeValue(value)

    if (normalizedValue) {
      nextAttributes[field.name] = normalizedValue
    } else {
      delete nextAttributes[field.name]
    }
  }

  return {
    ...attrs,
    attributes: nextAttributes,
  }
}

function serializeContentWidgetChildren(
  field: ContentWidgetEditorField,
  items: ContentWidgetEditorListItemValue[],
) {
  if (!field.childTagName) {
    return ''
  }

  const childrenHtml = items
    .map((item) => {
      const attributes = Object.entries(item.attributes)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([name, value]) => {
          if (value === '') {
            return name
          }

          return `${name}="${escapeAttributeValue(value)}"`
        })
        .join(' ')
      const openTag = attributes ? `<${field.childTagName} ${attributes}>` : `<${field.childTagName}>`

      return `${openTag}${item.content || ''}</${field.childTagName}>`
    })
    .join('')

  if (field.wrapperTagName) {
    return `<${field.wrapperTagName}>${childrenHtml}</${field.wrapperTagName}>`
  }

  return childrenHtml
}
