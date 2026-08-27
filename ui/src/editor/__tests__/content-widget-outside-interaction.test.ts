// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { registerContentWidgetOutsideInteraction } from '../content-widget-outside-interaction'

const cleanups: Array<() => void> = []

afterEach(() => {
  while (cleanups.length) cleanups.pop()?.()
  document.body.replaceChildren()
})

function register(root: HTMLElement, close = vi.fn(), shouldIgnore?: () => boolean) {
  cleanups.push(registerContentWidgetOutsideInteraction({ root: () => root, close, shouldIgnore }))
  return close
}

function pointerDown(target: HTMLElement) {
  target.dispatchEvent(new Event('pointerdown', { bubbles: true, composed: true }))
}

describe('shared content widget outside interaction', () => {
  it('keeps the clicked editor open and closes other editors', () => {
    const first = document.body.appendChild(document.createElement('div'))
    const second = document.body.appendChild(document.createElement('div'))
    const firstClose = register(first)
    const secondClose = register(second)

    pointerDown(first)

    expect(firstClose).not.toHaveBeenCalled()
    expect(secondClose).toHaveBeenCalledOnce()
  })

  it('closes every editor when the pointer is outside', () => {
    const root = document.body.appendChild(document.createElement('div'))
    const outside = document.body.appendChild(document.createElement('button'))
    const close = register(root)

    pointerDown(outside)

    expect(close).toHaveBeenCalledOnce()
  })

  it('keeps the editor open while its external overlay is active', () => {
    const root = document.body.appendChild(document.createElement('div'))
    const outside = document.body.appendChild(document.createElement('button'))
    const close = register(root, vi.fn(), () => true)

    pointerDown(outside)

    expect(close).not.toHaveBeenCalled()
  })
})
