"use client";

import { cn } from "@/lib/utils";
import type { TabbarModeProps } from "../types";

/**
 * 默认模式 - 简洁的底部边框样式
 */
export default function TabbarDefault({ data, className }: TabbarModeProps) {
  const { items, activeKey, onChange } = data;

  return (
    <div className={cn("flex border-b border-gray-200", className)}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          disabled={item.disabled}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeKey === item.key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
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

