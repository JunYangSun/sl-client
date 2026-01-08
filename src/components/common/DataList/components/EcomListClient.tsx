"use client";

import { get } from "@/lib/request/client";
import type { PageResponse } from "@/lib/request/types";
import type {
  EcomListProps,
  EcomListServerProps,
  EcomListClientProps,
  QueryParams,
  EcomListBaseRenderPayload,
} from "../types";
import { isEcomClientProps } from "../utils";
import { BaseList } from "./BaseList";

/**
 * EcomListClient：客户端数据列表组件（内部使用）
 *
 * - 支持客户端模式（内部调接口，React Query 管理分页/加载）
 * - 支持服务端数据模式（SSR 先拿数据，这里只做分页和列表渲染）
 *
 * 注意：这是内部组件，外部应使用 EcomList（统一入口）
 */
export function EcomListClient<T extends Record<string, unknown>>(
  props: EcomListProps<T>
) {
  if (isEcomClientProps(props)) {
    const {
      request,
      url,
      params,
      data,
      pageSize,
      showPagination = true,
      infiniteAppendOnMobile = true,
      onDataChange,
      children,
    } = props as EcomListClientProps<T>;

    const mergedParams: QueryParams | undefined =
      params || data ? { ...(params || {}), ...(data || {}) } : undefined;

    // 默认请求实现：基于 url 和通用 get，自动适配分页结构
    const defaultRequestFromUrl = url
      ? async (p: QueryParams): Promise<PageResponse<T>> => {
          console.log("EcomListClient: fetching page data...");
          const pageNum = p.pageNum ?? 1;
          const pageSize = p.pageSize ?? 10;
          const res = await get<unknown>(url, {
            ...p,
            pageNum,
            pageSize,
          });
          if (res.code !== 200) {
            throw new Error(res.message || "请求失败");
          }

          const page =
            ((res as { data?: unknown }).data as
              | {
                  records?: unknown[];
                  total?: number;
                  size?: number;
                  current?: number;
                  pages?: number;
                  list?: unknown[];
                  pageNum?: number;
                  pageSize?: number;
                }
              | undefined) ?? {};

          // 兼容后端返回 records/total/size/current/pages 结构
          if (Array.isArray(page.records)) {
            return {
              list: page.records as T[],
              total: page.total ?? 0,
              pageNum: page.current ?? pageNum,
              pageSize: page.size ?? pageSize,
              pages: page.pages ?? 0,
            };
          }

          // 兼容 PageResponse 结构：list/total/pageNum/pageSize/pages
          return {
            list: (page.list ?? []) as T[],
            total: page.total ?? 0,
            pageNum: page.pageNum ?? pageNum,
            pageSize: page.pageSize ?? pageSize,
            pages: page.pages ?? 0,
          };
        }
      : undefined;

    const finalRequest = request || defaultRequestFromUrl;

    if (!finalRequest) {
      throw new Error("EcomListClient: 必须提供 request 或 url");
    }
    return (
      <BaseList<T>
        request={finalRequest}
        requestParams={mergedParams}
        showPagination={showPagination}
        pageSize={pageSize}
        infiniteAppendOnMobile={infiniteAppendOnMobile}
        onDataChange={(payload) => {
          const exposed: EcomListBaseRenderPayload<T> = {
            list: payload.list,
            total: payload.total,
            pageNum: payload.pageNum,
            pageSize: payload.pageSize,
            loading: payload.loading,
            hasMore: payload.hasMore,
          };
          onDataChange?.({ ...exposed, raw: payload.raw });
        }}
        renderContent={({ list, total, pageNum, pageSize, loading, hasMore }) =>
          children({ list, total, pageNum, pageSize, loading, hasMore })
        }
      />
    );
  }

  // 服务端数据模式：直接把服务端数据交给 BaseList，再透传给 children
  const {
    data,
    total,
    pageNum,
    pageSize,
    showPagination = true,
    infiniteAppendOnMobile = true,
    children,
  } = props as EcomListServerProps<T>;

  return (
    <BaseList<T>
      data={data}
      total={total}
      pageNum={pageNum}
      pageSize={pageSize}
      showPagination={showPagination}
      infiniteAppendOnMobile={infiniteAppendOnMobile}
      renderContent={({ list, total, pageNum, pageSize, loading, hasMore }) =>
        children({ list, total, pageNum, pageSize, loading, hasMore })
      }
    />
  );
}

