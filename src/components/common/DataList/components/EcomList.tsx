import type { EcomListProps, EcomListClientProps, EcomListBaseRenderPayload } from "../types";
import { isEcomClientProps } from "../utils";
import { EcomListServer } from "./EcomListUniversal";
import { EcomListClientRoot } from "./EcomListClientRoot";
import { EcomListHydration } from "./EcomListHydration";
import React from "react";

/**
 * EcomList：统一入口组件（Universal Wrapper）
 *
 * 🎯 核心设计思想：
 * - 对外只暴露一个组件，内部拆成 ServerShell + ClientRoot
 * - 逻辑可以合一，执行体不能合一（React / Next 的硬约束）
 * - 使用组件引用（View）而不是函数传递，避免函数跨 Server/Client 边界
 *
 * ✨ 使用方式（正确的方式）：
 * ```tsx
 * // 1. 创建 Client View 组件
 * "use client";
 * export function AccountTableViewClient(props: EcomListBaseRenderPayload<AccountRecord>) {
 *   return <AccountTableView {...props} />;
 * }
 *
 * // 2. 在 Server Component 中使用
 * export default function Page() {
 *   return (
 *     <EcomList<AccountRecord>
 *       url="/admin/account/page/list"
 *       data={{}}
 *       infiniteAppendOnMobile
 *       showPagination
 *       View={AccountTableViewClient}
 *     />
 *   );
 * }
 * ```
 *
 * 🎁 你得到的好处：
 * - ✅ 只 import 一个组件
 * - ✅ 参数只传一次
 * - ✅ View 组件只定义一次
 * - ✅ SSR / CSR 自动完成
 * - ✅ 完全符合 Next / React 规范
 * - ✅ 非 hack、非黑魔法
 *
 * 🔧 内部实现：
 * - Server Component：可以渲染 Client Component
 * - 同时渲染 EcomListServer（SSR 首屏）和 EcomListClientRoot（客户端交互）
 * - View 是 Client Component，Server 和 Client 都使用它，没有函数跨边界传递
 *
 * ⚠️ 注意事项：
 * - 这是 Server Component，必须在 Server Component 中使用
 * - View 必须是 Client Component（即使它只是简单包装）
 * - 客户端可能会发起一次请求，但 React Query 会缓存，影响很小
 * - 后续可以升级为 dehydrate / HydrationBoundary 完全避免重复请求
 */
export async function EcomList<T extends Record<string, unknown>>(
  props: EcomListProps<T> & { View: React.ComponentType<EcomListBaseRenderPayload<T>> }
) {
  const { View, ...restProps } = props;

  // 判断是否为客户端请求模式（有 url/request）
  const isClientMode = isEcomClientProps(props);

  return (
    <>
      {/* 客户端 hydration 标记：在客户端加载后切换显示 */}
      <EcomListHydration />
      
      <div className="ecom-list-wrapper">
        {/* ① SSR 首屏：服务端请求首屏数据，保证禁用 JS / SEO 有首屏 HTML */}
        {/* 使用 suppressHydrationWarning，客户端 hydration 后会通过 JavaScript 隐藏 */}
        <div className="ecom-list-ssr" suppressHydrationWarning>
          <EcomListServer<T> {...(restProps as EcomListProps<T>)} View={View} />
        </div>

        {/* ② Client 接管：仅在客户端请求模式下渲染，支持 PC 分页和移动端无限滚动 */}
        {/* 客户端 hydration 后显示，覆盖 SSR 首屏 */}
        {isClientMode && (
          <div className="ecom-list-client">
            <EcomListClientRoot<T> {...(restProps as EcomListClientProps<T>)} View={View} />
          </div>
        )}
      </div>
    </>
  );
}
