"use client";

import { usePathname } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth";
import type { LayoutData } from "@/lib/logic/common/layout";

interface MobileMenuProps {
  navigation: LayoutData["navigation"];
  authButtons: LayoutData["authButtons"];
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 移动端/平板端下拉菜单组件
 * 只在 lg 以下屏幕显示
 */
export default function MobileMenu({ navigation, authButtons, isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();
  const t = useTranslations("common");

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/login");
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-border bg-card">
      <div className="px-4 py-2 space-y-1">
        {/* 导航链接 */}
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {item.name}
          </Link>
        ))}

        {/* 已登录：显示用户信息和登出按钮 */}
        {isLoggedIn ? (
          <div className="pt-2 border-t border-border">
            {user?.username && (
              <div className="flex items-center gap-2 px-3 py-2">
                <Avatar
                  src={user?.avatar}
                  name={user?.username}
                  size="sm"
                />
                <p className="text-sm text-muted-foreground">
                  {t("welcome")}，{user.username}
                </p>
              </div>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full cursor-pointer"
            >
              {t("logout")}
            </Button>
          </div>
        ) : (
          /* 未登录：显示注册按钮 */
          <div className="pt-2 border-t border-border">
            <Button className="w-full" asChild>
              <Link href={authButtons.register.href}>{authButtons.register.text}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

