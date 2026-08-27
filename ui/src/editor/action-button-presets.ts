import { getActionButtonPreset } from '@xhhao/content-widgets'

export function applyActionButtonPreset(
  attributes: Record<string, string>,
  presetValue: string,
) {
  const preset = getActionButtonPreset(presetValue)

  return {
    ...attributes,
    preset: preset.value,
    'gradient-start': preset.gradientStart,
    'gradient-end': preset.gradientEnd,
    'text-color': preset.textColor,
  }
}
