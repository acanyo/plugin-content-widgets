import "../styles/base.scss";
import "../styles/content-components/_alert.scss";
import Alert from "../components/Alert.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-alert";

export function mount(element: HTMLElement) {
  mountComponent(element, Alert, { ...parseProps(element), content: innerHtml(element) });
}
