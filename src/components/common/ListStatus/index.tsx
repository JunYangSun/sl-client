"use client";

interface ListStatusProps {
  /**
   * 是否正在加载数据
   * - true: 显示加载提示（loadingText）
   * - false: 不显示加载提示
   * 通常在发起数据请求时设置为 true，请求完成（成功或失败）后设置为 false
   */
  loading?: boolean;
  /**
   * 是否还有更多数据可加载
   * - true: 表示还有更多数据，不显示"没有更多数据"提示
   * - false: 表示已加载全部数据，显示"没有更多数据"提示（noMoreText）
   * 通常在分页加载场景中使用，当返回的数据量小于请求的 pageSize 时，表示没有更多数据了
   */
  hasMore?: boolean;
  /**
   * 加载中显示的文本，默认为 "加载中..."
   */
  loadingText?: string;
  /**
   * 没有更多数据时显示的文本，默认为 "没有更多数据了"
   */
  noMoreText?: string;
}

/**
 * 列表状态提示组件
 * 用于显示加载状态和"没有更多数据"的提示
 * 
 * 显示逻辑：
 * 1. 当 loading 为 true 时，显示加载提示（loadingText）
 * 2. 当 loading 为 false 且 hasMore 为 false 时，显示"没有更多数据"提示（noMoreText）
 * 3. 其他情况不显示任何内容
 * 
 * 使用场景：
 * - 分页列表加载：在请求数据时设置 loading=true，请求完成后根据返回数据判断 hasMore
 * - 无限滚动：在触底加载时显示 loading，当返回数据量小于 pageSize 时设置 hasMore=false
 * 
 * @example
 * // 使用默认文本
 * <ListStatus loading={loading} hasMore={hasMore} />
 * 
 * @example
 * // 自定义文本
 * <ListStatus 
 *   loading={loading} 
 *   hasMore={hasMore}
 *   loadingText="正在加载..."
 *   noMoreText="已加载全部数据"
 * />
 */
export function ListStatus({
  loading = false,
  hasMore = true,
  loadingText = "加载中...",
  noMoreText = "没有更多数据了",
}: ListStatusProps) {
  if (loading) {
    return (
      <div className="text-center text-sm text-muted-foreground py-3">
        {loadingText}
      </div>
    );
  }

  if (!hasMore && !loading) {
    return (
      <div className="text-center text-sm text-muted-foreground py-3">
        {noMoreText}
      </div>
    );
  }

  return null;
}

