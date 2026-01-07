"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
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
  const { brand, navigation, authButtons } = data;
  const { checkAuth } = useAuthStore();
  const { mode, toggleMode } = useThemeStore();

  // 页面加载时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      {/* Navbar - 单一响应式结构 */}
      <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between h-14 md:h-16">
            <div className="flex items-center">
              <HamburgerButton
                isOpen={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
              <NavbarLogo brand={brand} />
              <DesktopNavigation navigation={navigation} />
            </div>

            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              <SearchBox variant="desktop" />
              <LanguageSwitcher />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMode}
                aria-label="切换明暗模式"
              >
                {mode === "light" ? (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
              <AuthSection authButtons={authButtons} variant="desktop" />
              <AuthSection authButtons={authButtons} variant="tablet" />
              <AuthSection authButtons={authButtons} variant="mobile" />
            </div>
          </div>

          <MobileMenu
            navigation={navigation}
            authButtons={authButtons}
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      </nav>

    </>
  );
}
