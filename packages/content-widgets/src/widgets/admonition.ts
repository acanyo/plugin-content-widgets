import "../styles/base.scss";
import "../styles/content-components/_admonition.scss";
import Admonition from "../components/Admonition.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-admonition";

export function mount(element: HTMLElement) {
  mountComponent(element, Admonition, { ...parseProps(element), content: innerHtml(element) });
}
