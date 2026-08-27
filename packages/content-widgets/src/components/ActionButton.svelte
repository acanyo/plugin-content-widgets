<script lang="ts">
  import { contentWidgetIcons } from "./icons/contentWidgetIcons";
  import { getActionButtonPreset, type ActionButtonPreset } from "./actionButtonPresets";

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

  const safeColor = (value: string | undefined, fallback: string) =>
    /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(value?.trim() || "") ? value!.trim() : fallback;
  const safeHref = (value: string) =>
    /^(?:https?:|mailto:|tel:|#|\/)/i.test(value.trim()) ? value.trim() : "#";

  let rel = $derived(target === "_blank" ? "noopener noreferrer" : undefined);
  let colorPreset = $derived(getActionButtonPreset(preset));
  let customIcon = $derived(icon?.trim() || "");
  let builtInIcon = $derived(contentWidgetIcons[iconName] || "");
  let customIconIsSvg = $derived(customIcon.startsWith("<svg"));
  let iconIsImage = $derived(Boolean(customIcon && /^(?:https?:)?\/\/|^\//i.test(customIcon)));
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
      {#if customIconIsSvg}{@html customIcon}{:else if iconIsImage}<img src={customIcon} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else if customIcon}{customIcon}{:else}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html builtInIcon}</svg>{/if}
    </span>
  {/if}
  <span class="xhhao-com-action-button-content">{@html content}</span>
  {#if showIcon && iconPosition === "after"}
    <span class="xhhao-com-action-button-icon" aria-hidden="true">
      {#if customIconIsSvg}{@html customIcon}{:else if iconIsImage}<img src={customIcon} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else if customIcon}{customIcon}{:else}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html builtInIcon}</svg>{/if}
    </span>
  {/if}
</a>
