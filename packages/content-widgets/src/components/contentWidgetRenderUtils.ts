const HEX_COLOR = /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i;
const SAFE_HREF = /^(?:https?:|mailto:|tel:|#|\/)/i;
const SAFE_IMAGE = /^(?:https?:)?\/\/|^\//i;
const APPEARANCES = new Set(["auto", "light", "dark", "custom"]);

export type ContentWidgetAppearance = "auto" | "light" | "dark" | "custom";

export function safeColor(value: string | undefined, fallback: string) {
  const normalized = value?.trim() || "";
  return HEX_COLOR.test(normalized) ? normalized : fallback;
}

export function safeHref(value: string | undefined) {
  const normalized = value?.trim() || "";
  return SAFE_HREF.test(normalized) ? normalized : "#";
}

export function safeImage(value: string | undefined) {
  const normalized = value?.trim() || "";
  return SAFE_IMAGE.test(normalized) ? normalized : "";
}

export function safeAppearance(
  value: string | undefined,
  fallback: ContentWidgetAppearance = "custom",
): ContentWidgetAppearance {
  const normalized = value?.trim().toLowerCase() || "";
  return APPEARANCES.has(normalized) ? (normalized as ContentWidgetAppearance) : fallback;
}
