import "../styles/base.scss";
import "../styles/content-components/_task-list.scss";
import TaskList from "../components/TaskList.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";

export const tag = "xhhao-com-task-list";

export function mount(element: HTMLElement) {
  const items = Array.from(element.querySelectorAll("xhhao-com-task")).map((item) => ({
    checked: item.hasAttribute("checked"),
    content: innerHtml(item),
  }));
  mountComponent(element, TaskList, { items });
}
