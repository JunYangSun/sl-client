"use client";

import { cn } from "@/lib/utils";
import type { TabbarModeProps } from "../types";

/**
 * 下划线模式 - 带动画的下划线样式
 */
export default function TabbarUnderline({ data, className }: TabbarModeProps) {
  const { items, activeKey, onChange } = data;

  return (
    <div className={cn("flex gap-6", className)}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          disabled={item.disabled}
          className={cn(
            "relative flex items-center gap-2 py-3 text-sm font-medium transition-colors",
            activeKey === item.key ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
            item.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {item.icon}
          {item.label}
          {activeKey === item.key && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

