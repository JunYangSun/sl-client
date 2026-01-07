"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Users, BarChart3, Settings, Building2 } from "lucide-react";

/**
 * 企业模板布局 - 响应式版本
 *
 * 使用 Tailwind 响应式类实现多端适配:
 * - 移动端 (< 768px): 顶部导航 + 汉堡菜单
 * - 平板/桌面 (≥ 768px): 左侧固定侧边栏
 * - 桌面大屏 (≥ 1024px): 更宽的侧边栏
 */
export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "仪表板", href: "/dashboard", icon: LayoutDashboard },
    { name: "团队管理", href: "/team", icon: Users },
    { name: "数据分析", href: "/analytics", icon: BarChart3 },
    { name: "系统设置", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* 移动端顶部导航栏 - 只在小屏幕显示 */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Enterprise</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* 移动端下拉菜单 */}
        {isMobileMenuOpen && (
          <nav className="border-t border-border bg-card px-4 py-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <div className="flex">
        {/* 桌面端侧边栏 - 只在大屏幕显示 */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 xl:w-80 lg:fixed lg:inset-y-0 lg:bg-card lg:border-r lg:border-border">
          {/* 侧边栏标题 */}
          <div className="flex items-center gap-3 h-20 px-6 border-b border-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Enterprise</h1>
              <p className="text-xs text-muted-foreground">管理控制台</p>
            </div>
          </div>

          {/* 侧边栏导航 */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 group"
                >
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* 侧边栏底部信息 */}
          <footer className="p-4 border-t border-border">
            <div className="px-4 py-3 rounded-lg bg-muted/50">
              <p className="text-xs font-medium text-foreground">企业版</p>
              <p className="text-xs text-muted-foreground mt-1">
                版本 v2.0.0
              </p>
            </div>
          </footer>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 lg:ml-72 xl:ml-80">
          {/* 内容容器 - 响应式内边距和最大宽度 */}
          <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

