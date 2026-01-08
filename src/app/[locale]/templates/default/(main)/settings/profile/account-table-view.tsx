import React from "react";

// 与客户端共用的账户记录类型
export interface AccountRecord extends Record<string, unknown> {
  userId: number;
  userName: string;
  email: string | null;
  phonenumber: string | null;
  roleName: string | null;
  agencyName: string | null;
  status: string;
  createTime: string | null;
}

export interface AccountTableViewProps {
  list: AccountRecord[];
  total: number;
  pageNum: number;
  pageSize: number;
  loading?: boolean;
  hasMore?: boolean;
}

export function AccountTableView({
  list,
  total,
  pageNum,
  pageSize,
  loading = false,
  hasMore = false,
}: AccountTableViewProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}


