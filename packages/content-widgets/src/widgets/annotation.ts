import "../styles/base.scss";
import "../styles/content-components/_annotation.scss";
import Annotation from "../components/Annotation.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-annotation";

export function mount(element: HTMLElement) {
  mountComponent(element, Annotation, { ...parseProps(element), content: innerHtml(element) }, true);
}
