export interface ButtonIconDefinition {
  label: string;
  value: string;
  svg: string;
}

export const buttonIconDefinitions: ButtonIconDefinition[] = [
  {
    label: "不显示",
    value: "none",
    svg: '<path d="M5 5l14 14M19 5 5 19"/>',
  },
  {
    label: "外链",
    value: "external-link",
    svg: '<path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  },
  {
    label: "首页",
    value: "home",
    svg: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/>',
  },
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
  {
    label: "下载",
    value: "download",
    svg: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/>',
  },
  {
    label: "代码",
    value: "code",
    svg: '<path d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12"/>',
  },
  {
    label: "邮件",
    value: "mail",
    svg: '<path d="M3 5h18v14H3zM3 6l9 7 9-7"/>',
  },
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
  {
    label: "箭头",
    value: "arrow-right",
    svg: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  },
];

export const buttonIcons = Object.fromEntries(
  buttonIconDefinitions
    .filter((icon) => icon.value !== "none")
    .map((icon) => [icon.value, icon.svg]),
);
