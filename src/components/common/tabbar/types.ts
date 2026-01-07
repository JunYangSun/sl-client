import { ReactNode } from "react";

// 显示模式类型
export type TabbarMode = "default" | "pill" | "underline" | "card" | "bottom";

// Tab 项类型
export interface TabItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

// Tabbar 共享数据类型
export interface TabbarData {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

// Tabbar 组件 Props
export interface TabbarProps {
  /** Tab 项列表 */
  items: TabItem[];
  /** 当前激活的 tab key */
  activeKey?: string;
  /** 默认激活的 tab key */
  defaultActiveKey?: string;
  /** 切换 tab 时的回调 */
  onChange?: (key: string) => void;
  /** 显示模式 */
  mode?: TabbarMode;
  /** 自定义类名 */
  className?: string;
}

// 模式组件 Props（内部使用）
export interface TabbarModeProps {
  data: TabbarData;
  className?: string;
}

