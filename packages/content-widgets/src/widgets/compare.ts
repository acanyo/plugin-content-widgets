import "../styles/base.scss";
import "../styles/content-components/_compare.scss";
import Compare from "../components/Compare.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { asString, parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-compare";

export function mount(element: HTMLElement) {
  const props = parseProps(element);
  const children = Array.from(element.children);
  mountComponent(element, Compare, {
    leftTitle: asString(props.leftTitle, "之前"),
    rightTitle: asString(props.rightTitle, "之后"),
    left: props.left ? asString(props.left) : children[0] ? innerHtml(children[0]) : "",
    right: props.right ? asString(props.right) : children[1] ? innerHtml(children[1]) : "",
  });
}
