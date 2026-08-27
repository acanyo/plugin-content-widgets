import "./styles/index.scss";
import { mountCustomElements } from "./mount/mountCustomElements";

export { mountCustomElements };
export {
  contentWidgetIconDefinitions,
  contentWidgetIcons,
} from "./components/icons/contentWidgetIcons";
export {
  actionButtonPresetDefinitions,
  actionButtonPresetMap,
  getActionButtonPreset,
} from "./components/actionButtonPresets";
export type {
  ActionButtonPreset,
  ActionButtonPresetDefinition,
} from "./components/actionButtonPresets";
export {
  getLinkCardPreset,
  linkCardPresetDefinitions,
  linkCardPresetMap,
} from "./components/linkCardPresets";
export type {
  LinkCardPreset,
  LinkCardPresetDefinition,
} from "./components/linkCardPresets";

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
