"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBoxProps {
  variant?: "desktop" | "mobile";
  onMobileExpandChange?: (expanded: boolean) => void;
}

/**
 * 搜索框组件
 * 支持桌面端和移动端两种显示模式
 */
export default function SearchBox({ variant = "desktop", onMobileExpandChange }: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const t = useTranslations("common");

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      router.push(`/search?q=${encodeURIComponent(query)}`);
      // 搜索完成后清除输入框
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 移动端：显示为图标按钮，点击后展开搜索框
  if (variant === "mobile") {

    const handleExpand = () => {
      setIsExpanded(true);
      onMobileExpandChange?.(true);
    };

    const handleCollapse = () => {
      setIsExpanded(false);
      setSearchQuery("");
      onMobileExpandChange?.(false);
    };

    if (isExpanded) {
      return (
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="pl-9 w-full"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCollapse}
            aria-label={t("close")}
          >
            <X className="h-5 w-5" />
          </Button>
        </form>
      );
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleExpand}
        aria-label={t("search")}
        className="md:hidden"
      >
        <Search className="h-5 w-5" />
      </Button>
    );
  }

  // 桌面端：只显示搜索框，回车键触发搜索
  return (
    <form onSubmit={handleSearch} className="hidden md:flex items-center">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 w-64 lg:w-80"
        />
      </div>
    </form>
  );
}

