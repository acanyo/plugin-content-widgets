import "../styles/base.scss";
import "../styles/content-components/_key.scss";
import Key from "../components/Key.svelte";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-key";

export function mount(element: HTMLElement) {
  mountComponent(element, Key, parseProps(element), true);
}
