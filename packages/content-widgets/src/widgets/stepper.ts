import "../styles/base.scss";
import "../styles/content-components/_stepper.scss";
import Stepper from "../components/Stepper.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";

export const tag = "xhhao-com-stepper";

export function mount(element: HTMLElement) {
  const items = Array.from(element.querySelectorAll("xhhao-com-step")).map((item) => ({
    title: item.getAttribute("title") || "",
    content: innerHtml(item),
  }));
  mountComponent(element, Stepper, { items });
}
