"use client";

import { useTranslations } from "next-intl";

// 导航项类型
export interface NavItem {
  name: string;
  href: string;
}

// 布局数据类型
export interface LayoutData {
  brand: {
    name: string;
    href: string;
  };
  navigation: NavItem[];
  authButtons: {
    login: {
      text: string;
      href: string;
    };
    register: {
      text: string;
      href: string;
    };
  };
}

// 布局 Props 类型（供模板组件使用）
export interface LayoutTemplateProps {
  data: LayoutData;
  children: React.ReactNode;
}

/**
 * 获取布局数据的 Hook
 * 使用 i18n 翻译
 */
export function useLayoutData(): LayoutData {
  const t = useTranslations();

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

export default useLayoutData;

