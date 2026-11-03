import "../styles/base.scss";
import "../styles/content-components/_link-card.scss";
import LinkCard from "../components/LinkCard.svelte";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-link-card";

export function mount(element: HTMLElement) {
  mountComponent(element, LinkCard, parseProps(element));
}
