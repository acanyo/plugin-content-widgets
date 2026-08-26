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
}

declare module '@xhhao/content-widgets/content-widgets.css'
