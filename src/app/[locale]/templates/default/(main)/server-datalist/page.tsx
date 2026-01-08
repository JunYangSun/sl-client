import { EcomList } from "@/components/common/DataList";
import type { AccountRecord } from "@/app/[locale]/templates/default/(main)/settings/profile/account-table-view";
import { AccountTableViewClient } from "@/app/[locale]/templates/default/(main)/settings/profile/account-table-view-client";

/**
 * 服务端渲染 + 客户端交互 一体化示例
 *
 * 🎯 使用统一入口组件 EcomList：
 * - 只 import 一个组件
 * - 参数只传一次
 * - View 组件只定义一次
 * - SSR / CSR 自动完成
 *
 * ✨ 实现效果：
 * - ✅ 首屏 SSR：服务端请求首屏数据，SEO 友好，首屏加载快
 * - ✅ 客户端交互：后续分页/滚动由客户端处理，体验流畅
 * - ✅ 移动端无限滚动：自动支持触底加载
 * - ✅ PC 端分页：自动支持分页控件
 * - ✅ 禁用 JS 友好：首屏数据在 HTML 中，禁用 JS 也能看到数据
 *
 * 🔑 关键点：
 * - View 必须是 Client Component（即使只是简单包装）
 * - 通过组件引用（View={AccountTableViewClient}）而不是函数传递
 * - 这样避免了函数跨 Server/Client 边界的问题
 */
export default async function ServerDataListPage() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Server DataList 示例</h1>
        <p className="text-sm text-muted-foreground">
          使用 EcomList 统一入口：自动处理 SSR 首屏 + 客户端交互（PC 分页 /
          移动端无限滚动）
        </p>
      </div>

      {/* 🎉 统一入口：一次编写，自动处理 SSR + 客户端交互 */}
      {/* 使用 View 组件而不是函数 children，避免函数跨边界传递 */}
      {/* 服务端渲染时，数据从服务器发送到客户端
      内联函数无法被序列化传输
      Next.js 无法将函数从服务端传递到客户端
      在服务端组件中使用预定义的客户端组件可以 */}
      <EcomList<AccountRecord>
        url="/admin/account/page/list"
        data={{}}
        infiniteAppendOnMobile={true}
        showPagination={true}
        View={AccountTableViewClient}
      />
    </div>
  );
}
