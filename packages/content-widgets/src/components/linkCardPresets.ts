export type LinkCardPreset =
  | "github"
  | "bilibili"
  | "behance"
  | "xiaohongshu"
  | "xinpianchang"
  | "dribbble"
  | "artstation"
  | "pinterest"
  | "website"
  | "docs"
  | "download"
  | "tools"
  | "game"
  | "community"
  | "feedback";

export interface LinkCardPresetDefinition {
  value: LinkCardPreset;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  icon: string;
}

// Keep the visual presets in the rendering package so the editor and the
// front-end always resolve the same copy, icon and palette.
export const linkCardPresetDefinitions: LinkCardPresetDefinition[] = [
  {
    value: "github",
    label: "GitHub",
    eyebrow: "GITHUB",
    title: "在 GitHub 上查看",
    description: "查看源码、Issue、发布版本与项目动态。",
    href: "https://github.com/",
    accentColor: "#60a5fa",
    backgroundColor: "#0f172a",
    textColor: "#f8fafc",
    icon: "code",
  },
  {
    value: "bilibili",
    label: "Bilibili",
    eyebrow: "BILIBILI",
    title: "在哔哩哔哩观看",
    description: "查看视频、动态与创作者主页。",
    href: "https://www.bilibili.com/",
    accentColor: "#fb7299",
    backgroundColor: "#fff1f5",
    textColor: "#831843",
    icon: "video",
  },
  {
    value: "behance",
    label: "Behance",
    eyebrow: "BEHANCE",
    title: "在 Behance 查看作品",
    description: "浏览完整项目、创作过程与设计师主页。",
    href: "https://www.behance.net/",
    accentColor: "#1769ff",
    backgroundColor: "#eff6ff",
    textColor: "#172554",
    icon: "image",
  },
  {
    value: "xiaohongshu",
    label: "小红书",
    eyebrow: "小红书",
    title: "在小红书查看笔记",
    description: "查看作品详情、创作说明与作者主页。",
    href: "https://www.xiaohongshu.com/",
    accentColor: "#ff2442",
    backgroundColor: "#fff1f2",
    textColor: "#881337",
    icon: "image",
  },
  {
    value: "xinpianchang",
    label: "新片场",
    eyebrow: "新片场",
    title: "在新片场观看作品",
    description: "查看影片、幕后信息与创作团队。",
    href: "https://www.xinpianchang.com/",
    accentColor: "#f5b400",
    backgroundColor: "#fffbeb",
    textColor: "#713f12",
    icon: "video",
  },
  {
    value: "dribbble",
    label: "Dribbble",
    eyebrow: "DRIBBBLE",
    title: "在 Dribbble 查看作品",
    description: "浏览设计稿、动效与创作者主页。",
    href: "https://dribbble.com/",
    accentColor: "#ea4c89",
    backgroundColor: "#fdf2f8",
    textColor: "#831843",
    icon: "image",
  },
  {
    value: "artstation",
    label: "ArtStation",
    eyebrow: "ARTSTATION",
    title: "在 ArtStation 查看作品",
    description: "浏览概念设计、三维作品与艺术家主页。",
    href: "https://www.artstation.com/",
    accentColor: "#13aff0",
    backgroundColor: "#082f49",
    textColor: "#f0f9ff",
    icon: "image",
  },
  {
    value: "pinterest",
    label: "Pinterest",
    eyebrow: "PINTEREST",
    title: "在 Pinterest 查看灵感",
    description: "查看图片、灵感画板与相关创意。",
    href: "https://www.pinterest.com/",
    accentColor: "#e60023",
    backgroundColor: "#fff1f2",
    textColor: "#881337",
    icon: "image",
  },
  {
    value: "website",
    label: "官方网站",
    eyebrow: "OFFICIAL WEBSITE",
    title: "访问官方网站",
    description: "了解产品、服务与最新动态。",
    href: "#",
    accentColor: "#3b82f6",
    backgroundColor: "#eff6ff",
    textColor: "#1e3a8a",
    icon: "external-link",
  },
  {
    value: "docs",
    label: "文档中心",
    eyebrow: "DOCUMENTATION",
    title: "阅读使用文档",
    description: "查看安装、配置、教程与常见问题。",
    href: "#",
    accentColor: "#8b5cf6",
    backgroundColor: "#f5f3ff",
    textColor: "#4c1d95",
    icon: "code",
  },
  {
    value: "download",
    label: "下载页面",
    eyebrow: "DOWNLOAD",
    title: "下载最新版本",
    description: "获取最新安装包、更新记录与校验信息。",
    href: "#",
    accentColor: "#06b6d4",
    backgroundColor: "#ecfeff",
    textColor: "#164e63",
    icon: "download",
  },
  {
    value: "tools",
    label: "在线工具",
    eyebrow: "ONLINE TOOL",
    title: "打开在线工具",
    description: "无需安装，直接在浏览器中使用。",
    href: "#",
    accentColor: "#14b8a6",
    backgroundColor: "#f0fdfa",
    textColor: "#134e4a",
    icon: "cube",
  },
  {
    value: "game",
    label: "游戏页面",
    eyebrow: "GAME",
    title: "进入游戏页面",
    description: "查看玩法介绍、更新公告与相关资源。",
    href: "#",
    accentColor: "#f97316",
    backgroundColor: "#fff7ed",
    textColor: "#7c2d12",
    icon: "gamepad",
  },
  {
    value: "community",
    label: "社区论坛",
    eyebrow: "COMMUNITY",
    title: "加入社区讨论",
    description: "交流经验、分享作品并获得社区帮助。",
    href: "#",
    accentColor: "#22c55e",
    backgroundColor: "#f0fdf4",
    textColor: "#14532d",
    icon: "message",
  },
  {
    value: "feedback",
    label: "问题反馈",
    eyebrow: "FEEDBACK",
    title: "提交问题反馈",
    description: "报告问题、提出建议或查看处理进度。",
    href: "#",
    accentColor: "#ef4444",
    backgroundColor: "#fef2f2",
    textColor: "#7f1d1d",
    icon: "message",
  },
];

export const linkCardPresetMap = new Map(
  linkCardPresetDefinitions.map((preset) => [preset.value, preset]),
);

export function getLinkCardPreset(value: string | undefined) {
  return linkCardPresetMap.get(value as LinkCardPreset) || linkCardPresetMap.get("website")!;
}
