import "../styles/base.scss";
import "../styles/content-components/_note.scss";
import Note from "../components/Note.svelte";
import { innerHtml } from "../mount/html";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-note";

export function mount(element: HTMLElement) {
  mountComponent(element, Note, { ...parseProps(element), content: innerHtml(element) });
}
