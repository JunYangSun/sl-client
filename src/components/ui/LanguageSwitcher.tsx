"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * 语言切换组件
 * 点击地球图标打开 Modal 进行语言选择
 */
export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const handleSelect = (newLocale: Locale) => {
    router.push(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={t("selectLanguage") || "选择语言"}
        className="cursor-pointer"
      >
        <Languages className="size-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{t("selectLanguage") || "选择语言"}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("selectLanguage") || "选择语言"}
          </DialogDescription>
          <div className="space-y-2 py-2">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors cursor-pointer ${
                  locale === loc
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{localeNames[loc]}</span>
                  {locale === loc && <span className="text-sm">✓</span>}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

