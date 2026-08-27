<script lang="ts">
  import { safeImage } from "./contentWidgetRenderUtils";

  let {
    customIcon = "",
    builtInIcon = "",
  }: {
    customIcon?: string;
    builtInIcon?: string;
  } = $props();

  let normalizedCustomIcon = $derived(customIcon.trim());
  let customIconIsSvg = $derived(normalizedCustomIcon.startsWith("<svg"));
  let imageUrl = $derived(safeImage(normalizedCustomIcon));
</script>

{#if customIconIsSvg}
  {@html normalizedCustomIcon}
{:else if imageUrl}
  <img src={imageUrl} alt="" loading="lazy" referrerpolicy="no-referrer" />
{:else if normalizedCustomIcon}
  {normalizedCustomIcon}
{:else if builtInIcon}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html builtInIcon}</svg>
{/if}
