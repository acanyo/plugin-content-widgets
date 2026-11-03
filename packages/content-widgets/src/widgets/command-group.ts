import "../styles/base.scss";
import "../styles/content-components/_command-group.scss";
import CommandGroup from "../components/CommandGroup.svelte";
import { textContent } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { asString, parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-command-group";

export function mount(element: HTMLElement) {
  const props = parseProps(element);
  const commands = Array.from(element.querySelectorAll("xhhao-com-command")).map((item) => ({
    prompt: item.getAttribute("prompt") || "$",
    content: textContent(item).trim(),
  }));
  mountComponent(element, CommandGroup, { title: asString(props.title, ""), commands });
}
