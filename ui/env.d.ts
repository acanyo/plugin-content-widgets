/// <reference types="@rsbuild/core/types" />
/// <reference types="unplugin-icons/types/vue" />

declare module '@xhhao/content-widgets' {
  export interface ButtonIconDefinition {
    label: string
    value: string
    svg: string
  }

  export const buttonIconDefinitions: ButtonIconDefinition[]
  export const buttonIcons: Record<string, string>
  export function mountCustomElements(root?: ParentNode): void
}

declare module '@xhhao/content-widgets/content-widgets.css'
