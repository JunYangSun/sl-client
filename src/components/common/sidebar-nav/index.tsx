"use client";

import { useState, useEffect, type JSX } from "react";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type SidebarNavItem = {
  href: string;
  title: string;
  icon: JSX.Element;
  /**
   * 是否展示标题和描述区域（包括分隔符）
   * - true（默认）：展示标题、描述和分隔符
   * - false：不展示标题、描述和分隔符
   */
  showHeader?: boolean;
};

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * 左侧菜单项
   */
  items: SidebarNavItem[];
  /**
   * 是否启用「带内容区域」的布局模式
   * - false（默认）：只渲染导航，不管右侧内容
   * - true：左侧导航 + 右侧内容区（内容由 children 提供）
   */
  layout?: boolean;
  /**
   * 右侧内容区标题
   */
  title?: string;
  /**
   * 右侧内容区描述
   */
  desc?: string;
};

export function SidebarNav({
  className,
  items,
  layout,
  title,
  desc,
  children,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [val, setVal] = useState(pathname ?? "/settings");
  // 只在客户端挂载完成后再渲染 Select，避免 Radix 在 SSR/CSR 生成不同 id 导致 hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 使用 requestAnimationFrame 避免同步的 setState 触发 linter 警告
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // 根据当前 pathname 找到对应的导航项，获取其 showHeader 配置
  const currentItem = items.find((item) => item.href === pathname);
  const showHeader = currentItem?.showHeader !== false; // 默认为 true

  const handleSelect = (e: string) => {
    setVal(e);
    router.push(e);
  };

  const nav = (
    <>
      {/* 移动端：Select 下拉 */}
      {mounted && (
        <div className="p-1 md:hidden">
          <Select value={val} onValueChange={handleSelect}>
            <SelectTrigger className="h-12 sm:w-48">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.href} value={item.href}>
                  <div className="flex gap-x-4 px-2 py-1">
                    <span className="scale-125">{item.icon}</span>
                    <span className="text-md">{item.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 桌面端：侧边按钮列表 */}
      <ScrollArea className="bg-background hidden w-full min-w-40 px-1 py-2 md:block">
        <nav
          className={cn(
            "flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0",
            className
          )}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-muted hover:bg-accent"
                  : "hover:bg-accent hover:underline",
                "justify-start"
              )}
            >
              <span className="me-2">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );

  // 默认：只返回导航（兼容老用法）
  if (!layout) {
    return nav;
  }

  // 带内容区域的布局模式，相当于在这里把 ContentSection 包一层
  return (
    <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
      <aside className="top-0 lg:sticky lg:w-1/5">{nav}</aside>

      <section className="flex flex-1 flex-col">
        {showHeader && (
          <>
            <div className="flex-none">
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </div>
            <Separator className="my-4 flex-none" />
          </>
        )}
        <div className="faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12">
          <div className="-mx-1 px-1.5 lg:max-w-full">{children}</div>
        </div>
      </section>
    </div>
  );
}
