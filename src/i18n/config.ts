/**
 * i18n 配置
 * 定义支持的语言和默认语言
 */

export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// 语言显示名称
export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "简体中文",
};
