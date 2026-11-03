import "../styles/base.scss";
import "../styles/content-components/_reading-time.scss";
import ReadingTime from "../components/ReadingTime.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { asNumber, parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-reading-time";

export function mount(element: HTMLElement) {
  const props = parseProps(element);
  mountComponent(
    element,
    ReadingTime,
    {
      ...props,
      minutes: props.minutes ? asNumber(props.minutes) : undefined,
      words: props.words ? asNumber(props.words) : undefined,
      content: innerHtml(element),
    },
    true,
  );
}
