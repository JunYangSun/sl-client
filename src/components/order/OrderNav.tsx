"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  Receipt,
  ShoppingCart,
  ArrowDownToLine,
  ArrowUpFromLine,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    href: "/order/transactions",
    label: "交易记录",
    icon: Receipt,
  },
  {
    href: "/order/orders",
    label: "订单列表",
    icon: ShoppingCart,
  },
  {
    href: "/order/recharge",
    label: "充值列表",
    icon: ArrowDownToLine,
  },
  {
    href: "/order/withdraw",
    label: "提现列表",
    icon: ArrowUpFromLine,
  },
];

/**
 * PC 端订单导航 - 侧边栏样式
 */
export function OrderNavPC() {
  const pathname = usePathname();

  return (
    <nav className="w-48 flex-shrink-0">
      <div className="sticky top-20 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * 移动端订单导航 - 横向滚动标签
 */
export function OrderNavMobile() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-card sticky top-14 z-40">
      <div className="overflow-x-auto">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
