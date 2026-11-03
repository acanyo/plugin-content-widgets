import "../styles/base.scss";
import "../styles/content-components/_chat.scss";
import Chat from "../components/Chat.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";

export const tag = "xhhao-com-chat";

export function mount(element: HTMLElement) {
  const items = Array.from(element.querySelectorAll("xhhao-com-chat-item")).map((item) => ({
    name: item.getAttribute("name") || "",
    avatar: item.getAttribute("avatar") || undefined,
    badge: item.getAttribute("badge") || undefined,
    content: innerHtml(item),
    self: item.hasAttribute("self"),
    system: item.hasAttribute("system"),
  }));
  mountComponent(element, Chat, { items });
}
