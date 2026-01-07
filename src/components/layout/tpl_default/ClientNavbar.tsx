"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import BottomNavbar from "@/components/layout/BottomNavbar";
import type { LayoutData } from "@/lib/logic/common/layout";

// 动态导入语言切换器，禁用 SSR 以避免 hydration 不匹配
const LanguageSwitcher = dynamic(
  () => import("@/components/ui/LanguageSwitcher"),
  { ssr: false }
);

interface ClientNavbarProps {
  data: LayoutData;
}

/**
 * 客户端导航组件
 * 使用单一 DOM 结构 + 响应式 class，避免重复渲染
 */
export default function ClientNavbar({ data }: ClientNavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { brand, navigation, authButtons } = data;
  const { isLoggedIn, user, logout, checkAuth } = useAuthStore();
  const { mode, toggleMode } = useThemeStore();
  const router = useRouter();
  const t = useTranslations("common");

  // 页面加载时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 登出处理
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Navbar - 单一响应式结构 */}
      <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between h-14 md:h-16">
            {/* 左侧：Logo + 导航（桌面端） */}
            <div className="flex items-center">
              {/* Logo */}
              <Link
                href={brand.href}
                className="text-lg md:text-xl font-bold text-foreground shrink-0"
              >
                {brand.name}
              </Link>

              {/* 桌面端导航 - 水平菜单（lg:及以上显示） */}
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
            </div>

            {/* 右侧：操作按钮区 */}
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              {/* 主题切换按钮 - 所有屏幕都显示 */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMode}
                aria-label="切换主题模式"
                title={mode === "light" ? "切换到暗色模式" : "切换到亮色模式"}
                className="shrink-0 cursor-pointer"
              >
                {mode === "light" ? (
                  <Moon className="h-4 w-4 md:h-[1.2rem] md:w-[1.2rem]" />
                ) : (
                  <Sun className="h-4 w-4 md:h-[1.2rem] md:w-[1.2rem]" />
                )}
              </Button>

              {/* 语言切换器 - 只在桌面端显示 */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* 认证状态 - 桌面端完整显示 */}
              <div className="hidden lg:flex items-center gap-4">
                {isLoggedIn ? (
                  <>
                    <span className="text-sm text-foreground">
                      {user?.username ? `${t("welcome")}，${user.username}` : t("welcomeBack")}
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      {t("logout")}
                    </Button>
                  </>
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

              {/* 平板端认证按钮 - 简化版 */}
              <div className="hidden md:flex lg:hidden items-center gap-3">
                {isLoggedIn ? (
                  <>
                    <span className="text-sm text-foreground">
                      {user?.username ? `${t("welcome")}，${user.username}` : t("welcomeBack")}
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      {t("logout")}
                    </Button>
                  </>
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

              {/* 移动端登录按钮 - 未登录时显示 */}
              {!isLoggedIn && (
                <Button size="sm" variant="outline" asChild className="md:hidden">
                  <Link href={authButtons.login.href}>{authButtons.login.text}</Link>
                </Button>
              )}

              {/* 汉堡菜单按钮 - 只在移动端和平板端显示 */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* 移动端/平板端下拉菜单 */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-border bg-card">
              <div className="px-4 py-2 space-y-1">
                {/* 导航链接 */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
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
                      <p className="px-3 py-2 text-sm text-muted-foreground">
                        {t("welcome")}，{user.username}
                      </p>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
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
          )}
        </div>
      </nav>

      {/* 底部导航栏 - 只在移动端显示 */}
      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </>
  );
}
