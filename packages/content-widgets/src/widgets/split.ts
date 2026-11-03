import "../styles/base.scss";
import "../styles/content-components/_split.scss";
import Split from "../components/Split.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-split";

export function mount(element: HTMLElement) {
  const props = parseProps(element);
  const items = Array.from(element.children).map((child) => innerHtml(child));
  mountComponent(element, Split, {
    cols: typeof props.cols === "boolean" ? undefined : props.cols,
    gap: typeof props.gap === "string" ? props.gap : undefined,
    items,
  });
}
