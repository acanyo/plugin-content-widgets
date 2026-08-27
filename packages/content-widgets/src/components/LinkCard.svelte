<script lang="ts">
  import { contentWidgetIcons } from "./icons/contentWidgetIcons";
  import { getLinkCardPreset, type LinkCardPreset } from "./linkCardPresets";

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
  } = $props();

  const safeColor = (value: string | undefined, fallback: string) =>
    /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(value?.trim() || "") ? value!.trim() : fallback;
  const safeHref = (value: string) =>
    /^(?:https?:|mailto:|tel:|#|\/)/i.test(value.trim()) ? value.trim() : "#";
  const safeImage = (value: string | undefined) =>
    /^(?:https?:)?\/\/|^\//i.test(value?.trim() || "") ? value!.trim() : "";

  let config = $derived(getLinkCardPreset(preset));
  let customIcon = $derived(icon?.trim() || "");
  let builtInIcon = $derived(contentWidgetIcons[iconName || config.icon] || "");
  let customIconIsSvg = $derived(customIcon.startsWith("<svg"));
  let iconIsImage = $derived(Boolean(customIcon && /^(?:https?:)?\/\/|^\//i.test(customIcon)));
  let imageUrl = $derived(safeImage(image));
  let rel = $derived(target === "_blank" ? "noopener noreferrer" : undefined);
</script>

<a
  class="xhhao-com-link-card"
  style:--xhhao-com-link-card-accent={safeColor(accentColor, config.accentColor)}
  style:--xhhao-com-link-card-bg={safeColor(backgroundColor, config.backgroundColor)}
  style:--xhhao-com-link-card-text={safeColor(textColor, config.textColor)}
  href={safeHref(href)}
  {target}
  {rel}
>
  <span class="xhhao-com-link-card-icon" aria-hidden="true">
    {#if customIconIsSvg}{@html customIcon}{:else if iconIsImage}<img src={customIcon} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else if customIcon}{customIcon}{:else}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html builtInIcon}</svg>{/if}
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
