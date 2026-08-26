// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mountCustomElements } from '@xhhao/content-widgets'
import { contentWidgetEditorFields } from '../content-widget-editor-fields'
import { contentWidgetDefinitions } from '../content-widget-registry'

describe('independent content widget additions', () => {
  it('leaves the original button definition unchanged', () => {
    const button = contentWidgetDefinitions.find((definition) => definition.id === 'button')!

    expect(button).toMatchObject({
      title: '按钮',
      category: '展示',
      kind: 'inline',
      tagName: 'xhhao-com-button',
      attributes: { href: 'https://www.xhhao.com', target: '_blank' },
      innerHTML: '访问链接',
    })
  })

  it('registers the three additions in their requested categories', () => {
    const additions = Object.fromEntries(
      contentWidgetDefinitions
        .filter((definition) =>
          ['admonition', 'link-card', 'action-button'].includes(definition.id),
        )
        .map((definition) => [definition.id, definition]),
    )

    expect(additions.admonition).toMatchObject({ category: '提示', kind: 'block' })
    expect(additions['link-card']).toMatchObject({ category: '布局', kind: 'block' })
    expect(additions['action-button']).toMatchObject({ category: '展示', kind: 'inline' })
  })

  it('provides visual color and icon controls for all three additions', () => {
    for (const tagName of [
      'xhhao-com-admonition',
      'xhhao-com-link-card',
      'xhhao-com-action-button',
    ]) {
      const fields = contentWidgetEditorFields[tagName]
      expect(fields.some((field) => field.type === 'color')).toBe(true)
      expect(fields.some((field) => field.type === 'icon')).toBe(true)
    }

    const noIcon = contentWidgetEditorFields['xhhao-com-action-button']
      .find((field) => field.name === 'icon-name')
      ?.options?.find((option) => option.value === 'none')
    expect(noIcon?.label).toBe('不显示')
    expect(
      contentWidgetEditorFields['xhhao-com-link-card'].filter(
        (field) => field.layout === 'half',
      ).length,
    ).toBeGreaterThan(1)
  })

  it('renders the new elements without changing the original button component', () => {
    document.body.innerHTML = `
      <xhhao-com-button href="#">访问链接</xhhao-com-button>
      <xhhao-com-action-button href="#" shape="pill" icon-position="none">前往访问</xhhao-com-action-button>
      <xhhao-com-admonition type="success" show-title>支持 **Markdown**。</xhhao-com-admonition>
      <xhhao-com-link-card preset="github" href="#"></xhhao-com-link-card>
    `

    mountCustomElements(document)

    expect(document.querySelector('.xhhao-com-button')?.textContent).toContain('访问链接')
    expect(document.querySelector('.xhhao-com-action-button-shape-pill')).not.toBeNull()
    expect(document.querySelector('.xhhao-com-action-button-icon')).toBeNull()
    expect(document.querySelector('.xhhao-com-admonition-title')?.textContent).toContain('成功')
    expect(document.querySelector('.xhhao-com-admonition-body strong')?.textContent).toBe('Markdown')
    expect(document.querySelector('.xhhao-com-link-card-title')?.textContent).toContain('GitHub')
    expect(document.querySelector('.xhhao-com-link-card-icon svg')).not.toBeNull()
  })
})
