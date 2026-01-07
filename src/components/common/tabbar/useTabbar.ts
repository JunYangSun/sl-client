"use client";

import { useState, useCallback } from "react";
import type { TabItem, TabbarData } from "./types";

interface UseTabbarOptions {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
}

/**
 * Tabbar 共享逻辑 Hook
 * 处理 tab 切换、状态管理等通用逻辑
 */
export function useTabbar({
  items,
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onChange,
}: UseTabbarOptions): TabbarData {
  // 内部状态（非受控模式）
  const [internalActiveKey, setInternalActiveKey] = useState<string>(
    defaultActiveKey || items[0]?.key || ""
  );

  // 判断是否为受控模式
  const isControlled = controlledActiveKey !== undefined;
  const activeKey = isControlled ? controlledActiveKey : internalActiveKey;

  // 切换 tab
  const handleChange = useCallback(
    (key: string) => {
      const item = items.find((i) => i.key === key);
      if (item?.disabled) return;

      if (!isControlled) {
        setInternalActiveKey(key);
      }
      onChange?.(key);
    },
    [items, isControlled, onChange]
  );

  return {
    items,
    activeKey,
    onChange: handleChange,
  };
}

export default useTabbar;

