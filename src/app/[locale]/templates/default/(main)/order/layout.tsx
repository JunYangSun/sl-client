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
    href: "/order/transactions",
    title: "交易记录",
    icon: <Receipt size={18} />,
    desc: "查看所有收入和支出记录",
    showHeader: false,
  },
  {
    href: "/order/orders",
    title: "订单列表",
    icon: <ShoppingCart />,
    desc: "查看和管理您的所有订单",
    showHeader: false,
  },
  {
    href: "/order/recharge",
    title: "充值列表",
    icon: <ArrowDownToLine />,
    desc: "查看和管理您的充值记录",
    showHeader: false,
  },
  {
    href: "/order/withdraw",
    title: "提现列表",
    icon: <ArrowUpFromLine />,
    desc: "查看和管理您的提现记录",
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
