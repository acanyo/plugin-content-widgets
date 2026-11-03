import "../styles/base.scss";
import "../styles/content-components/_copy.scss";
import Copy from "../components/Copy.svelte";
import { textContent } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { asString, parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-copy";

export function mount(element: HTMLElement) {
  const props = parseProps(element);
  mountComponent(element, Copy, {
    code: props.code ? asString(props.code) : textContent(element),
    prompt: typeof props.prompt === "boolean" ? props.prompt : asString(props.prompt, "$"),
  });
}
