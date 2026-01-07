import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./config";

/**
 * 导出 next-intl 的导航工具
 * 这些工具会自动处理语言前缀
 */
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
});
