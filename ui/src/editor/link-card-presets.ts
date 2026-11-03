import { getLinkCardPreset } from '@xhhao/content-widgets/presets'

const LINK_CARD_PRESET_DERIVED_ATTRIBUTES = [
  'label',
  'title',
  'description',
  'accent-color',
  'background-color',
  'text-color',
  'icon-name',
  'icon',
  'image',
  'show-image',
] as const

export function clearLinkCardPresetDerivedAttributes(attributes: Record<string, string>) {
  const next = { ...attributes }

  for (const name of LINK_CARD_PRESET_DERIVED_ATTRIBUTES) {
    delete next[name]
  }

  return next
}

export function applyLinkCardPreset(
  attributes: Record<string, string>,
  presetValue: string,
) {
  const preset = getLinkCardPreset(presetValue)
  const next = clearLinkCardPresetDerivedAttributes(attributes)

  next.preset = preset.value
  next.href = preset.href
  delete next['auto-metadata']

  return next
}
