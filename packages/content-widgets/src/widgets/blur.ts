import "../styles/base.scss";
import "../styles/content-components/_blur.scss";
import Blur from "../components/Blur.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";

export const tag = "xhhao-com-blur";

export function mount(element: HTMLElement) {
  mountComponent(element, Blur, { content: innerHtml(element) }, true);
}
