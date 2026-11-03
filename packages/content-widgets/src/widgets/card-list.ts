import "../styles/base.scss";
import "../styles/content-components/_card-list.scss";
import CardList from "../components/CardList.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";

export const tag = "xhhao-com-card-list";

export function mount(element: HTMLElement) {
  mountComponent(element, CardList, { content: innerHtml(element) });
}
