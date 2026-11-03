import "../styles/base.scss";
import "../styles/content-components/_quote.scss";
import Quote from "../components/Quote.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-quote";

export function mount(element: HTMLElement) {
  mountComponent(element, Quote, { ...parseProps(element), content: innerHtml(element) });
}
