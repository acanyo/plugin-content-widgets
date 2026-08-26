<script lang="ts">
  import { contentWidgetIcons } from "./icons/contentWidgetIcons";

  type LinkPreset = "github" | "bilibili" | "behance" | "xiaohongshu" | "xinpianchang" | "dribbble" | "artstation" | "pinterest" | "website" | "docs" | "download" | "tools" | "game" | "community" | "feedback";

  const presets: Record<LinkPreset, { label: string; title: string; description: string; accent: string; background: string; text: string; icon: string }> = {
    github: { label: "GITHUB", title: "在 GitHub 上查看", description: "查看源码、Issue、发布版本与项目动态。", accent: "#60a5fa", background: "#0f172a", text: "#f8fafc", icon: "code" },
    bilibili: { label: "BILIBILI", title: "前往哔哩哔哩", description: "观看视频、教程与创作内容。", accent: "#fb7299", background: "#fff1f5", text: "#831843", icon: "video" },
    behance: { label: "BEHANCE", title: "在 Behance 上查看", description: "浏览完整设计项目与作品集。", accent: "#1769ff", background: "#eff6ff", text: "#172554", icon: "image" },
    xiaohongshu: { label: "小红书", title: "查看小红书内容", description: "浏览灵感、笔记与创作分享。", accent: "#ff2442", background: "#fff1f2", text: "#881337", icon: "image" },
    xinpianchang: { label: "新片场", title: "在新片场查看", description: "发现视频作品、创作人与行业动态。", accent: "#f04b3e", background: "#fff7ed", text: "#7c2d12", icon: "video" },
    dribbble: { label: "DRIBBBLE", title: "在 Dribbble 上查看", description: "浏览设计灵感与作品展示。", accent: "#ea4c89", background: "#fdf2f8", text: "#831843", icon: "image" },
    artstation: { label: "ARTSTATION", title: "在 ArtStation 上查看", description: "查看数字艺术与概念设计作品。", accent: "#13aff0", background: "#082f49", text: "#f0f9ff", icon: "image" },
    pinterest: { label: "PINTEREST", title: "在 Pinterest 上查看", description: "收藏与探索更多视觉灵感。", accent: "#e60023", background: "#fff1f2", text: "#881337", icon: "image" },
    website: { label: "官方网站", title: "访问官方网站", description: "了解产品、服务与最新动态。", accent: "#3b82f6", background: "#eff6ff", text: "#172554", icon: "external-link" },
    docs: { label: "文档", title: "阅读使用文档", description: "查看安装、配置与使用说明。", accent: "#6366f1", background: "#eef2ff", text: "#312e81", icon: "code" },
    download: { label: "下载", title: "获取资源", description: "下载文件、素材或最新版本。", accent: "#10b981", background: "#ecfdf5", text: "#064e3b", icon: "download" },
    tools: { label: "在线工具", title: "打开在线工具", description: "立即使用在线服务与实用工具。", accent: "#8b5cf6", background: "#f5f3ff", text: "#4c1d95", icon: "cube" },
    game: { label: "游戏", title: "进入游戏页面", description: "查看游戏介绍、攻略与相关内容。", accent: "#f97316", background: "#fff7ed", text: "#7c2d12", icon: "gamepad" },
    community: { label: "社区", title: "加入社区讨论", description: "查看社区规则、交流与最新话题。", accent: "#06b6d4", background: "#ecfeff", text: "#164e63", icon: "message" },
    feedback: { label: "问题反馈", title: "提交问题反馈", description: "报告问题、提出建议或寻求帮助。", accent: "#ef4444", background: "#fef2f2", text: "#7f1d1d", icon: "message" },
  };

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
    preset?: LinkPreset;
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

  let config = $derived(presets[preset] || presets.website);
  let customIcon = $derived(icon?.trim() || "");
  let builtInIcon = $derived(contentWidgetIcons[iconName || config.icon] || "");
  let customIconIsSvg = $derived(customIcon.startsWith("<svg"));
  let iconIsImage = $derived(Boolean(customIcon && /^(?:https?:)?\/\/|^\//i.test(customIcon)));
  let imageUrl = $derived(safeImage(image));
  let rel = $derived(target === "_blank" ? "noopener noreferrer" : undefined);
</script>

<a
  class="xhhao-com-link-card"
  style:--xhhao-com-link-card-accent={safeColor(accentColor, config.accent)}
  style:--xhhao-com-link-card-bg={safeColor(backgroundColor, config.background)}
  style:--xhhao-com-link-card-text={safeColor(textColor, config.text)}
  href={safeHref(href)}
  {target}
  {rel}
>
  <span class="xhhao-com-link-card-icon" aria-hidden="true">
    {#if customIconIsSvg}{@html customIcon}{:else if iconIsImage}<img src={customIcon} alt="" loading="lazy" referrerpolicy="no-referrer" />{:else if customIcon}{customIcon}{:else}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html builtInIcon}</svg>{/if}
  </span>
  <span class="xhhao-com-link-card-copy">
    <span class="xhhao-com-link-card-label">{label || config.label}</span>
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
