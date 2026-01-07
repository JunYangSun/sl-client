"use client";

import dynamic from "next/dynamic";
import { useTabbar } from "./useTabbar";
import type { TabbarProps, TabbarMode, TabbarModeProps } from "./types";

// 动态导入所有模式组件
const modeComponents: Record<TabbarMode, React.ComponentType<TabbarModeProps>> = {
  default: dynamic(() => import("./modes/default"), {
    loading: () => <div className="h-12" />
  }),
  pill: dynamic(() => import("./modes/pill"), {
    loading: () => <div className="h-12" />
  }),
  underline: dynamic(() => import("./modes/underline"), {
    loading: () => <div className="h-12" />
  }),
  card: dynamic(() => import("./modes/card"), {
    loading: () => <div className="h-12" />
  }),
  bottom: dynamic(() => import("./modes/bottom"), {
    loading: () => <div className="h-14" />
  }),
};

/**
 * Tabbar 通用组件
 * 支持多种显示模式，共享逻辑和数据，只有 UI 样式不同
 *
 * @example
 * // 默认模式
 * <Tabbar items={items} onChange={handleChange} />
 *
 * // 胶囊模式
 * <Tabbar items={items} mode="pill" />
 *
 * // 下划线模式
 * <Tabbar items={items} mode="underline" />
 *
 * // 卡片模式
 * <Tabbar items={items} mode="card" />
 *
 * // 底部导航栏模式（移动端）
 * <Tabbar items={items} mode="bottom" />
 */
export default function Tabbar({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  mode = "default",
  className,
}: TabbarProps) {
  // 使用共享逻辑
  const data = useTabbar({
    items,
    activeKey,
    defaultActiveKey,
    onChange,
  });

  // 获取对应模式的组件
  const ModeComponent = modeComponents[mode] || modeComponents.default;

  return <ModeComponent data={data} className={className} />;
}

// 导出类型和 hook
export type { TabbarProps, TabItem, TabbarMode, TabbarData } from "./types";
export { useTabbar } from "./useTabbar";

