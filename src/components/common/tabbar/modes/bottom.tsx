"use client";

import { cn } from "@/lib/utils";
import type { TabbarModeProps } from "../types";

/**
 * 底部导航栏模式 - 移动端底部固定导航
 */
export default function TabbarBottom({ data, className }: TabbarModeProps) {
  const { items, activeKey, onChange } = data;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50",
        "grid grid-cols-4 gap-0",
        className
      )}
    >
      {items.map((item) => {
        const isActive = activeKey === item.key;

        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            disabled={item.disabled}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-1 transition-colors",
              "min-h-[56px]",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
              item.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {item.icon && (
              <div className={cn(
                "flex items-center justify-center mb-1",
                isActive ? "scale-110" : "scale-100",
                "transition-transform"
              )}>
                {item.icon}
              </div>
            )}
            <span className={cn(
              "text-xs whitespace-nowrap",
              isActive ? "font-medium" : "font-normal"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
