<script lang="ts">
  import { marked } from "marked";
  import { contentWidgetIcons } from "./icons/contentWidgetIcons";
  import ContentWidgetIcon from "./ContentWidgetIcon.svelte";
  import { sanitizeMarkdownHtml } from "./sanitizeContentWidgetHtml";
  import {
    safeAppearance,
    safeColor,
    type ContentWidgetAppearance,
  } from "./contentWidgetRenderUtils";

  type AdmonitionType = "tip" | "info" | "warning" | "danger" | "success" | "question" | "example" | "quote" | "bug";

  const presets: Record<AdmonitionType, { title: string; accent: string; background: string; text: string; icon: string }> = {
    tip: { title: "提醒", accent: "#00bfa5", background: "#f0fdfa", text: "#134e4a", icon: "lightbulb" },
    info: { title: "信息", accent: "#0ea5e9", background: "#f0f9ff", text: "#0c4a6e", icon: "info" },
    warning: { title: "警告", accent: "#f59e0b", background: "#fffbeb", text: "#78350f", icon: "warning" },
    danger: { title: "危险", accent: "#ef4444", background: "#fef2f2", text: "#7f1d1d", icon: "error" },
    success: { title: "成功", accent: "#22c55e", background: "#f0fdf4", text: "#14532d", icon: "check-circle" },
    question: { title: "问题", accent: "#6366f1", background: "#eef2ff", text: "#312e81", icon: "question" },
    example: { title: "示例", accent: "#8b5cf6", background: "#f5f3ff", text: "#4c1d95", icon: "code" },
    quote: { title: "引用", accent: "#64748b", background: "#f8fafc", text: "#334155", icon: "quote" },
    bug: { title: "Bug", accent: "#f43f5e", background: "#fff1f2", text: "#881337", icon: "bug" },
  };

  let {
    type = "tip",
    title,
    showTitle = false,
    collapsible = false,
    defaultOpen = false,
    accentColor,
    backgroundColor,
    textColor,
    appearance = "custom",
    icon,
    iconName,
    content = "这里写提示内容。",
  }: {
    type?: AdmonitionType;
    title?: string;
    showTitle?: boolean;
    collapsible?: boolean;
    defaultOpen?: boolean;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    appearance?: ContentWidgetAppearance;
    icon?: string;
    iconName?: string;
    content?: string;
  } = $props();

  let preset = $derived(presets[type] || presets.tip);
  let resolvedAppearance = $derived(safeAppearance(appearance));
  let customIcon = $derived(icon?.trim() || "");
  let builtInIcon = $derived(contentWidgetIcons[iconName || preset.icon] || "");
  let renderedContent = $derived(
    sanitizeMarkdownHtml(
      marked.parse(content.replace(/^[\u200B-\u200F\uFEFF]/, ""), {
        async: false,
        breaks: true,
        gfm: true,
      }),
    ),
  );
</script>

<aside
  class={`xhhao-com-admonition xhhao-com-admonition-type-${type} xhhao-com-admonition-appearance-${resolvedAppearance}`}
  style:--xhhao-com-admonition-accent-source={safeColor(accentColor, preset.accent)}
  style:--xhhao-com-admonition-bg-source={safeColor(backgroundColor, preset.background)}
  style:--xhhao-com-admonition-text-source={safeColor(textColor, preset.text)}
>
  {#if collapsible}
    <details open={defaultOpen}>
      <summary class="xhhao-com-admonition-title">
        <span class="xhhao-com-admonition-icon" aria-hidden="true">
          <ContentWidgetIcon {customIcon} {builtInIcon} />
        </span>
        <strong>{title || preset.title}</strong>
        <span class="xhhao-com-admonition-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="xhhao-com-admonition-body">{@html renderedContent}</div>
    </details>
  {:else}
    {#if showTitle}
      <div class="xhhao-com-admonition-title">
        <span class="xhhao-com-admonition-icon" aria-hidden="true">
          <ContentWidgetIcon {customIcon} {builtInIcon} />
        </span>
        <strong>{title || preset.title}</strong>
      </div>
    {/if}
    <div class="xhhao-com-admonition-body">{@html renderedContent}</div>
  {/if}
</aside>
