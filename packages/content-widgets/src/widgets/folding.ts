import "../styles/base.scss";
import "../styles/content-components/_folding.scss";
import Folding from "../components/Folding.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-folding";

export function mount(element: HTMLElement) {
  mountComponent(element, Folding, { ...parseProps(element), content: innerHtml(element) });
}
