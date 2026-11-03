import "../styles/base.scss";
import "../styles/content-components/_button.scss";
import Button from "../components/Button.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-button";

export function mount(element: HTMLElement) {
  mountComponent(element, Button, { ...parseProps(element), content: innerHtml(element) }, true);
}
