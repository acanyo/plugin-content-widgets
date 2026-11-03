import { mountCustomElements } from "./mount/mountCustomElements";

export { mountCustomElements };

export interface XhhaoComContentWidgetsApi {
  mount: typeof mountCustomElements;
}

declare global {
  interface Window {
    XhhaoComContentWidgets?: XhhaoComContentWidgetsApi;
  }
}

function mountWhenReady() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mountCustomElements(), { once: true });
    return;
  }

  mountCustomElements();
}

if (typeof window !== "undefined") {
  window.XhhaoComContentWidgets = {
    mount: mountCustomElements,
  };
  mountWhenReady();
}
