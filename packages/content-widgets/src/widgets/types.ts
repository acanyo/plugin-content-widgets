export interface WidgetModule {
  tag: string;
  mount: (element: HTMLElement) => void;
}
