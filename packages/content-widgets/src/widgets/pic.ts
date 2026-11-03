import "../styles/base.scss";
import "../styles/content-components/_pic.scss";
import Pic from "../components/Pic.svelte";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-pic";

export function mount(element: HTMLElement) {
  mountComponent(element, Pic, parseProps(element));
}
