import BottomNavbar from "@/components/layout/BottomNavbar";
import ProfileNavbar from "../components/layout/ProfileNavbar";

/**
 * 默认模板 Profile 布局 - Server Component
 * 使用专用 Profile Navbar
 */
export default async function DefaultProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <ProfileNavbar />
      <main className="bg-background pb-16 md:pb-0 md:min-h-screen">
        {children}
      </main>
      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </>
  );
}
