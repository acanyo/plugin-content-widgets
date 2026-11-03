import "../styles/base.scss";
import "../styles/content-components/_emoji-clock.scss";
import EmojiClock from "../components/EmojiClock.svelte";
import { mountComponent } from "../mount/mountSvelte";

export const tag = "xhhao-com-emoji-clock";

export function mount(element: HTMLElement) {
  mountComponent(element, EmojiClock, {}, true);
}
