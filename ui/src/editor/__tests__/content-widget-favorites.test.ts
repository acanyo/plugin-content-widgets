// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import {
  loadContentWidgetFavorites,
  parseContentWidgetFavorites,
  saveContentWidgetFavorites,
  toggleContentWidgetFavorite,
} from '../content-widget-favorites'

describe('content widget favorites', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('safely parses and normalizes stored component ids', () => {
    expect(parseContentWidgetFavorites('not-json')).toEqual([])
    expect(parseContentWidgetFavorites('["button", "button", 1, "admonition"]')).toEqual([
      'button',
      'admonition',
    ])
  })

  it('persists favorites without duplicating ids', () => {
    saveContentWidgetFavorites(['button', 'button', 'link-card'])
    expect(loadContentWidgetFavorites()).toEqual(['button', 'link-card'])
  })

  it('toggles an id without changing the rest of the collection', () => {
    expect(toggleContentWidgetFavorite(['button'], 'link-card')).toEqual(['button', 'link-card'])
    expect(toggleContentWidgetFavorite(['button', 'link-card'], 'button')).toEqual(['link-card'])
  })
})
