// "use client";

// import { AccountTableView } from "./account-table-view";
// import type { EcomListBaseRenderPayload } from "@/components/common/DataList";
// import type { AccountRecord } from "./account-table-view";

// /**
//  * AccountTableViewClient：Client Component 包装器
//  *
//  * ⚠️ 即使 AccountTableView 本身不需要 hooks，
//  * 这个 wrapper 也必须是 client，因为它是从 Server Component 传递到 Client Component 的
//  */
// export function AccountTableViewClient(
//   props: EcomListBaseRenderPayload<AccountRecord>
// ) {
//   return <AccountTableView {...props} />;
// }

// account-table-view-client.tsx
"use client";

import type { AccountRecord } from "./account-table-view";
import { ListStatus } from "@/components/common";

export function AccountTableViewClient({
  list,
  total,
  pageNum,
  pageSize,
  loading,
  hasMore,
}: {
  list: AccountRecord[];
  total: number;
  pageNum: number;
  pageSize: number;
  loading: boolean;
  hasMore: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        服务端渲染共 {total} 条账户记录，第 {pageNum} 页（{pageSize} 条/页）
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

      <ListStatus loading={loading} hasMore={hasMore} />
    </div>
  );
}
