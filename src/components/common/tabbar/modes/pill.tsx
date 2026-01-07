"use client";

import { cn } from "@/lib/utils";
import type { TabbarModeProps } from "../types";

/**
 * 胶囊模式 - 圆角填充样式
 */
export default function TabbarPill({ data, className }: TabbarModeProps) {
  const { items, activeKey, onChange } = data;

  return (
    <div
      className={cn(
        "inline-flex p-1 bg-gray-100 rounded-full gap-1",
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          disabled={item.disabled}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all",
            activeKey === item.key
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
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

