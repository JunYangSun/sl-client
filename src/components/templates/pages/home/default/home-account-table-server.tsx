import Link from "next/link";
import { get } from "@/lib/request/server";
import {
  HomeAccountTableView,
  type HomeAccountRecord,
} from "./home-account-table-view";

interface PageShape {
  records?: HomeAccountRecord[];
  list?: HomeAccountRecord[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 首页示例表格 - 服务端版本
 * - 使用服务端 get 请求拿到第一页数据
 * - 直接渲染表格 HTML，便于 SEO 和“查看源代码”搜索
 */
export async function HomeAccountTableServer({
  pageNum: initialPageNum = 1,
  pageSize: initialPageSize = 10,
}: {
  pageNum?: number;
  pageSize?: number;
}) {
  let list: HomeAccountRecord[] = [];
  let total = 0;
  let pageNum = initialPageNum;
  let pageSize = initialPageSize;
  let pages = 1;

  try {
    const res = await get<unknown>("/admin/account/page/list", {
      pageNum,
      pageSize,
    });

    if (res.code === 200 && res.data) {
      const page = res.data as PageShape;

      // 兼容 records/total/size/current/pages 结构
      if (Array.isArray(page.records)) {
        list = page.records;
        total = page.total ?? 0;
        pageNum = page.current ?? pageNum;
        pageSize = page.size ?? pageSize;
        pages = page.pages ?? pages;
      } else {
        // 兼容 list/total/pageNum/pageSize/pages 结构
        list = (page.list ?? []) as HomeAccountRecord[];
        total = page.total ?? 0;
        pageNum = page.pageNum ?? pageNum;
        pageSize = page.pageSize ?? pageSize;
        pages = page.pages ?? pages;
      }
    }
  } catch (error) {
    console.error("HomeAccountTableServer fetch error:", error);
  }

  const hasMore = total > list.length;
  const totalPages = pages && pages > 0 ? pages : Math.max(1, Math.ceil(total / pageSize));
  const prevPage = pageNum > 1 ? pageNum - 1 : 1;
  const nextPage = pageNum < totalPages ? pageNum + 1 : totalPages;

  return (
    <div className="space-y-3">
      <HomeAccountTableView
        list={list}
        total={total}
        pageNum={pageNum}
        pageSize={pageSize}
        pages={totalPages}
        loading={false}
        hasMore={hasMore}
      />

      {/* 服务端分页链接（带 page 参数） */}
      {total > 0 && (
        <div className="flex justify-end items-center gap-2 text-xs text-muted-foreground">
          <Link
            href={pageNum > 1 ? `?page=${prevPage}` : `?page=1`}
            className={`px-3 py-1 border rounded ${
              pageNum <= 1 ? "pointer-events-none opacity-50" : "hover:bg-accent"
            }`}
          >
            上一页
          </Link>
          <span>
            {pageNum} / {totalPages}
          </span>
          <Link
            href={pageNum < totalPages ? `?page=${nextPage}` : `?page=${totalPages}`}
            className={`px-3 py-1 border rounded ${
              pageNum >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-accent"
            }`}
          >
            下一页
          </Link>
        </div>
      )}
    </div>
  );
}


