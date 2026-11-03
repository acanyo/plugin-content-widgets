import "../styles/base.scss";
import "../styles/content-components/_action-button.scss";
import ActionButton from "../components/ActionButton.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-action-button";

export function mount(element: HTMLElement) {
  mountComponent(element, ActionButton, { ...parseProps(element), content: innerHtml(element) }, true);
}
