<script lang="ts">
  let {
    bvid = "",
    aid = "",
    page = 1,
    autoplay = false,
    title,
    width,
    height,
  }: {
    bvid?: string;
    aid?: string;
    page?: number;
    autoplay?: boolean;
    title?: string;
    width?: string | number;
    height?: string | number;
  } = $props();

  const videoId = $derived(bvid || (aid ? String(aid).replace(/^av/i, "") : ""));
  const watchUrl = $derived(
    bvid
      ? `https://www.bilibili.com/video/${bvid}`
      : videoId
        ? `https://www.bilibili.com/video/av${videoId}`
        : "",
  );
  const embedSrc = $derived.by(() => {
    if (!bvid && !videoId) {
      return "";
    }
    const params = new URLSearchParams();
    if (bvid) {
      params.set("bvid", bvid);
    } else {
      params.set("aid", videoId);
    }
    params.set("page", String(page || 1));
    params.set("autoplay", autoplay ? "1" : "0");
    params.set("high_quality", "1");
    params.set("danmaku", "0");
    return `https://player.bilibili.com/player.html?${params.toString()}`;
  });
</script>

<div class="xhhao-com-bilibili">
  {#if title}
    <div class="xhhao-com-bilibili__header">
      <svg class="xhhao-com-bilibili__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.717c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.56.4.933v4.267c0 .373-.134.684-.4.933-.249.25-.56.373-.933.373s-.684-.123-.933-.373c-.25-.249-.373-.56-.373-.933v-4.267c-.017-.373.106-.684.373-.933.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.56.4.933v4.267c-.017.373-.14.684-.4.933-.249.25-.56.373-.933.373s-.684-.123-.933-.373c-.25-.249-.373-.56-.373-.933v-4.267c0-.373.123-.684.373-.933.249-.249.56-.373.933-.373z" />
      </svg>
      <span class="xhhao-com-bilibili__title">{title}</span>
      {#if watchUrl}
        <a class="xhhao-com-bilibili__link" href={watchUrl} target="_blank" rel="noopener noreferrer" title="在哔哩哔哩观看">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      {/if}
    </div>
  {/if}
  {#if embedSrc}
    <div class="xhhao-com-bilibili__body" style:width style:height>
      <iframe
        src={embedSrc}
        title={title || "哔哩哔哩视频"}
        scrolling="no"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  {:else}
    <div class="xhhao-com-bilibili__empty">请设置 bvid 或 aid 属性</div>
  {/if}
</div>
