import { widgets } from "../widgets";

export function mountCustomElements(root: ParentNode = document) {
  for (const widget of widgets) {
    root.querySelectorAll<HTMLElement>(widget.tag).forEach((element) => {
      widget.mount(element);
    });
  }
}
