import React from "react";

// 首页示例表格公共类型（与 settings 的账户列表类似）
export interface HomeAccountRecord extends Record<string, unknown> {
  userId: number;
  userName: string;
  email: string | null;
  phonenumber: string | null;
  roleName: string | null;
  agencyName: string | null;
  status: string;
  createTime: string | null;
}

export interface HomeAccountTableViewProps {
  list: HomeAccountRecord[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages?: number;
  loading?: boolean;
  hasMore?: boolean;
}

export function HomeAccountTableView({
  list,
  total,
  pageNum,
  pageSize,
  pages,
  loading = false,
  hasMore = false,
}: HomeAccountTableViewProps) {
  const totalPages =
    pages && pages > 0 ? pages : Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4 mt-12">
      <h3 className="text-2xl font-semibold">首页示例账户列表（服务端渲染首屏）</h3>
      <p className="text-gray-600">
        通过服务端请求 /admin/account/page/list 接口，首屏数据直接输出到 HTML，便于 SEO。
      </p>

      <div className="text-sm text-muted-foreground">
        共 {total} 条账户记录，第 {pageNum} 页（{pageSize} 条/页）
      </div>

      <div className="border rounded-md overflow-hidden">
        {list.map((row) => (
          <div
            key={row.userId}
            className="grid grid-cols-[80px,1fr,1.2fr,1.2fr,1fr,1fr,0.8fr,1.4fr] px-4 py-2 text-xs border-t"
          >
            <div>{row.userId}</div>
            <div>{row.userName}</div>
            <div>{row.email ?? "-"}</div>
            <div>{row.phonenumber ?? "-"}</div>
            <div>{row.roleName ?? "-"}</div>
            <div>{row.agencyName ?? "-"}</div>
            <div>{row.status === "0" ? "正常" : "禁用"}</div>
            <div>{row.createTime ?? "-"}</div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center text-sm text-muted-foreground py-3">
          加载中...
        </div>
      )}

      {!hasMore && !loading && (
        <div className="text-center text-sm text-muted-foreground py-3">
          没有更多数据了
        </div>
      )}

      {/* 简单分页信息（上一页/下一页在 Server 组件里通过 Link 处理） */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          第 {pageNum} / {totalPages} 页
        </span>
      </div>
    </div>
  );
}


