import "../styles/base.scss";
import "../styles/content-components/_pdf.scss";
import Pdf from "../components/Pdf.svelte";
import { mountComponent } from "../mount/mountSvelte";
import { parseProps } from "../mount/parseProps";

export const tag = "xhhao-com-pdf";

export function mount(element: HTMLElement) {
  mountComponent(element, Pdf, parseProps(element));
}
