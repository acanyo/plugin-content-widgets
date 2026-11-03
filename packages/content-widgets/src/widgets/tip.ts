import "../styles/base.scss";
import "../styles/content-components/_tip.scss";
import Tip from "../components/Tip.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-tip";

export function mount(element: HTMLElement) {
  mountComponent(element, Tip, { ...parseProps(element), content: innerHtml(element) }, true);
}
