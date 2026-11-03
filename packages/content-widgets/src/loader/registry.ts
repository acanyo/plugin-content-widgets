import type { WidgetModule } from "../widgets/types";

// 标签 -> 组件 chunk 的动态导入映射，键的顺序与 widgets/index.ts 保持一致，
// 嵌套挂载时按此顺序优先挂载内部组件。
// 新增组件时需要同步维护此表。
export const widgetLoaders: Record<string, () => Promise<WidgetModule>> = {
  "xhhao-com-alert": () => import("../widgets/alert"),
  "xhhao-com-badge": () => import("../widgets/badge"),
  "xhhao-com-button": () => import("../widgets/button"),
  "xhhao-com-tab": () => import("../widgets/tab"),
  "xhhao-com-copy": () => import("../widgets/copy"),
  "xhhao-com-folding": () => import("../widgets/folding"),
  "xhhao-com-tip": () => import("../widgets/tip"),
  "xhhao-com-blur": () => import("../widgets/blur"),
  "xhhao-com-timeline": () => import("../widgets/timeline"),
  "xhhao-com-quote": () => import("../widgets/quote"),
  "xhhao-com-chat": () => import("../widgets/chat"),
  "xhhao-com-task-list": () => import("../widgets/task-list"),
  "xhhao-com-key": () => import("../widgets/key"),
  "xhhao-com-card-list": () => import("../widgets/card-list"),
  "xhhao-com-pdf": () => import("../widgets/pdf"),
  "xhhao-com-bilibili": () => import("../widgets/bilibili"),
  "xhhao-com-pic": () => import("../widgets/pic"),
  "xhhao-com-progress": () => import("../widgets/progress"),
  "xhhao-com-emoji-clock": () => import("../widgets/emoji-clock"),
  "xhhao-com-status": () => import("../widgets/status"),
  "xhhao-com-annotation": () => import("../widgets/annotation"),
  "xhhao-com-command-group": () => import("../widgets/command-group"),
  "xhhao-com-result": () => import("../widgets/result"),
  "xhhao-com-reading-time": () => import("../widgets/reading-time"),
  "xhhao-com-compare": () => import("../widgets/compare"),
  "xhhao-com-split": () => import("../widgets/split"),
  "xhhao-com-stepper": () => import("../widgets/stepper"),
  "xhhao-com-note": () => import("../widgets/note"),
};
