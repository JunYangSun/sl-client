import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /**
   * 开发环境跨域代理配置
   * 将 /api/* 请求代理到后端服务器
   * 解决 CORS 跨域问题
   */
  async rewrites() {
    return [
      {
        // 代理 /api/* 到后端（去掉 /api 前缀）
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL + "/:path*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
