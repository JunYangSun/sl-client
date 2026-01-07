"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import UserMenu from "./UserMenu";
import type { LayoutData } from "@/lib/logic/common/layout";

interface AuthSectionProps {
  authButtons: LayoutData["authButtons"];
  variant?: "desktop" | "tablet" | "mobile";
}

/**
 * 认证按钮区域组件
 * 支持不同屏幕尺寸的显示变体
 */
export default function AuthSection({ authButtons, variant = "desktop" }: AuthSectionProps) {
  const { isLoggedIn } = useAuthStore();

  // 移动端变体
  if (variant === "mobile") {
    if (isLoggedIn) {
      // 已登录：显示用户菜单（头像下拉菜单）
      return (
        <div className="md:hidden">
          <UserMenu size="sm" />
        </div>
      );
    }
    
    // 未登录：显示登录按钮
    return (
      <Button size="sm" variant="outline" asChild className="md:hidden">
        <Link href={authButtons.login.href}>{authButtons.login.text}</Link>
      </Button>
    );
  }

  // 桌面端和平板端变体
  const containerClass = variant === "desktop" 
    ? "hidden lg:flex items-center gap-4"
    : "hidden md:flex lg:hidden items-center gap-3";

  return (
    <div className={containerClass}>
      {isLoggedIn ? (
        <UserMenu size="md" />
      ) : (
        <>
          <Button variant="outline" asChild>
            <Link href={authButtons.login.href}>{authButtons.login.text}</Link>
          </Button>
          <Button asChild>
            <Link href={authButtons.register.href}>{authButtons.register.text}</Link>
          </Button>
        </>
      )}
    </div>
  );
}

