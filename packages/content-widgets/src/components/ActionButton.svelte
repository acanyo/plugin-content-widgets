<script lang="ts">
  import { contentWidgetIcons } from "./icons/contentWidgetIcons";
  import { getActionButtonPreset, type ActionButtonPreset } from "./actionButtonPresets";
  import ContentWidgetIcon from "./ContentWidgetIcon.svelte";
  import { safeColor, safeHref } from "./contentWidgetRenderUtils";

  type ButtonShape = "square" | "rounded" | "pill";
  type IconPosition = "before" | "after" | "none";

  let {
    href = "#",
    target = "_self",
    shape = "pill",
    preset = "blue-gradient",
    icon,
    iconName = "external-link",
    iconPosition = "after",
    gradientStart,
    gradientEnd,
    textColor,
    content = "前往访问",
  }: {
    href?: string;
    target?: string;
    shape?: ButtonShape;
    preset?: ActionButtonPreset;
    icon?: string;
    iconName?: string;
    iconPosition?: IconPosition;
    gradientStart?: string;
    gradientEnd?: string;
    textColor?: string;
    content?: string;
  } = $props();

  let rel = $derived(target === "_blank" ? "noopener noreferrer" : undefined);
  let colorPreset = $derived(getActionButtonPreset(preset));
  let customIcon = $derived(icon?.trim() || "");
  let builtInIcon = $derived(contentWidgetIcons[iconName] || "");
  let showIcon = $derived(iconPosition !== "none" && Boolean(customIcon || builtInIcon));
</script>

<a
  class={`xhhao-com-action-button xhhao-com-action-button-shape-${shape}`}
  style:--xhhao-com-action-start={safeColor(gradientStart, colorPreset.gradientStart)}
  style:--xhhao-com-action-end={safeColor(gradientEnd, colorPreset.gradientEnd)}
  style:--xhhao-com-action-text={safeColor(textColor, colorPreset.textColor)}
  href={safeHref(href)}
  {target}
  {rel}
>
  {#if showIcon && iconPosition === "before"}
    <span class="xhhao-com-action-button-icon" aria-hidden="true">
      <ContentWidgetIcon {customIcon} {builtInIcon} />
    </span>
  {/if}
  <span class="xhhao-com-action-button-content">{@html content}</span>
  {#if showIcon && iconPosition === "after"}
    <span class="xhhao-com-action-button-icon" aria-hidden="true">
      <ContentWidgetIcon {customIcon} {builtInIcon} />
    </span>
  {/if}
</a>
