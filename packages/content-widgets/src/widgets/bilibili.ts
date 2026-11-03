import "../styles/base.scss";
import "../styles/content-components/_bilibili.scss";
import Bilibili from "../components/Bilibili.svelte";
import { mountComponent } from "../mount/mountSvelte";
import { asBoolean, asNumber, asString, parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-bilibili";

export function mount(element: HTMLElement) {
  const props = parseProps(element);
  mountComponent(element, Bilibili, {
    bvid: asString(props.bvid, ""),
    aid: asString(props.aid, ""),
    page: asNumber(props.page, 1),
    autoplay: asBoolean(props.autoplay),
    title: asString(props.title, undefined),
    width: asString(props.width, undefined),
    height: asString(props.height, undefined),
  });
}
