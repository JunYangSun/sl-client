import { getLayoutData } from "@/lib/logic/common/layout";
import BottomNavbar from "@/components/layout/BottomNavbar";
import ProfileNavbar from "../components/layout/ProfileNavbar";
import Navbar from "../components/layout/Navbar";

/**
 * 默认模板 Profile 布局 - Server Component
 * 移动端使用 ProfileNavbar，PC端使用 Navbar
 */
export default async function DefaultProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getLayoutData();

  return (
    <>
      {/* 移动端：显示 ProfileNavbar */}
      <div className="md:hidden">
        <ProfileNavbar />
      </div>
      {/* PC端：显示 Navbar */}
      <div className="hidden md:block">
        <Navbar data={data} />
      </div>
      <main className="bg-background pb-16 md:pb-0 md:min-h-screen">
        {children}
      </main>
      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </>
  );
}
