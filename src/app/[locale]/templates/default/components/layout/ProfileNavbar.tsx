"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LayoutData } from "@/lib/logic/common/layout";
import AuthSection from "./AuthSection";
import { useThemeStore } from "@/stores/theme";

const LanguageSwitcher = dynamic(
  () => import("@/components/ui/LanguageSwitcher"),
  { ssr: false }
);

interface ProfileNavbarProps {
  authButtons: LayoutData["authButtons"];
}

export default function ProfileNavbar({ authButtons }: ProfileNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const { mode, toggleMode } = useThemeStore();

  const pageTitle = useMemo(() => {
    if (pathname === "/profile") {
      return t("profile");
    }

    return t("profile");
  }, [pathname, t]);

  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14 md:h-16">
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

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <h1 className="text-base md:text-lg font-semibold text-foreground truncate">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 min-w-0 z-10">
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
      </div>
    </nav>
  );
}
