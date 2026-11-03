export type ActionButtonPreset =
  | "blue-gradient"
  | "ocean-gradient"
  | "violet-gradient"
  | "aurora-gradient"
  | "sunset-gradient"
  | "rose-gradient"
  | "blue-solid"
  | "green-solid"
  | "red-solid"
  | "dark-solid";

export interface ActionButtonPresetDefinition {
  value: ActionButtonPreset;
  label: string;
  gradientStart: string;
  gradientEnd: string;
  textColor: string;
}

export const actionButtonPresetDefinitions: ActionButtonPresetDefinition[] = [
  {
    value: "blue-gradient",
    label: "渐变 · 经典蓝",
    gradientStart: "#0ea5ff",
    gradientEnd: "#1d3fd8",
    textColor: "#ffffff",
  },
  {
    value: "ocean-gradient",
    label: "渐变 · 海洋蓝",
    gradientStart: "#06b6d4",
    gradientEnd: "#2563eb",
    textColor: "#ffffff",
  },
  {
    value: "violet-gradient",
    label: "渐变 · 紫罗兰",
    gradientStart: "#a855f7",
    gradientEnd: "#6d28d9",
    textColor: "#ffffff",
  },
  {
    value: "aurora-gradient",
    label: "渐变 · 极光",
    gradientStart: "#22d3ee",
    gradientEnd: "#8b5cf6",
    textColor: "#ffffff",
  },
  {
    value: "sunset-gradient",
    label: "渐变 · 日落橙",
    gradientStart: "#fb923c",
    gradientEnd: "#ef4444",
    textColor: "#ffffff",
  },
  {
    value: "rose-gradient",
    label: "渐变 · 玫瑰红",
    gradientStart: "#f472b6",
    gradientEnd: "#db2777",
    textColor: "#ffffff",
  },
  {
    value: "blue-solid",
    label: "纯色 · 蓝",
    gradientStart: "#2563eb",
    gradientEnd: "#2563eb",
    textColor: "#ffffff",
  },
  {
    value: "green-solid",
    label: "纯色 · 绿",
    gradientStart: "#16a34a",
    gradientEnd: "#16a34a",
    textColor: "#ffffff",
  },
  {
    value: "red-solid",
    label: "纯色 · 红",
    gradientStart: "#dc2626",
    gradientEnd: "#dc2626",
    textColor: "#ffffff",
  },
  {
    value: "dark-solid",
    label: "纯色 · 深灰",
    gradientStart: "#334155",
    gradientEnd: "#334155",
    textColor: "#ffffff",
  },
];

export const actionButtonPresetMap = Object.fromEntries(
  actionButtonPresetDefinitions.map((preset) => [preset.value, preset]),
) as Record<ActionButtonPreset, ActionButtonPresetDefinition>;

export function getActionButtonPreset(value?: string): ActionButtonPresetDefinition {
  return actionButtonPresetMap[value as ActionButtonPreset] || actionButtonPresetMap["blue-solid"];
}
