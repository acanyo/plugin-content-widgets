import type { ContentWidgetDefinition, ContentWidgetNodeAttrs } from './content-widget-types'

export function definitionToNodeAttrs(definition: ContentWidgetDefinition): ContentWidgetNodeAttrs {
  return {
    tagName: definition.tagName,
    attributes: { ...definition.attributes },
    innerHTML: definition.innerHTML || '',
    title: definition.title,
  }
}

export function elementToNodeAttrs(element: HTMLElement): ContentWidgetNodeAttrs {
  const attributes: Record<string, string> = {}

  for (const attr of Array.from(element.attributes)) {
    attributes[attr.name] = attr.value
  }

  return {
    tagName: element.tagName.toLowerCase(),
    attributes,
    innerHTML: element.innerHTML,
  }
}

export function createWidgetElement(attrs: ContentWidgetNodeAttrs): HTMLElement {
  const element = document.createElement(attrs.tagName || 'xhhao-com-alert')

  for (const [name, value] of Object.entries(attrs.attributes || {})) {
    if (value !== undefined && value !== null) {
      element.setAttribute(name, String(value))
    }
  }

  element.innerHTML = attrs.innerHTML || ''
  return element
}

export function createWidgetHTML(attrs: ContentWidgetNodeAttrs): string {
  const wrapper = document.createElement('div')
  wrapper.append(createWidgetElement(attrs))
  return wrapper.innerHTML
}
