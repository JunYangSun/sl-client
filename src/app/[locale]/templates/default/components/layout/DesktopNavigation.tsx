"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/lib/logic/common/layout";

interface DesktopNavigationProps {
  navigation: NavItem[];
}

/**
 * 桌面端导航菜单组件
 * 只在 lg 及以上屏幕显示
 */
export default function DesktopNavigation({ navigation }: DesktopNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex ml-6 space-x-8">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
            pathname === item.href
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

