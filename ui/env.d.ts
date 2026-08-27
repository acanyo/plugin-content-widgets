/// <reference types="@rsbuild/core/types" />
/// <reference types="unplugin-icons/types/vue" />

declare module '@xhhao/content-widgets' {
  export function mountCustomElements(root?: ParentNode): void
  export interface ContentWidgetIconDefinition {
    label: string
    value: string
    svg: string
  }
  export const contentWidgetIconDefinitions: ContentWidgetIconDefinition[]
  export const contentWidgetIcons: Record<string, string>
  export type ActionButtonPreset =
    | 'blue-gradient'
    | 'ocean-gradient'
    | 'violet-gradient'
    | 'aurora-gradient'
    | 'sunset-gradient'
    | 'rose-gradient'
    | 'blue-solid'
    | 'green-solid'
    | 'red-solid'
    | 'dark-solid'
  export interface ActionButtonPresetDefinition {
    value: ActionButtonPreset
    label: string
    gradientStart: string
    gradientEnd: string
    textColor: string
  }
  export const actionButtonPresetDefinitions: ActionButtonPresetDefinition[]
  export function getActionButtonPreset(value?: string): ActionButtonPresetDefinition
  export type LinkCardPreset =
    | 'github'
    | 'bilibili'
    | 'behance'
    | 'xiaohongshu'
    | 'xinpianchang'
    | 'dribbble'
    | 'artstation'
    | 'pinterest'
    | 'website'
    | 'docs'
    | 'download'
    | 'tools'
    | 'game'
    | 'community'
    | 'feedback'
  export interface LinkCardPresetDefinition {
    value: LinkCardPreset
    label: string
    eyebrow: string
    title: string
    description: string
    href: string
    accentColor: string
    backgroundColor: string
    textColor: string
    icon: string
  }
  export const linkCardPresetDefinitions: LinkCardPresetDefinition[]
  export function getLinkCardPreset(value?: string): LinkCardPresetDefinition
}

declare module '@xhhao/content-widgets/content-widgets.css'
