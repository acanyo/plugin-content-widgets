<script lang="ts">
  import { safeImage } from "./contentWidgetRenderUtils";
  import { sanitizeCustomSvg } from "./sanitizeContentWidgetHtml";

  let {
    customIcon = "",
    builtInIcon = "",
  }: {
    customIcon?: string;
    builtInIcon?: string;
  } = $props();

  let normalizedCustomIcon = $derived(customIcon.trim());
  let customIconLooksLikeSvg = $derived(/^<svg(?:\s|>)/i.test(normalizedCustomIcon));
  let sanitizedCustomSvg = $derived(
    customIconLooksLikeSvg ? sanitizeCustomSvg(normalizedCustomIcon) : "",
  );
  let imageUrl = $derived(safeImage(normalizedCustomIcon));
</script>

{#if sanitizedCustomSvg}
  {@html sanitizedCustomSvg}
{:else if imageUrl}
  <img src={imageUrl} alt="" loading="lazy" referrerpolicy="no-referrer" />
{:else if normalizedCustomIcon && !customIconLooksLikeSvg}
  {normalizedCustomIcon}
{:else if builtInIcon}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html builtInIcon}</svg>
{/if}
