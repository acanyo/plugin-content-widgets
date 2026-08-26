<script lang="ts">
  import { contentWidgetIcons } from "./icons/contentWidgetIcons";

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
    showTitle = true,
    collapsible = false,
    defaultOpen = true,
    accentColor,
    backgroundColor,
    textColor,
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
    icon?: string;
    iconName?: string;
    content?: string;
  } = $props();

  const safeColor = (value: string | undefined, fallback: string) =>
    /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(value?.trim() || "") ? value!.trim() : fallback;

  let preset = $derived(presets[type] || presets.tip);
  let customIcon = $derived(icon?.trim() || "");
  let builtInIcon = $derived(contentWidgetIcons[iconName || preset.icon] || "");
  let customIconIsSvg = $derived(customIcon.startsWith("<svg"));
  let iconIsImage = $derived(Boolean(customIcon && /^(?:https?:)?\/\/|^\//i.test(customIcon)));
</script>

<aside
  class={`xhhao-com-admonition xhhao-com-admonition-type-${type}`}
  style:--xhhao-com-admonition-accent={safeColor(accentColor, preset.accent)}
  style:--xhhao-com-admonition-bg={safeColor(backgroundColor, preset.background)}
  style:--xhhao-com-admonition-text={safeColor(textColor, preset.text)}
>
  {#if collapsible}
    <details open={defaultOpen}>
      <summary class="xhhao-com-admonition-title">
        <span class="xhhao-com-admonition-icon" aria-hidden="true">
          {#if customIconIsSvg}{@html customIcon}{:else if iconIsImage}<img src={customIcon} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else if customIcon}{customIcon}{:else}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html builtInIcon}</svg>{/if}
        </span>
        <strong>{title || preset.title}</strong>
        <span class="xhhao-com-admonition-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="xhhao-com-admonition-body">{@html content}</div>
    </details>
  {:else}
    {#if showTitle}
      <div class="xhhao-com-admonition-title">
        <span class="xhhao-com-admonition-icon" aria-hidden="true">
          {#if customIconIsSvg}{@html customIcon}{:else if iconIsImage}<img src={customIcon} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else if customIcon}{customIcon}{:else}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html builtInIcon}</svg>{/if}
        </span>
        <strong>{title || preset.title}</strong>
      </div>
    {/if}
    <div class="xhhao-com-admonition-body">{@html content}</div>
  {/if}
</aside>
