import { get as serverGet } from "@/lib/request/server";
import type { PageResponse } from "@/lib/request/types";
import type {
  EcomListProps,
  EcomListClientProps,
  EcomListServerProps,
  QueryParams,
  EcomListBaseRenderPayload,
} from "../types";
import { isEcomClientProps } from "../utils";
import React from "react";

type PageShape<T> = Partial<
  PageResponse<T> & {
    records?: T[];
    size?: number;
    current?: number;
  }
>;

/**
 * EcomListServer：仅用于 Server Component 的封装
 *
 * - 支持两种用法：
 *   1) 显式传入 data/total（EcomListServerProps）→ 直接渲染 children
 *   2) 传入 url/params/data（EcomListClientProps 形态）→ 在服务端用 serverGet 拉首屏数据，再渲染 children
 *
 * 用法示例：
 * <EcomListServer<Account>
 *   url="/admin/account/page/list"
 *   data={{ keyword: "xxx" }}
 * >
 *   {({ list, total }) => <YourTable list={list} total={total} />}
 * </EcomListServer>
 */
export async function EcomListServer<T extends Record<string, unknown>>(
  props: EcomListProps<T> & {
    View: React.ComponentType<EcomListBaseRenderPayload<T>>;
  }
) {
  const { View } = props;

  // 1) 已经有服务端数据：直接透传
  if (!isEcomClientProps(props)) {
    const serverProps = props as EcomListServerProps<T>;
    const pageSize = serverProps.pageSize ?? 10;
    const pageNum = serverProps.pageNum ?? 1;
    const hasMore = serverProps.total > serverProps.data.length;
    return (
      <View
        list={serverProps.data}
        total={serverProps.total}
        pageNum={pageNum}
        pageSize={pageSize}
        loading={false}
        hasMore={hasMore}
      />
    );
  }

  // 2) url/params 形式：在服务端请求首屏数据
  const clientProps = props as EcomListClientProps<T>;
  const pageSize =
    clientProps.pageSize ??
    clientProps.params?.pageSize ??
    clientProps.data?.pageSize ??
    10;
  const pageNum = clientProps.params?.pageNum ?? clientProps.data?.pageNum ?? 1;

  const queryParams: QueryParams = {
    ...(clientProps.params || {}),
    ...(clientProps.data || {}),
    pageNum,
    pageSize,
  };

  if (!clientProps.url) {
    throw new Error("EcomListServer: 需要提供 url 或使用 data/total 形式");
  }

  // 过滤掉 undefined 值，确保参数类型兼容
  const filteredQueryParams: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined) {
      filteredQueryParams[key] = value as string | number | boolean;
    }
  }

  const res = await serverGet<unknown>(clientProps.url, filteredQueryParams);
  if (res.code !== 200) {
    throw new Error(res.message || "请求失败");
  }

  const page = (res.data as PageShape<T>) || {};
  const list = Array.isArray(page.records) ? page.records : page.list ?? [];
  const total =
    page.total ??
    (Array.isArray(page.records) ? page.records.length : list.length);
  const finalPageNum = page.current ?? page.pageNum ?? pageNum;
  const finalPageSize = page.size ?? page.pageSize ?? pageSize;
  const hasMore = total > list.length;

  return (
    <View
      list={list as T[]}
      total={total}
      pageNum={finalPageNum}
      pageSize={finalPageSize}
      loading={false}
      hasMore={hasMore}
    />
  );
}
