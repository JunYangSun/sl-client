"use client";

import * as React from "react";
import { useState, useCallback, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/lib/hooks/useTemplate";
import type { PageResponse } from "@/lib/request/types";
import type { QueryParams } from "../types";

/* ---------------------------------- props --------------------------------- */

export interface BaseListServerProps<T> {
  data: T[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  className?: string;
  onQueryChange?: (params: QueryParams) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onLoadMore?: (nextPage: number, pageSize: number) => void;
  forceHasMore?: boolean;
  infiniteAppendOnMobile?: boolean;
  requestParams?: QueryParams;
  onDataChange?: (payload: {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
    raw?: Partial<PageResponse<T>>;
    loading: boolean;
    hasMore: boolean;
  }) => void;
  renderContent: (payload: {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
    loading: boolean;
    hasMore: boolean;
  }) => React.ReactNode;
}

export interface BaseListClientProps<T>
  extends Omit<
    BaseListServerProps<T>,
    "data" | "total" | "pageNum" | "pageSize"
  > {
  request: (params: QueryParams) => Promise<PageResponse<T>>;
  requestParams?: QueryParams;
  initialParams?: QueryParams;
  pageSize?: number;
  queryOptions?: {
    enabled?: boolean;
    onSuccess?: (data: PageResponse<T>) => void;
    onError?: (err: Error) => void;
  };
}

export type BaseListProps<T> = BaseListServerProps<T> | BaseListClientProps<T>;

function isClientMode<T>(
  props: BaseListProps<T>
): props is BaseListClientProps<T> {
  return "request" in props;
}

/* -------------------------------- component -------------------------------- */

export function BaseList<T extends Record<string, unknown>>(
  props: BaseListProps<T>
) {
  const {
    showPagination = true,
    pageSizeOptions = [10, 20, 50, 100],
    className,
    forceHasMore = false,
    infiniteAppendOnMobile = false,
    onPageChange,
    onPageSizeChange,
    onLoadMore,
    onDataChange,
    renderContent,
  } = props;

  const { device } = useTemplate();
  const isMobile = device === "mobile" || device === "pad";

  const isClient = isClientMode(props);
  const isMobileInfinite = isClient && isMobile && infiniteAppendOnMobile;
  const serverProps = !isClient ? (props as BaseListServerProps<T>) : null;
  const requestFn = isClient ? props.request : undefined;

  /* ------------------------------ query params ------------------------------ */

  const [queryParams, setQueryParams] = useState<QueryParams>(() => {
    if (isClient) {
      return {
        pageNum: 1,
        pageSize:
          props.pageSize || pageSizeOptions[0] || 10,
        ...(props.initialParams || {}),
        ...(props.requestParams || {}),
      };
    }
    return {
      pageNum: props.pageNum || 1,
      pageSize: props.pageSize || pageSizeOptions[0] || 10,
    };
  });

  const pageSize =
    queryParams.pageSize ||
    pageSizeOptions[0] ||
    10;

  const baseParams = useMemo(
    () => ({ ...queryParams, pageNum: 1 }),
    [queryParams]
  );

  /* -------------------------- 普通查询状态机 -------------------------- */

  const [clientData, setClientData] =
    useState<PageResponse<T> | null>(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError] = useState<Error | null>(null);

  React.useEffect(() => {
    if (!isClient || isMobileInfinite) return;
    if (props.queryOptions?.enabled === false) return;
    if (!requestFn) return;

    let cancelled = false;

    setClientLoading(true);
    setClientError(null);

    requestFn(queryParams)
      .then((res) => {
        if (cancelled) return;
        setClientData(res);
        props.queryOptions?.onSuccess?.(res);
      })
      .catch((err) => {
        if (cancelled) return;
        setClientError(err);
        props.queryOptions?.onError?.(err);
      })
      .finally(() => {
        if (!cancelled) setClientLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isClient, isMobileInfinite, queryParams]);

  /* ------------------------- 无限滚动状态机 ------------------------- */

  const [infinitePages, setInfinitePages] = useState<PageResponse<T>[]>([]);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchInfinitePage = useCallback(
    async (page: number) => {
      if (!requestFn || infiniteLoading || !hasNextPage) return;

      setInfiniteLoading(true);
      try {
        const res = await requestFn({ ...baseParams, pageNum: page });
        setInfinitePages((prev) => [...prev, res]);

        const size =
          res.pageSize ??
          baseParams.pageSize ??
          pageSizeOptions[0] ??
          10;
        setHasNextPage(res.total > res.pageNum * size);
      } finally {
        setInfiniteLoading(false);
      }
    },
    [requestFn, baseParams, infiniteLoading, hasNextPage]
  );

  React.useEffect(() => {
    if (!isMobileInfinite) return;
    setInfinitePages([]);
    setHasNextPage(true);
    fetchInfinitePage(1);
  }, [isMobileInfinite, baseParams]);

  /* ---------------------------- 数据合并逻辑 ---------------------------- */

  const [combinedData, setCombinedData] = useState<T[]>([]);
  const [combinedTotal, setCombinedTotal] = useState(0);
  const [combinedPageNum, setCombinedPageNum] = useState(1);

  React.useEffect(() => {
    if (!isClient || isMobileInfinite) return;
    if (!clientData) return;

    const nextList = clientData.list || [];
    const nextTotal = clientData.total || 0;
    const respPageNum = clientData.pageNum || queryParams.pageNum || 1;

    if (isMobile) {
      setCombinedData((prev) => {
        const start = (respPageNum - 1) * pageSize;
        const copy = [...prev];
        nextList.forEach((item, i) => {
          copy[start + i] = item;
        });
        return copy;
      });
    } else {
      setCombinedData(nextList);
    }

    setCombinedTotal(nextTotal);
    setCombinedPageNum(respPageNum);
  }, [clientData, isClient, isMobileInfinite, isMobile, pageSize]);

  const infiniteData = useMemo(
    () => infinitePages.flatMap((p) => p.list || []),
    [infinitePages]
  );

  const infiniteTotal =
    infinitePages[infinitePages.length - 1]?.total ??
    infinitePages[0]?.total ??
    0;

  /* ------------------------------- 对外数据 ------------------------------- */

  const data: T[] = isMobileInfinite
    ? (infiniteData as T[])
    : isClient
    ? combinedData
    : serverProps?.data ?? [];

  const total = isMobileInfinite
    ? infiniteTotal
    : isClient
    ? combinedTotal
    : serverProps?.total ?? 0;

  const pageNum = isMobileInfinite
    ? infinitePages[infinitePages.length - 1]?.pageNum ??
      queryParams.pageNum ??
      1
    : isClient
    ? combinedPageNum
    : serverProps?.pageNum ?? queryParams.pageNum ?? 1;

  const loadingInitial = isClient
    ? isMobileInfinite
      ? infinitePages.length === 0 && infiniteLoading
      : clientLoading
    : false;

  const loadingMore = isMobileInfinite ? infiniteLoading : false;

  const hasMore = isMobileInfinite
    ? hasNextPage
    : total > (data?.length ?? 0);

  const hasMoreWithForce = forceHasMore || hasMore;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ---------------------------- 分页 / 加载 ---------------------------- */

  const handlePageChange = useCallback(
    (next: number) => {
      const safe = Math.min(Math.max(next, 1), totalPages);
      if (safe === queryParams.pageNum) return;

      const nextParams = { ...queryParams, pageNum: safe };
      setQueryParams(nextParams);

      if (!isClient && props.onQueryChange) {
        props.onQueryChange(nextParams);
      }
      onPageChange?.(safe, pageSize);
    },
    [queryParams, totalPages, pageSize, onPageChange, isClient, props]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      const nextParams = { ...queryParams, pageSize: size, pageNum: 1 };
      setQueryParams(nextParams);

      if (!isClient && props.onQueryChange) {
        props.onQueryChange(nextParams);
      }
      onPageSizeChange?.(size);
    },
    [queryParams, isClient, props, onPageSizeChange]
  );

  /* ---------------------------- 滚动触底 ---------------------------- */

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isMobile || !hasMoreWithForce) return;
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      if (isMobileInfinite) {
        fetchInfinitePage(pageNum + 1);
        onLoadMore?.(pageNum + 1, pageSize);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [
    isMobile,
    hasMoreWithForce,
    isMobileInfinite,
    fetchInfinitePage,
    pageNum,
    pageSize,
    onLoadMore,
  ]);

  /* ---------------------------- onDataChange ---------------------------- */

  React.useEffect(() => {
    if (!onDataChange) return;

    onDataChange({
      list: data,
      total,
      pageNum,
      pageSize,
      raw: isClient
        ? isMobileInfinite
          ? infinitePages[infinitePages.length - 1]
          : clientData ?? undefined
        : serverProps
        ? {
            list: serverProps.data,
            total: serverProps.total,
            pageNum: serverProps.pageNum ?? 1,
            pageSize: serverProps.pageSize ?? pageSize,
          }
        : undefined,
      loading: loadingInitial || loadingMore,
      hasMore: hasMoreWithForce,
    });
  }, [
    onDataChange,
    data,
    total,
    pageNum,
    pageSize,
    loadingInitial,
    loadingMore,
    hasMoreWithForce,
    isClient,
    isMobileInfinite,
    infinitePages,
    clientData,
    serverProps,
  ]);

  /* -------------------------------- render -------------------------------- */

  const renderPayload = {
    list: data,
    total,
    pageNum,
    pageSize,
    loading: loadingInitial || loadingMore,
    hasMore: hasMoreWithForce,
  };

  return (
    <div className={cn("space-y-4", className)}>
      {isMobile ? (
        <div className="relative">
          {renderContent(renderPayload)}
          <div ref={sentinelRef} className="h-px w-full" />
        </div>
      ) : (
        <>
          {renderContent(renderPayload)}
          {showPagination && total > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                共 {total} 条数据，第 {pageNum} / {totalPages} 页
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => handlePageSizeChange(Number(v))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((s) => (
                      <SelectItem key={s} value={String(s)}>
                        {s} 条/页
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageNum - 1)}
                    disabled={pageNum <= 1 || loadingInitial}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <div className="px-3 py-1 text-sm">
                    {pageNum} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageNum + 1)}
                    disabled={pageNum >= totalPages || loadingInitial}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
