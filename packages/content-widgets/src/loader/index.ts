import type { XhhaoComContentWidgetsApi } from "../index";
import type { WidgetModule } from "../widgets/types";
import { widgetLoaders } from "./registry";

const tags = Object.keys(widgetLoaders);
const selector = tags.join(",");
const tagPriority = new Map(tags.map((tag, index) => [tag, index]));

const moduleCache = new Map<string, Promise<WidgetModule>>();
const elementTasks = new WeakMap<Element, Promise<void>>();

function handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
  for (const entry of entries) {
    if (!entry.isIntersecting) {
      continue;
    }
    observer.unobserve(entry.target);
    void mountElement(entry.target as HTMLElement).catch(reportMountError);
  }
}

const observer =
  typeof IntersectionObserver === "undefined"
    ? null
    : new IntersectionObserver(handleIntersect, { rootMargin: "200px 0px" });

function loadWidget(tag: string): Promise<WidgetModule> {
  let cached = moduleCache.get(tag);
  if (!cached) {
    cached = widgetLoaders[tag]();
    moduleCache.set(tag, cached);
  }
  return cached;
}

function mountElement(element: HTMLElement): Promise<void> {
  const existing = elementTasks.get(element);
  if (existing) {
    return existing;
  }
  const task = doMount(element);
  elementTasks.set(element, task);
  return task;
}

async function doMount(element: HTMLElement): Promise<void> {
  const tag = element.tagName.toLowerCase();
  if (!widgetLoaders[tag]) {
    return;
  }

  // 先挂载内部嵌套的组件，保证父组件捕获到的是子组件渲染后的内容
  const nested = Array.from(element.querySelectorAll(selector))
    .filter((child): child is HTMLElement => child instanceof HTMLElement)
    .sort((a, b) => priorityOf(a) - priorityOf(b));
  for (const child of nested) {
    await mountElement(child);
  }

  if (!element.isConnected) {
    return;
  }
  const widget = await loadWidget(tag);
  if (!element.isConnected) {
    return;
  }
  widget.mount(element);
}

function priorityOf(element: HTMLElement): number {
  return tagPriority.get(element.tagName.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
}

function reportMountError(error: unknown) {
  console.warn("[content-widgets] failed to mount widget", error);
}

function scan(root: ParentNode = document) {
  for (const element of Array.from(root.querySelectorAll(selector))) {
    if (!(element instanceof HTMLElement) || elementTasks.has(element)) {
      continue;
    }
    if (observer) {
      observer.observe(element);
    } else {
      void mountElement(element).catch(reportMountError);
    }
  }
}

function scanWhenReady() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => scan(), { once: true });
    return;
  }
  scan();
}

const api: XhhaoComContentWidgetsApi = {
  mount: (root: ParentNode = document) => scan(root),
};

window.XhhaoComContentWidgets = api;
scanWhenReady();
