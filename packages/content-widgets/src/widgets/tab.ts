import "../styles/base.scss";
import "../styles/content-components/_tabs.scss";
import Tab from "../components/Tab.svelte";
import { innerHtml, splitCsv } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { asBoolean, asNumber, parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-tab";

export function mount(element: HTMLElement) {
  const props = parseProps(element);
  const tabs = splitCsv(props.tabs);
  const panels = Array.from(element.querySelectorAll("xhhao-com-tab-panel")).map((panel) => ({
    content: innerHtml(panel),
  }));
  mountComponent(element, Tab, {
    tabs,
    panels,
    center: asBoolean(props.center),
    active: asNumber(props.active, 1),
  });
}
