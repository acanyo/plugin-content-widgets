import DOMPurify from "dompurify";

const DANGEROUS_EMBED_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "link",
  "meta",
];

const UNSAFE_SVG_TAGS = [
  ...DANGEROUS_EMBED_TAGS,
  "a",
  "animate",
  "animateMotion",
  "animateTransform",
  "foreignObject",
  "image",
  "set",
  "use",
];

export function sanitizeMarkdownHtml(value: string) {
  return String(
    DOMPurify.sanitize(value, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: DANGEROUS_EMBED_TAGS,
      FORBID_ATTR: ["style"],
    }),
  );
}

export function sanitizeCustomSvg(value: string) {
  const sanitized = String(
    DOMPurify.sanitize(value, {
      USE_PROFILES: { svg: true, svgFilters: true },
      FORBID_TAGS: UNSAFE_SVG_TAGS,
      FORBID_ATTR: ["style", "href", "xlink:href"],
    }),
  ).trim();

  return /^<svg(?:\s|>)/i.test(sanitized) ? sanitized : "";
}
