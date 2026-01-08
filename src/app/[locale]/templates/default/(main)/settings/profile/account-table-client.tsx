"use client";

import { EcomListAuto } from "@/components/common/DataList";
import { ListStatus } from "@/components/common";
import { type AccountRecord } from "./account-table-view";
// import { AccountTableViewClient } from "./account-table-view-client";
// import { AccountTableView } from "./account-table-view";
/**
 * 使用真实接口的账户列表演示组件（电商风格列表）
 * - GET /admin/account/page/list?pageNum=&pageSize=&keyword=
 * - 父组件完全自定义 DOM，由 EcomListAuto 负责请求/分页/触底加载
 *
 * 注意：在 Client Component 中使用 EcomListAuto，而不是 EcomList（Server Component）
 */
export function AccountTableClient() {
  return (
    <EcomListAuto<AccountRecord>
      // 只需传接口地址和请求参数，组件内部自动补充分页参数并适配结构
      url="/admin/account/page/list"
      // data 即请求参数（会与内部 pageNum/pageSize 自动合并）
      data={{}}
      // View={AccountTableView}
      View={({ list, total, pageNum, pageSize, loading, hasMore }) => (
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

          <ListStatus loading={loading} hasMore={hasMore} />
        </div>
      )}
    />
  );
}
