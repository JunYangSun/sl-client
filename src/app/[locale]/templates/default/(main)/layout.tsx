import { getLayoutData } from "@/lib/logic/common/layout";
import BottomNavbar from "@/components/layout/BottomNavbar";
import Navbar from "../components/layout/Navbar";

/**
 * 默认模板主布局 - Server Component
 * 渲染顶部导航与移动端底部导航
 */
export default async function DefaultMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getLayoutData();

  return (
    <>
      <Navbar data={data} />
      <main className="bg-background pb-16 md:pb-0 md:min-h-screen">
        {children}
      </main>
      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </>
  );
}
