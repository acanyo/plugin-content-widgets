import "../styles/base.scss";
import "../styles/content-components/_timeline.scss";
import Timeline from "../components/Timeline.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";

export const tag = "xhhao-com-timeline";

export function mount(element: HTMLElement) {
  const items = Array.from(element.querySelectorAll("xhhao-com-timeline-item")).map((item) => ({
    time: item.getAttribute("time") || "",
    content: innerHtml(item),
  }));
  mountComponent(element, Timeline, { items });
}
