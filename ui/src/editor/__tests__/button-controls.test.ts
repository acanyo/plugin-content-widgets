// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mountCustomElements } from '@xhhao/content-widgets'
import { contentWidgetEditorFields } from '../content-widget-editor-fields'
import { setContentWidgetFieldValue } from '../content-widget-field-values'
import { contentWidgetDefinitions } from '../content-widget-registry'

describe('button component controls', () => {
  it('keeps the button inline in the display category with a visual default', () => {
    const button = contentWidgetDefinitions.find((definition) => definition.id === 'button')!

    expect(button.category).toBe('展示')
    expect(button.kind).toBe('inline')
    expect(button.innerHTML).toBe('前往访问')
    expect(button.attributes).toMatchObject({
      type: 'primary',
      shape: 'pill',
      'gradient-start': '#0ea5ff',
      'gradient-end': '#1d3fd8',
      'text-color': '#ffffff',
      'icon-name': 'external-link',
      'icon-position': 'after',
    })
  })

  it('exposes compatible type, shape, color, target, and icon controls', () => {
    const fields = contentWidgetEditorFields['xhhao-com-button']

    expect(fields.map((field) => field.name)).toEqual([
      'type',
      'shape',
      'href',
      'target',
      'gradient-start',
      'gradient-end',
      'text-color',
      'icon-position',
      'icon-name',
      'icon',
      'innerHTML',
    ])
    expect(
      fields.find((field) => field.name === 'type')?.options?.map((option) => option.value),
    ).toEqual(['primary', 'secondary', 'ghost'])
    expect(
      fields.find((field) => field.name === 'shape')?.options?.map((option) => option.value),
    ).toEqual(['square', 'rounded', 'pill'])
    expect(fields.find((field) => field.name === 'icon-name')?.options?.[0]?.value).toBe('none')
  })

  it('serializes a hidden icon and custom colors without changing the tag contract', () => {
    const definition = contentWidgetDefinitions.find((item) => item.id === 'button')!
    const fields = contentWidgetEditorFields[definition.tagName]
    let widget = {
      tagName: definition.tagName,
      attributes: { ...definition.attributes },
      innerHTML: definition.innerHTML || '',
    }

    for (const [name, value] of [
      ['icon-position', 'none'],
      ['shape', 'rounded'],
      ['gradient-start', '#2563eb'],
    ] as const) {
      widget = setContentWidgetFieldValue(
        widget,
        fields.find((field) => field.name === name)!,
        value,
      )
    }

    expect(widget.tagName).toBe('xhhao-com-button')
    expect(widget.attributes).toMatchObject({
      'icon-position': 'none',
      shape: 'rounded',
      'gradient-start': '#2563eb',
    })
  })

  it('renders the new visual defaults and keeps legacy markup free of new defaults', () => {
    document.body.innerHTML = `
      <xhhao-com-button
        href="https://example.com"
        shape="pill"
        gradient-start="#0ea5ff"
        gradient-end="#1d3fd8"
        text-color="#ffffff"
        icon-name="external-link"
        icon-position="after"
      >前往访问</xhhao-com-button>
      <xhhao-com-button type="secondary">旧按钮</xhhao-com-button>
    `

    mountCustomElements(document)
    const buttons = document.querySelectorAll<HTMLElement>('.xhhao-com-button')
    const enhanced = buttons[0]!
    const legacy = buttons[1]!

    expect(enhanced.classList.contains('xhhao-com-button-shape-pill')).toBe(true)
    expect(enhanced.style.getPropertyValue('--xhhao-com-button-gradient-start')).toBe('#0ea5ff')
    expect(enhanced.lastElementChild?.classList.contains('xhhao-com-button-icon')).toBe(true)
    expect(legacy.className).toBe('xhhao-com-button xhhao-com-button-type-secondary')
    expect(legacy.querySelector('.xhhao-com-button-icon')).toBeNull()
    expect(legacy.style.getPropertyValue('--xhhao-com-button-gradient-start')).toBe('')
  })
})
