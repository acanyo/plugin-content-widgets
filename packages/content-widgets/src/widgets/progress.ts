import "../styles/base.scss";
import "../styles/content-components/_progress.scss";
import Progress from "../components/Progress.svelte";
import { mountComponent } from "../mount/mountSvelte";
import { asNumber, asString, parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-progress";

export function mount(element: HTMLElement) {
  const props = parseProps(element);
  mountComponent(element, Progress, {
    value: asNumber(props.value),
    max: asNumber(props.max, 100),
    color: asString(props.color, undefined),
    label: asString(props.label, undefined),
    showPercent: props.showPercent !== false,
  });
}
