"use client";

import {
  Receipt,
  ShoppingCart,
  ArrowDownToLine,
  ArrowUpFromLine,
  UserCog,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/common/sidebar-nav";
import { usePathname } from "@/i18n/navigation";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: <UserCog size={18} />,
    desc: "This is how others will see you on the site.",
    showHeader: true,
  },
  {
    href: "/profile/transactions",
    title: "交易记录",
    icon: <Receipt size={18} />,
    desc: "查看所有收入和支出记录",
    showHeader: false,
  },
  {
    href: "/profile/orders",
    title: "订单列表",
    icon: <ShoppingCart size={18} />,
    desc: "查看和管理您的所有订单",
    showHeader: false,
  },
  {
    href: "/profile/recharge",
    title: "充值列表",
    icon: <ArrowDownToLine size={18} />,
    desc: "查看和管理您的充值记录",
    showHeader: false,
  },
  {
    href: "/profile/withdraw",
    title: "提现列表",
    icon: <ArrowUpFromLine size={18} />,
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
    sidebarNavItems.find((item) => item.href === pathname) ?? sidebarNavItems[0];

  return (
    <>
        <div className="min-h-screen bg-background hidden md:block">
            <div className="container mx-auto py-6 px-4">
                <Separator className="my-4 lg:my-6" />
                <SidebarNav
                items={sidebarNavItems}
                layout
                title={current.title}
                desc={current.desc}
                >
                {children as React.JSX.Element}
                </SidebarNav>
            </div>
        </div>
        <div className="md:hidden">
            {children}
        </div>
    </>
  );
}
