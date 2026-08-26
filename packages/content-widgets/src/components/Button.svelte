<script lang="ts">
  import { buttonIcons } from "./icons/buttonIcons";

  type ButtonType = "primary" | "secondary" | "ghost";
  type ButtonShape = "square" | "rounded" | "pill";
  type ButtonIconPosition = "before" | "after" | "none";

  let {
    href,
    target = "_self",
    type = "primary",
    shape,
    icon,
    iconName = "",
    iconPosition = "before",
    gradientStart,
    gradientEnd,
    textColor,
    content = "",
  }: {
    href?: string;
    target?: string;
    type?: ButtonType;
    shape?: ButtonShape;
    icon?: string;
    iconName?: string;
    iconPosition?: ButtonIconPosition;
    gradientStart?: string;
    gradientEnd?: string;
    textColor?: string;
    content?: string;
  } = $props();

  const safeColor = (value: string | undefined, fallback: string) =>
    /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(value?.trim() || "")
      ? value!.trim()
      : fallback;

  let rel = $derived(target === "_blank" ? "noopener noreferrer" : undefined);
  let iconValue = $derived(icon?.trim());
  let builtInIcon = $derived(buttonIcons[iconName] || "");
  let iconIsSvg = $derived(Boolean(iconValue?.startsWith("<svg") || (!iconValue && builtInIcon)));
  let iconIsImage = $derived(Boolean(iconValue && /^(?:https?:)?\/\/|^\//i.test(iconValue)));
  let iconText = $derived(iconValue && !iconIsSvg && !iconIsImage ? iconValue : "");
  let showIcon = $derived(iconPosition !== "none" && Boolean(iconValue || builtInIcon));
  let shapeClass = $derived(shape ? ` xhhao-com-button-shape-${shape}` : "");
  let resolvedGradientStart = $derived(
    gradientStart ? safeColor(gradientStart, "#0ea5ff") : undefined,
  );
  let resolvedGradientEnd = $derived(
    gradientEnd ? safeColor(gradientEnd, "#1d3fd8") : undefined,
  );
  let resolvedTextColor = $derived(textColor ? safeColor(textColor, "#ffffff") : undefined);
</script>

{#if href}
  <a
    class={`xhhao-com-button xhhao-com-button-type-${type}${shapeClass}`}
    style:--xhhao-com-button-gradient-start={resolvedGradientStart}
    style:--xhhao-com-button-gradient-end={resolvedGradientEnd}
    style:--xhhao-com-button-text={resolvedTextColor}
    {href}
    {target}
    {rel}
  >
    {#if showIcon && iconPosition === "before"}
      <span class="xhhao-com-button-icon" aria-hidden="true">
        {#if iconIsSvg}{@html iconValue || builtInIcon}{:else if iconIsImage}<img src={iconValue} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else}{iconText}{/if}
      </span>
    {/if}
    <span class="xhhao-com-button-content">{@html content}</span>
    {#if showIcon && iconPosition === "after"}
      <span class="xhhao-com-button-icon" aria-hidden="true">
        {#if iconIsSvg}{@html iconValue || builtInIcon}{:else if iconIsImage}<img src={iconValue} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else}{iconText}{/if}
      </span>
    {/if}
  </a>
{:else}
  <span
    class={`xhhao-com-button xhhao-com-button-type-${type}${shapeClass}`}
    style:--xhhao-com-button-gradient-start={resolvedGradientStart}
    style:--xhhao-com-button-gradient-end={resolvedGradientEnd}
    style:--xhhao-com-button-text={resolvedTextColor}
  >
    {#if showIcon && iconPosition === "before"}
      <span class="xhhao-com-button-icon" aria-hidden="true">
        {#if iconIsSvg}{@html iconValue || builtInIcon}{:else if iconIsImage}<img src={iconValue} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else}{iconText}{/if}
      </span>
    {/if}
    <span class="xhhao-com-button-content">{@html content}</span>
    {#if showIcon && iconPosition === "after"}
      <span class="xhhao-com-button-icon" aria-hidden="true">
        {#if iconIsSvg}{@html iconValue || builtInIcon}{:else if iconIsImage}<img src={iconValue} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else}{iconText}{/if}
      </span>
    {/if}
  </span>
{/if}
