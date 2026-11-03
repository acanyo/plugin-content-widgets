// @vitest-environment jsdom

import { readFileSync } from 'node:fs'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { mountCustomElements } from '@xhhao/content-widgets'
import { getContentWidgetEditorFields } from '../content-widget-registry'
import {
  getContentWidgetFieldValue,
  setContentWidgetFieldValue,
} from '../content-widget-field-values'
import { createWidgetHTML, elementToNodeAttrs } from '../content-widget-html'

const stylesheet = document.createElement('style')
const messagesField = getContentWidgetEditorFields('xhhao-com-chat').find(
  (field) => field.name === 'messages',
)!

beforeAll(() => {
  stylesheet.textContent = readFileSync(
    '../packages/content-widgets/dist/content-widgets.css',
    'utf8',
  )
  document.head.append(stylesheet)
})

afterEach(() => document.body.replaceChildren())
afterAll(() => stylesheet.remove())

const variants: Array<{ kind: string; attributes: Record<string, string>; selector: string }> = [
  { kind: 'received', attributes: {}, selector: '.xhhao-com-chat-bubble' },
  { kind: 'sent', attributes: { self: '' }, selector: '.xhhao-com-chat-bubble' },
  { kind: 'system', attributes: { system: '' }, selector: '.xhhao-com-chat-system > div' },
]

describe('chat message line breaks', () => {
  it.each(variants)(
    'preserves multiline $kind messages after saving and reopening',
    ({ attributes, selector }) => {
      const content = '第一行\n第二行\n\n<strong>第三行</strong><br>第四行'
      const messages = [{ attributes: { name: '小明', ...attributes }, content }]
      const updated = setContentWidgetFieldValue(
        { tagName: 'xhhao-com-chat', attributes: {}, innerHTML: '' },
        messagesField,
        messages,
      )

      const saved = new DOMParser().parseFromString(createWidgetHTML(updated), 'text/html')
      const reopened = elementToNodeAttrs(saved.body.firstElementChild as HTMLElement)
      expect(getContentWidgetFieldValue(reopened, messagesField)).toEqual(messages)

      document.body.innerHTML = createWidgetHTML(reopened)
      mountCustomElements(document.body)

      const message = document.querySelector<HTMLElement>(selector)!
      expect(message.innerHTML).toBe(content)
      expect(message.querySelector('strong')?.textContent).toBe('第三行')
      expect(message.querySelector('br')).not.toBeNull()
      expect(getComputedStyle(message).whiteSpace).toBe('pre-wrap')
    },
  )
})
