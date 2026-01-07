"use client";

import { ReactNode } from "react";
import { OrderNavPC, OrderNavMobile } from "@/components/order/OrderNav";

interface OrderLayoutProps {
  children: ReactNode;
}

/**
 * 响应式订单页面布局
 * 使用 Tailwind CSS 响应式类代替 JS 设备检测
 */
export default function OrderLayout({ children }: OrderLayoutProps) {
  return (
    <>
      {/* 桌面端布局 (≥768px) */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-6 pl-54">
            <h1 className="text-3xl font-bold">我的订单</h1>
            <p className="text-muted-foreground mt-2">
              管理您的交易记录、订单、充值和提现
            </p>
          </div>

          <div className="flex gap-6">
            {/* 侧边栏导航 */}
            <OrderNavPC />

            {/* 内容区域 */}
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* 移动端布局 (<768px) */}
      <div className="md:hidden">
        {/* 页面标题 */}
        <div className="px-4 py-4 bg-card border-b border-border">
          <h1 className="text-2xl font-bold">我的订单</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理您的交易和财务记录
          </p>
        </div>

        {/* 横向滚动导航 */}
        <OrderNavMobile />

        {/* 内容区域 */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}

/**
 * PC 端订单页面布局（独立导出，可单独使用）
 */
export function OrderLayoutPC({ children }: OrderLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 pl-54">
        <h1 className="text-3xl font-bold">我的订单</h1>
        <p className="text-muted-foreground mt-2">
          管理您的交易记录、订单、充值和提现
        </p>
      </div>

      <div className="flex gap-6">
        <OrderNavPC />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * 移动端订单页面布局（独立导出，可单独使用）
 */
export function OrderLayoutMobile({ children }: OrderLayoutProps) {
  return (
    <div>
      <div className="px-4 py-4 bg-card border-b border-border">
        <h1 className="text-2xl font-bold">我的订单</h1>
        <p className="text-sm text-muted-foreground mt-1">
          管理您的交易和财务记录
        </p>
      </div>

      <OrderNavMobile />

      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
