import { getTranslations } from "next-intl/server";
import type { LayoutData } from "./useLayoutData";

/**
 * 服务器端获取布局数据
 * 用于 Server Components
 */
export async function getLayoutData(): Promise<LayoutData> {
  const t = await getTranslations();

  const data: LayoutData = {
    brand: {
      name: t("common.brand"),
      href: "/",
    },
    navigation: [
      { name: t("nav.home"), href: "/" },
      { name: t("nav.profile"), href: "/profile" },
      { name: t("nav.list"), href: "/list" },
    ],
    authButtons: {
      login: {
        text: t("common.login"),
        href: "/login",
      },
      register: {
        text: t("common.register"),
        href: "/register",
      },
    },
  };

  return data;
}
