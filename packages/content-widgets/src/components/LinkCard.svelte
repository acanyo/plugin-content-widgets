<script lang="ts">
  import { contentWidgetIcons } from "./icons/contentWidgetIcons";
  import { getLinkCardPreset, type LinkCardPreset } from "./linkCardPresets";
  import ContentWidgetIcon from "./ContentWidgetIcon.svelte";
  import {
    safeAppearance,
    safeColor,
    safeHref,
    safeImage,
    type ContentWidgetAppearance,
  } from "./contentWidgetRenderUtils";

  let {
    preset = "github",
    href = "#",
    target = "_blank",
    label,
    title,
    description,
    accentColor,
    backgroundColor,
    textColor,
    icon,
    iconName,
    image,
    showImage = false,
    appearance = "custom",
  }: {
    preset?: LinkCardPreset;
    href?: string;
    target?: string;
    label?: string;
    title?: string;
    description?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    icon?: string;
    iconName?: string;
    image?: string;
    showImage?: boolean;
    appearance?: ContentWidgetAppearance;
  } = $props();

  let config = $derived(getLinkCardPreset(preset));
  let resolvedAppearance = $derived(safeAppearance(appearance));
  let customIcon = $derived(icon?.trim() || "");
  let builtInIcon = $derived(contentWidgetIcons[iconName || config.icon] || "");
  let imageUrl = $derived(safeImage(image));
  let rel = $derived(target === "_blank" ? "noopener noreferrer" : undefined);
</script>

<a
  class={`xhhao-com-link-card xhhao-com-link-card-appearance-${resolvedAppearance}`}
  style:--xhhao-com-link-card-accent-source={safeColor(accentColor, config.accentColor)}
  style:--xhhao-com-link-card-bg-source={backgroundColor || resolvedAppearance === "custom" ? safeColor(backgroundColor, config.backgroundColor) : undefined}
  style:--xhhao-com-link-card-text-source={textColor || resolvedAppearance === "custom" ? safeColor(textColor, config.textColor) : undefined}
  href={safeHref(href)}
  {target}
  {rel}
>
  <span class="xhhao-com-link-card-icon" aria-hidden="true">
    <ContentWidgetIcon {customIcon} {builtInIcon} />
  </span>
  <span class="xhhao-com-link-card-copy">
    <span class="xhhao-com-link-card-label">{label || config.eyebrow}</span>
    <strong class="xhhao-com-link-card-title">{title || config.title}</strong>
    <span class="xhhao-com-link-card-description">{description || config.description}</span>
  </span>
  {#if showImage && imageUrl}
    <span class="xhhao-com-link-card-media"><img src={imageUrl} alt="" loading="lazy" referrerpolicy="no-referrer" /></span>
  {/if}
  <span class="xhhao-com-link-card-arrow" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
  </span>
</a>
