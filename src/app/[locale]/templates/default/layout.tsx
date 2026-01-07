import { getLayoutData } from "@/lib/logic/common/layout";
import Navbar from "./components/layout/Navbar";

/**
 * 默认模板布局 - Server Component
 *
 * 使用 Tailwind 响应式类整合三端布局:
 * - 移动端 (< 768px): 顶部导航 + 汉堡菜单 + 底部导航栏
 * - 平板端 (768px - 1023px): 顶部导航 + 水平菜单
 * - 桌面端 (≥ 1024px): 完整导航 + 语言切换 + 认证状态
 */
export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 在服务器端获取布局数据
  const data = await getLayoutData();

  return (
    <>
      <Navbar data={data} />

      {/* Main Content */}
      {/* 移动端：pb-16 给底部导航留空间 */}
      {/* 平板端和桌面端：min-h-screen */}
      <main className="bg-background pb-16 md:pb-0 md:min-h-screen">
        {children}
      </main>
    </>
  );
}
