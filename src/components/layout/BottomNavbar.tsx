"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, FileText, CreditCard, User } from "lucide-react";
import Tabbar from "@/components/common/tabbar";
import type { TabItem } from "@/components/common/tabbar";

/**
 * 移动端底部导航栏
 * 包含：首页、订单、省钱卡、我的
 */
export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  // 导航项配置
  const navItems: TabItem[] = [
    {
      key: "/",
      label: "首页",
      icon: <Home className="h-5 w-5" />,
    },
    {
      key: "/order",
      label: "订单",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      key: "/card",
      label: "省钱卡",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      key: "/profile",
      label: "我的",
      icon: <User className="h-5 w-5" />,
    },
  ];

  // 获取当前激活的导航项
  const getActiveKey = () => {
    // 精确匹配路径
    const exactMatch = navItems.find(item => pathname === item.key);
    if (exactMatch) return exactMatch.key;

    // 模糊匹配（用于子路由）
    const fuzzyMatch = navItems.find(item =>
      item.key !== "/" && pathname.startsWith(item.key)
    );
    if (fuzzyMatch) return fuzzyMatch.key;

    return "/";
  };

  // 处理导航切换
  const handleChange = (key: string) => {
    router.push(key);
  };

  return (
    <Tabbar
      items={navItems}
      activeKey={getActiveKey()}
      onChange={handleChange}
      mode="bottom"
    />
  );
}
