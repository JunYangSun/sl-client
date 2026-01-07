"use client";

import { cn } from "@/lib/utils";
import type { TabbarModeProps } from "../types";

/**
 * 卡片模式 - 卡片式标签页样式
 */
export default function TabbarCard({ data, className }: TabbarModeProps) {
  const { items, activeKey, onChange } = data;

  return (
    <div className={cn("flex gap-2", className)}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          disabled={item.disabled}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all",
            activeKey === item.key
              ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
            item.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}

