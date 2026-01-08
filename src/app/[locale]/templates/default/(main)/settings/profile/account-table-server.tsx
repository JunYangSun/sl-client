import { get } from "@/lib/request/server";
import { AccountTableView, type AccountRecord } from "./account-table-view";

interface PageShape {
  records?: AccountRecord[];
  list?: AccountRecord[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 服务器端账户列表（首屏 SSR 用）
 * - 使用服务端 get 请求拿到第一页数据
 * - 直接渲染表格 HTML，便于 SEO / 查看页面源代码
 */
export async function AccountTableServer() {
  let list: AccountRecord[] = [];
  let total = 0;
  let pageNum = 1;
  let pageSize = 10;

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
      } else {
        // 兼容 list/total/pageNum/pageSize/pages 结构
        list = (page.list ?? []) as AccountRecord[];
        total = page.total ?? 0;
        pageNum = page.pageNum ?? pageNum;
        pageSize = page.pageSize ?? pageSize;
      }
    }
  } catch (error) {
    console.error("AccountTableServer fetch error:", error);
  }

  const hasMore = total > list.length;

  return (
    <AccountTableView
      list={list}
      total={total}
      pageNum={pageNum}
      pageSize={pageSize}
      loading={false}
      hasMore={hasMore}
    />
  );
}


