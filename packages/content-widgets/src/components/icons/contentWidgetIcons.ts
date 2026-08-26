export interface ContentWidgetIconDefinition {
  label: string;
  value: string;
  svg: string;
}

export const contentWidgetIconDefinitions: ContentWidgetIconDefinition[] = [
  { label: "不显示", value: "none", svg: '<path d="M5 5l14 14M19 5 5 19"/>' },
  {
    label: "外链",
    value: "external-link",
    svg: '<path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  },
  { label: "首页", value: "home", svg: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/>' },
  {
    label: "游戏",
    value: "gamepad",
    svg: '<path d="M8 12h4m-2-2v4m7-2h.01M19 14h.01M6.5 7h11a4.5 4.5 0 0 1 4.3 5.8l-1.4 4.5a2.5 2.5 0 0 1-4.3.8L14.5 16h-5l-1.6 2.1a2.5 2.5 0 0 1-4.3-.8l-1.4-4.5A4.5 4.5 0 0 1 6.5 7Z"/>',
  },
  {
    label: "工具",
    value: "cube",
    svg: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12 4 7.5M12 12v9"/>',
  },
  {
    label: "反馈",
    value: "message",
    svg: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8ZM8 9h8M8 13h5"/>',
  },
  {
    label: "视频",
    value: "video",
    svg: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3V9Z"/>',
  },
  {
    label: "图片",
    value: "image",
    svg: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m4 17 5-5 4 4 2-2 5 5"/>',
  },
  { label: "下载", value: "download", svg: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/>' },
  { label: "代码", value: "code", svg: '<path d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12"/>' },
  { label: "邮件", value: "mail", svg: '<path d="M3 5h18v14H3zM3 6l9 7 9-7"/>' },
  {
    label: "火箭",
    value: "rocket",
    svg: '<path d="M14 4c2.5-2.5 5-2 6-2 0 1 .5 3.5-2 6l-5 5-5-5 6-4ZM8 8l-4 1-2 3 6 1m5-5 1-4 3-2 1 6M8 16c-2 0-4 2-4 4 2 0 4-2 4-4Z"/>',
  },
  {
    label: "链接",
    value: "link",
    svg: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>',
  },
  { label: "箭头", value: "arrow-right", svg: '<path d="M5 12h14m-6-6 6 6-6 6"/>' },
  {
    label: "成功",
    value: "check-circle",
    svg: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  },
  {
    label: "信息",
    value: "info",
    svg: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  },
  { label: "警告", value: "warning", svg: '<path d="M12 3 2.5 20h19L12 3Zm0 6v5m0 3h.01"/>' },
  {
    label: "错误",
    value: "error",
    svg: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
  },
  {
    label: "问题",
    value: "question",
    svg: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.1 2.3c-.9.3-.9 1-.9 1.7m0 4h.01"/>',
  },
  {
    label: "灵感",
    value: "lightbulb",
    svg: '<path d="M9 18h6m-5 3h4m4-10a6 6 0 1 0-10 4.5c.7.6 1 1.2 1 2.5h6c0-1.3.3-1.9 1-2.5A6 6 0 0 0 18 11Z"/>',
  },
  {
    label: "Bug",
    value: "bug",
    svg: '<path d="M8 8h8v9a4 4 0 0 1-8 0V8Zm4-5v5M7 5l2 2m8-2-2 2M4 11h4m8 0h4M4 16h4m8 0h4"/>',
  },
  {
    label: "引用",
    value: "quote",
    svg: '<path d="M7 10h4v8H5v-6a6 6 0 0 1 6-6m6 4h4v8h-6v-6a6 6 0 0 1 6-6"/>',
  },
];

export const contentWidgetIcons = Object.fromEntries(
  contentWidgetIconDefinitions
    .filter((icon) => icon.value !== "none")
    .map((icon) => [icon.value, icon.svg]),
);
