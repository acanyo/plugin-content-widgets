import "../styles/base.scss";
import "../styles/content-components/_result.scss";
import Result from "../components/Result.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-result";

export function mount(element: HTMLElement) {
  mountComponent(element, Result, { ...parseProps(element), content: innerHtml(element) });
}
