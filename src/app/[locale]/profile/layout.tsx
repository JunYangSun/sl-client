"use client";
import {
  Receipt,
  ShoppingCart,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { SidebarNav } from "@/components/common/sidebar-nav";
import { usePathname } from "@/i18n/navigation";

const navItems = [
  {
    href: "/profile",
    title: "个人中心",
    icon: <ShoppingCart />,
    desc: "",
    showHeader: false,
  },
  {
    href: "/",
    title: "钱包",
    icon: <Receipt size={18} />,
    desc: "",
    showHeader: false,
  },
  {
    href: "/",
    title: "线下活动",
    icon: <ShoppingCart />,
    desc: "",
    showHeader: false,
  },
  {
    href: "/",
    title: "提现",
    icon: <ArrowDownToLine />,
    desc: "",
    showHeader: false,
  },
  {
    href: "/",
    title: "充值",
    icon: <ArrowUpFromLine />,
    desc: "",
    showHeader: false,
  },
];
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const current =
    navItems.find((item) => item.href === pathname) ?? navItems[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <SidebarNav
          items={navItems}
          title={current.title}
          desc={current.desc}
          layout
        >
          {children as React.JSX.Element}
        </SidebarNav>
      </div>
    </div>
  );
}
