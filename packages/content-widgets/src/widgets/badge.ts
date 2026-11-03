import "../styles/base.scss";
import "../styles/content-components/_badge.scss";
import Badge from "../components/Badge.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-badge";

export function mount(element: HTMLElement) {
  mountComponent(element, Badge, { ...parseProps(element), content: innerHtml(element) }, true);
}
