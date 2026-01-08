"use client";

import type {
  EcomListProps,
  EcomListClientProps,
  EcomListBaseRenderPayload,
} from "../types";
import { isEcomClientProps } from "../utils";
import { EcomListClientRoot } from "./EcomListClientRoot";
import { EcomListClient } from "./EcomListClient";
import React from "react";

/**
 * EcomListAuto（Client Component）- 智能列表组件，自动选择最佳渲染模式
 *
 * 功能：
 * - 已集成 EcomList 的所有功能，是推荐的统一入口
 * - 当提供了 url/request 时，自动使用客户端请求模式（React Query + BaseList）
 * - 当仅提供 data/total 时，自动使用服务端数据模式（直接渲染，无请求）
 *
 * 组件关系：
 * - EcomListAuto → EcomListClientRoot → EcomListClient（客户端请求模式）
 * - EcomListAuto → EcomListClient（服务端数据模式）
 * - EcomListServer：独立的 Server Component，用于 SSR 首屏渲染
 * - EcomList：统一入口（Server Component），内部使用 EcomListServer + EcomListClientRoot
 *
 * 使用建议：
 * - ✅ Client Component 中：优先使用 EcomListAuto（统一入口）
 * - ✅ Server Component 中需要 SSR：使用 EcomList
 * - ⚠️  需要精确控制：直接使用 EcomListClient
 *
 * 使用方式（支持两种方式）：
 * 
 * 方式1：使用 View 组件（推荐）
 * "use client";
 * <EcomListAuto url="/api" data={{}} View={YourViewClient} />
 * 
 * 方式2：使用函数 children（兼容旧代码）
 * "use client";
 * <EcomListAuto url="/api" data={{}}>
 *   {payload => <View ... />}
 * </EcomListAuto>
 */
export function EcomListAuto<T extends Record<string, unknown>>(
  props: (EcomListProps<T> & { View?: React.ComponentType<EcomListBaseRenderPayload<T>> }) | 
         (EcomListProps<T> & { children?: (payload: EcomListBaseRenderPayload<T>) => React.ReactNode })
) {
  // 如果有客户端请求能力（url/request），使用客户端交互版本
  if (isEcomClientProps(props)) {
    const clientProps = props as EcomListClientProps<T>;
    
    // 如果提供了 View，使用 View 方式
    if ('View' in props && props.View) {
      return <EcomListClientRoot {...clientProps} View={props.View} />;
    }
    
    // 否则使用 children 函数方式（兼容旧代码）
    if ('children' in props && props.children) {
      return <EcomListClientRoot {...clientProps}>{props.children}</EcomListClientRoot>;
    }
    
    // 都没有提供，返回空
    return <EcomListClientRoot {...clientProps} />;
  }

  // 如果没有客户端请求能力（仅 data/total 传入），使用服务端数据模式
  // 注意：这里使用 EcomListClient 的服务端数据模式，而不是 EcomListServer（因为 EcomListServer 是 async Server Component）
  return <EcomListClient {...(props as EcomListProps<T>)} />;
}


