"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBoxProps {
  defaultValue?: string;
  className?: string;
}

/**
 * 搜索输入框组件（用于搜索结果页面）
 */
export default function SearchInput({ defaultValue = "", className }: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const router = useRouter();
  const t = useTranslations("common");

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 w-full md:w-96"
        />
      </div>
    </form>
  );
}

