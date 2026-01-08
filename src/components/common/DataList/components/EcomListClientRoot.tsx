"use client";

import React from "react";
import { EcomListClient } from "./EcomListClient";
import type { EcomListClientProps, EcomListBaseRenderPayload } from "../types";

/**
 * EcomListClientRoot
 * - 通用客户端根组件（不再依赖 react-query）
 * - 支持 View 或 children 函数两种方式
 */
export function EcomListClientRoot<T extends Record<string, unknown>>(
  props: (EcomListClientProps<T> & { View: React.ComponentType<EcomListBaseRenderPayload<T>> }) |
         (EcomListClientProps<T> & { children?: (payload: EcomListBaseRenderPayload<T>) => React.ReactNode })
) {
  const { View, children, ...restProps } = props as any;

  // 直接渲染 EcomListClient，不再依赖 QueryClientProvider
  return (
    <EcomListClient<T> {...restProps}>
      {View
        ? (payload: EcomListBaseRenderPayload<T>) => <View {...payload} />
        : children || (() => null)}
    </EcomListClient>
  );
}
