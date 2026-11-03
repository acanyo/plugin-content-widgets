import "../styles/base.scss";
import "../styles/content-components/_status.scss";
import Status from "../components/Status.svelte";
import { textContent } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { asString, parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-status";

export function mount(element: HTMLElement) {
  const props = parseProps(element);
  mountComponent(
    element,
    Status,
    {
      ...props,
      value: props.value ? asString(props.value) : textContent(element),
    },
    true,
  );
}
