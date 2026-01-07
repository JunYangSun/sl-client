"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import BottomNavbar from "@/components/layout/BottomNavbar";
import type { LayoutData } from "@/lib/logic/common/layout";
import NavbarLogo from "./NavbarLogo";
import DesktopNavigation from "./DesktopNavigation";
import AuthSection from "./AuthSection";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";
import SearchBox from "./SearchBox";

// 动态导入语言切换器，禁用 SSR 以避免 hydration 不匹配
const LanguageSwitcher = dynamic(
  () => import("@/components/ui/LanguageSwitcher"),
  { ssr: false }
);

interface NavbarProps {
  data: LayoutData;
}

/**
 * 客户端导航组件
 * 使用单一 DOM 结构 + 响应式 class，避免重复渲染
 */
export default function Navbar({ data }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const { brand, navigation, authButtons } = data;
  const { checkAuth } = useAuthStore();

  // 判断是否为 profile 页面及其子页面
  const isProfilePage = useMemo(() => {
    return pathname?.startsWith("/profile") || false;
  }, [pathname]);

  // 获取当前页面标题
  const pageTitle = useMemo(() => {
    if (!isProfilePage) return null;
    
    // 根据路径获取标题
    if (pathname === "/profile") {
      return t("profile");
    }
    // 可以扩展其他子页面的标题映射
    // if (pathname === "/profile/settings") return t("settings");
    
    return t("profile");
  }, [isProfilePage, pathname, t]);

  // 页面加载时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      {/* Navbar - 单一响应式结构 */}
      <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
          {isProfilePage ? (
            // Profile 页面特殊布局：返回按钮 | 标题（居中）| 右侧操作按钮
            <div className="relative flex items-center justify-between h-14 md:h-16">
              {/* 左侧：返回按钮 */}
              <div className="flex items-center min-w-0 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="cursor-pointer"
                  aria-label="返回"
                >
                  <ChevronLeft className="size-6" />
                </Button>
              </div>

              {/* 中间：页面标题 - 绝对定位居中 */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                <h1 className="text-base md:text-lg font-semibold text-foreground truncate">
                  {pageTitle}
                </h1>
              </div>

              {/* 右侧：操作按钮区 */}
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4 min-w-0 z-10">
                {/* 语言切换器 */}
                <LanguageSwitcher />

                {/* 认证状态 - 不同屏幕尺寸 */}
                <AuthSection authButtons={authButtons} variant="desktop" />
                <AuthSection authButtons={authButtons} variant="tablet" />
                <AuthSection authButtons={authButtons} variant="mobile" />
              </div>
            </div>
          ) : (
            // 默认布局
            <div className="flex justify-between h-14 md:h-16">
              <div className="flex items-center">
                {/* 移动端汉堡菜单按钮 */}
                <HamburgerButton
                  isOpen={isMenuOpen}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
                <NavbarLogo brand={brand} />
                <DesktopNavigation navigation={navigation} />
              </div>

              {/* 右侧：操作按钮区 */}
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                {/* 搜索框 - 只在桌面端显示 */}
                <SearchBox variant="desktop" />

                {/* 语言切换器 */}
                <LanguageSwitcher />

                {/* 认证状态 - 不同屏幕尺寸 */}
                <AuthSection authButtons={authButtons} variant="desktop" />
                <AuthSection authButtons={authButtons} variant="tablet" />
                <AuthSection authButtons={authButtons} variant="mobile" />
              </div>
            </div>
          )}

          {/* 移动端/平板端下拉菜单 - 只在非 profile 页面显示 */}
          {!isProfilePage && (
            <MobileMenu
              navigation={navigation}
              authButtons={authButtons}
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            />
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
