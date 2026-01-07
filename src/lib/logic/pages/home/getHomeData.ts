import type { HomeData } from "./useHomeData";

/**
 * 服务器端获取首页数据
 * 用于 Server Components
 * 后续可扩展为从 API 获取数据
 */
export async function getHomeData(): Promise<HomeData> {
  // 静态数据，后续可改为从 API 获取
  const data: HomeData = {
    hero: {
      title: "欢迎来到 ADOS",
      subtitle: "一个现代化的客户端应用，为您提供最佳的用户体验",
      primaryButton: {
        text: "开始使用",
        href: "/register",
      },
      secondaryButton: {
        text: "立即登录",
        href: "/login",
      },
    },
    features: [
      {
        id: "fast",
        icon: "⚡",
        title: "快速响应",
        description: "基于最新技术栈构建，提供流畅的用户体验",
        content: "使用 React 19 和 Next.js 15，确保应用性能和稳定性",
      },
      {
        id: "secure",
        icon: "🔐",
        title: "安全可靠",
        description: "完善的用户认证和数据保护机制",
        content: "采用现代化的安全标准，保护您的个人信息安全",
      },
      {
        id: "easy",
        icon: "✨",
        title: "简洁易用",
        description: "直观的界面设计，轻松上手使用",
        content: "精心设计的用户界面，让每个操作都变得简单直观",
      },
    ],
    cta: {
      title: "准备好开始了吗？",
      description: "立即注册账户，体验全新的应用功能",
      buttonText: "免费注册",
      buttonHref: "/register",
    },
  };

  return data;
}
