/**
 * "use client" 指令说明：
 * 
 * "use client" 表示这是一个客户端组件，但并不意味着它只在客户端运行。
 * Next.js 的渲染流程是：
 * 
 * 1. 服务端渲染（SSR）：
 *    - 在服务端执行组件代码，生成初始 HTML
 *    - 这个 HTML 包含完整的组件内容（包括关闭状态的隐藏内容）
 *    - 搜索引擎可以直接从 HTML 源代码中读取内容（SEO 友好）
 * 
 * 2. 客户端 Hydration：
 *    - 将生成的 HTML 发送到客户端
 *    - React 在客户端接管这些 DOM 节点
 *    - 添加事件监听器和交互逻辑，使组件变成可交互的
 * 
 * 3. 客户端更新：
 *    - 用户交互后，组件状态改变，触发客户端重新渲染
 *    - 这时才真正使用客户端能力（useState、useEffect 等）
 * 
 * 所以即使标记了 "use client"，组件的初始 HTML 仍然在服务端生成，
 * 这就是为什么我们需要在关闭状态渲染隐藏内容的原因：
 * - 服务端渲染时，Modal 默认是关闭的（open=false）
 * - 隐藏内容会被渲染到 HTML 源代码中
 * - SEO 爬虫可以读取到这些内容
 * - 用户在浏览器中查看源代码时也能看到
 */

"use client";

import * as React from "react";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

export type ModalType = "dialog" | "drawer";
export type DrawerDirection = "top" | "bottom" | "left" | "right";

/** 模态框配置接口 */
export interface ModalOpenConfig {
  /** 弹窗标题（可选，如果没有提供会使用隐藏的标题以满足可访问性要求） */
  title?: string;
  /** 弹窗内容渲染函数，接收 close 函数作为参数 */
  content: (close: () => void) => React.ReactNode;
  /** 弹窗类型：dialog（对话框）或 drawer（抽屉），默认为 dialog */
  type?: ModalType;
  /** Drawer 的展开方向（仅当 type="drawer" 时有效） */
  direction?: DrawerDirection;
  /** 传给 DialogContent/DrawerContent 的 className，用于自定义整体样式 */
  contentClassName?: string;
  /** 对话框宽度（如 '800px', '50%' 等） */
  width?: string;
  /** 对话框背景色 */
  backgroundColor?: string;
  /** 对话框背景图片 */
  backgroundImage?: string;
  /** 是否显示关闭按钮（Dialog 默认 true，Drawer 默认 false） */
  showCloseButton?: boolean;
  /** 关闭按钮的自定义 className */
  closeButtonClassName?: string;
  /** 自定义关闭按钮渲染函数，接收 close 函数作为参数 */
  renderCloseButton?: (close: () => void) => React.ReactNode;
  /** 控制点击对话框外部（幕布）是否关闭对话框，默认为 true */
  dismissOnOutsideClick?: boolean;
  /** 关闭时的回调 */
  onClose?: () => void;
}

/** 模态框实例接口 */
export interface ModalInstance {
  /** 关闭模态框 */
  close: () => void;
  /** 当前是否打开 */
  isOpen: boolean;
}

/**
 * 构建模态框样式
 */
function useModalStyle(
  width?: string,
  backgroundColor?: string,
  backgroundImage?: string
) {
  return useMemo(() => {
    const style: React.CSSProperties = {};
    if (width) {
      style.width = width;
      style.maxWidth = width;
    }
    if (backgroundColor) {
      style.backgroundColor = backgroundColor;
    }
    if (backgroundImage) {
      style.backgroundImage = `url(${backgroundImage})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundRepeat = "no-repeat";
    }
    return style;
  }, [width, backgroundColor, backgroundImage]);
}

/**
 * 公共模态框组件（支持 SSR 和客户端渲染）
 * 可以作为标准 React 组件使用，也可以在服务端渲染
 */
export interface CommonModalComponentProps
  extends Omit<ModalOpenConfig, "content" | "onClose"> {
  /** 是否打开 */
  open: boolean;
  /** 打开/关闭状态变化回调 */
  onOpenChange: (open: boolean) => void;
  /** 弹窗内容 */
  children: React.ReactNode;
}

/**
 * 公共模态框组件
 *
 * @example
 * ```tsx
 * // 在服务端或客户端组件中使用
 * function MyComponent() {
 *   const [open, setOpen] = useState(false);
 *   return (
 *     <CommonModalComponent
 *       open={open}
 *       onOpenChange={setOpen}
 *       title="编辑"
 *       width="800px"
 *     >
 *       <EditForm />
 *     </CommonModalComponent>
 *   );
 * }
 * ```
 */
export function CommonModalComponent({
  open,
  onOpenChange,
  children,
  type = "dialog",
  direction = "bottom",
  title,
  width,
  contentClassName,
  backgroundColor,
  backgroundImage,
  showCloseButton,
  closeButtonClassName,
  renderCloseButton,
  dismissOnOutsideClick = true,
}: CommonModalComponentProps) {
  // ========== 步骤 1: 构建样式对象 ==========
  const style = useModalStyle(width, backgroundColor, backgroundImage);

  // ========== 步骤 2: 计算派生值 ==========
  const shouldShowCloseButton = useMemo(
    () => showCloseButton ?? (type === "dialog" ? true : false),
    [showCloseButton, type]
  );

  // ========== 步骤 3: 处理交互事件 ==========
  const handleInteractOutside = useCallback(
    (e: Event) => {
      if (!dismissOnOutsideClick) {
        e.preventDefault();
      }
    },
    [dismissOnOutsideClick]
  );

  // ========== 步骤 4: 处理状态变化 ==========
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      onOpenChange(newOpen);
    },
    [onOpenChange]
  );

  // ========== 步骤 5: 缓存隐藏内容（用于 SEO） ==========
  // Dialog 和 Drawer 共享的隐藏内容（用于 SEO）
  const hiddenContent = useMemo(
    () => (
      <div className="sr-only" aria-hidden="true">
        {title && <h2>{title}</h2>}
        {children}
      </div>
    ),
    [title, children]
  );

  // Drawer 内容
  const drawerContent = useMemo(
    () => (
      <div className="px-4 pb-4">
        {title && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}
        {children}
      </div>
    ),
    [title, children]
  );

  // ========== 步骤 6: 渲染 Dialog ==========
  if (type === "dialog") {
    return (
      <>
        {/* 
          优化方案：通过条件渲染确保任何时候只有一份内容
          - 当 Dialog 关闭时：在页面中渲染隐藏内容（供 SEO 读取，服务端渲染时也能在源代码中找到）
          - 当 Dialog 打开时：只在 Dialog 中渲染内容，不渲染隐藏副本
          这样避免了 SEO 读取到重复内容的问题
        */}
        {!open && hiddenContent}
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent
            className={contentClassName}
            style={style}
            showCloseButton={shouldShowCloseButton}
            closeButtonClassName={closeButtonClassName}
            renderCloseButton={renderCloseButton}
            onInteractOutside={handleInteractOutside}
          >
            {/* 
              Radix UI Dialog 要求必须直接提供 DialogTitle 和 DialogDescription
              不能通过 useMemo 包装，否则无法正确检测
            */}
            {title ? (
              <DialogTitle>{title}</DialogTitle>
            ) : (
              <DialogTitle className="sr-only">Dialog</DialogTitle>
            )}
            <DialogDescription className="sr-only">
              {title ? `对话框内容：${title}` : "对话框内容"}
            </DialogDescription>
            {children}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ========== 步骤 7: 渲染 Drawer ==========
  return (
    <>
      {/* 
        优化方案：Drawer 同样支持 SSR 和 SEO
        - 当 Drawer 关闭时：在页面中渲染隐藏内容（供 SEO 读取，服务端渲染时也能在源代码中找到）
        - 当 Drawer 打开时：只在 Drawer 中渲染内容，不渲染隐藏副本
      */}
      {!open && hiddenContent}
      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        direction={direction}
        dismissible={dismissOnOutsideClick}
      >
        <DrawerContent
          className={contentClassName}
          style={style}
          showCloseButton={shouldShowCloseButton}
          closeButtonClassName={closeButtonClassName}
          renderCloseButton={renderCloseButton}
        >
          {/* 
            vaul Drawer 基于 Radix UI Dialog，也需要 DrawerTitle 和 DrawerDescription
            以满足可访问性要求
          */}
          {title ? (
            <DrawerTitle>{title}</DrawerTitle>
          ) : (
            <DrawerTitle className="sr-only">Drawer</DrawerTitle>
          )}
          <DrawerDescription className="sr-only">
            {title ? `抽屉内容：${title}` : "抽屉内容"}
          </DrawerDescription>
          {drawerContent}
        </DrawerContent>
      </Drawer>
    </>
  );
}

/**
 * 内部 Modal 组件（用于函数式调用）
 * 不对外暴露，仅由 CommonModal 函数内部使用
 */
function ModalComponent({
  config,
  onClose,
  closeRequestRef,
}: {
  config: ModalOpenConfig;
  onClose: () => void;
  closeRequestRef: React.MutableRefObject<(() => void) | null>;
}) {
  const {
    type,
    direction,
    title,
    width,
    contentClassName,
    backgroundColor,
    backgroundImage,
    showCloseButton,
    closeButtonClassName,
    renderCloseButton,
    dismissOnOutsideClick,
    content,
  } = config;

  // ========== 步骤 1: 管理打开/关闭状态 ==========
  const [isOpen, setIsOpen] = useState(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 暴露关闭请求函数给外部
  useEffect(() => {
    const requestClose = () => {
      setIsOpen(false);
    };

    closeRequestRef.current = requestClose;

    return () => {
      closeRequestRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听 isOpen 状态变化，当关闭时延迟调用 onClose
  useEffect(() => {
    if (!isOpen) {
      // 等待动画完成后再调用 onClose
      closeTimeoutRef.current = setTimeout(() => {
        onClose();
      }, 200); // 与 CommonModal 中的延迟时间一致

      return () => {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
      };
    }
  }, [isOpen, onClose]);

  // ========== 步骤 2: 处理状态变化 ==========
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setIsOpen(false);
    }
  }, []);

  // ========== 步骤 3: 创建关闭函数 ==========
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // ========== 步骤 4: 使用公共组件渲染 ==========
  return (
    <CommonModalComponent
      open={isOpen}
      onOpenChange={handleOpenChange}
      type={type}
      direction={direction}
      title={title}
      width={width}
      contentClassName={contentClassName}
      backgroundColor={backgroundColor}
      backgroundImage={backgroundImage}
      showCloseButton={showCloseButton}
      closeButtonClassName={closeButtonClassName}
      renderCloseButton={renderCloseButton}
      dismissOnOutsideClick={dismissOnOutsideClick}
    >
      {content(handleClose)}
    </CommonModalComponent>
  );
}

/**
 * 通用弹窗函数：直接调用即可显示模态框（客户端动态创建）
 *
 * 功能：
 * - 支持 Dialog 和 Drawer 两种类型
 * - 支持自定义背景色、背景图片
 * - 支持自定义关闭按钮样式
 * - 控制点击外部是否关闭
 * - 支持 SSR（服务端渲染时返回空实例，客户端正常使用）
 *
 * @example
 * ```tsx
 * // 客户端动态调用方式
 * const handleOpen = () => {
 *   const modal = CommonModal({
 *     title: '编辑',
 *     width: '800px',
 *     content: (close) => (
 *       <EditForm onClose={close} />
 *     )
 *   });
 *   // modal 立即显示
 *   // 可以调用 modal.close() 关闭
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 服务端和客户端都支持的组件方式（推荐）
 * function MyComponent() {
 *   const [open, setOpen] = useState(false);
 *   return (
 *     <>
 *       <button onClick={() => setOpen(true)}>打开</button>
 *       <CommonModalComponent
 *         open={open}
 *         onOpenChange={setOpen}
 *         title="编辑"
 *         width="800px"
 *       >
 *         <EditForm onClose={() => setOpen(false)} />
 *       </CommonModalComponent>
 *     </>
 *   );
 * }
 * ```
 */
export function CommonModal(config: ModalOpenConfig): ModalInstance {
  // ========== 步骤 1: 服务端渲染检查 ==========
  if (typeof window === "undefined") {
    return {
      close: () => {},
      isOpen: false,
    };
  }

  // ========== 步骤 2: 初始化状态 ==========
  let isOpen = true;
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  const closeRequestRef: React.MutableRefObject<(() => void) | null> = {
    current: null,
  };

  // ========== 步骤 3: 定义关闭函数 ==========
  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    config.onClose?.();

    // 先触发关闭动画
    if (closeRequestRef.current) {
      closeRequestRef.current();
    } else {
      // 如果没有 ref，直接清理（降级处理）
      setTimeout(() => {
        if (container && root) {
          root.unmount();
          container.remove();
          container = null;
          root = null;
        }
      }, 200);
    }
  };

  // ========== 步骤 4: 定义清理函数 ==========
  const cleanup = () => {
    if (container && root) {
      root.unmount();
      container.remove();
      container = null;
      root = null;
    }
  };

  // ========== 步骤 5: 创建容器并渲染 ==========
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  // 创建独立的 QueryClient 实例（用于模态框，因为它在独立的 React 根节点中）
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 0,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });

  root.render(
    <QueryClientProvider client={queryClient}>
      <ModalComponent
        config={config}
        onClose={cleanup}
        closeRequestRef={closeRequestRef}
      />
    </QueryClientProvider>
  );

  // ========== 步骤 6: 返回实例 ==========
  return {
    close,
    isOpen: true,
  };
}
