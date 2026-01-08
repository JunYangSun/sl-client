"use client";

import * as React from "react";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

export type ModalType = "dialog" | "drawer";
export type DrawerDirection = "top" | "bottom" | "left" | "right";

export interface ModalOpenConfig {
  title?: string;
  content: (close: () => void) => React.ReactNode;
  type?: ModalType;
  direction?: DrawerDirection;
  contentClassName?: string;
  width?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  showCloseButton?: boolean;
  closeButtonClassName?: string;
  renderCloseButton?: (close: () => void) => React.ReactNode;
  dismissOnOutsideClick?: boolean;
  onClose?: () => void;
}

export interface ModalInstance {
  close: () => void;
  isOpen: boolean;
}

// ===== 样式钩子 =====
function useModalStyle(width?: string, backgroundColor?: string, backgroundImage?: string) {
  return useMemo(() => {
    const style: React.CSSProperties = {};
    if (width) style.width = style.maxWidth = width;
    if (backgroundColor) style.backgroundColor = backgroundColor;
    if (backgroundImage) {
      style.backgroundImage = `url(${backgroundImage})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundRepeat = "no-repeat";
    }
    return style;
  }, [width, backgroundColor, backgroundImage]);
}

// ===== 公共模态框组件 =====
export interface CommonModalComponentProps
  extends Omit<ModalOpenConfig, "content" | "onClose"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

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
  const style = useModalStyle(width, backgroundColor, backgroundImage);
  const shouldShowCloseButton = showCloseButton ?? (type === "dialog");

  const handleOpenChange = useCallback((newOpen: boolean) => {
    onOpenChange(newOpen);
  }, [onOpenChange]);

  const hiddenContent = useMemo(() => (
    <div className="sr-only" aria-hidden="true">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  ), [title, children]);

  const drawerContent = useMemo(() => (
    <div className="px-4 pb-4">
      {title && <div className="mb-4"><h2 className="text-lg font-semibold">{title}</h2></div>}
      {children}
    </div>
  ), [title, children]);

  if (type === "dialog") {
    return (
      <>
        {!open && hiddenContent}
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent
            className={contentClassName}
            style={style}
            showCloseButton={shouldShowCloseButton}
            closeButtonClassName={closeButtonClassName}
            renderCloseButton={renderCloseButton}
            onInteractOutside={(e) => {
              if (!dismissOnOutsideClick) e.preventDefault();
            }}
          >
            {title ? <DialogTitle>{title}</DialogTitle> : <DialogTitle className="sr-only">Dialog</DialogTitle>}
            <DialogDescription className="sr-only">{title ? `对话框内容：${title}` : "对话框内容"}</DialogDescription>
            {children}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
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
          {title ? <DrawerTitle>{title}</DrawerTitle> : <DrawerTitle className="sr-only">Drawer</DrawerTitle>}
          <DrawerDescription className="sr-only">{title ? `抽屉内容：${title}` : "抽屉内容"}</DrawerDescription>
          {drawerContent}
        </DrawerContent>
      </Drawer>
    </>
  );
}

// ===== 内部 Modal 组件 =====
function ModalComponent({
  config,
  onClose,
  closeRequestRef,
}: {
  config: ModalOpenConfig;
  onClose: () => void;
  closeRequestRef: React.MutableRefObject<(() => void) | null>;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    closeRequestRef.current = () => setIsOpen(false);
    return () => { closeRequestRef.current = null; };
  }, [closeRequestRef]);

  useEffect(() => {
    if (!isOpen) {
      closeTimeoutRef.current = setTimeout(() => {
        onClose();
      }, 200);
      return () => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); };
    }
  }, [isOpen, onClose]);

  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleOpenChange = useCallback((open: boolean) => { if (!open) setIsOpen(false); }, []);

  return (
    <CommonModalComponent
      open={isOpen}
      onOpenChange={handleOpenChange}
      type={config.type}
      direction={config.direction}
      title={config.title}
      width={config.width}
      contentClassName={config.contentClassName}
      backgroundColor={config.backgroundColor}
      backgroundImage={config.backgroundImage}
      showCloseButton={config.showCloseButton}
      closeButtonClassName={config.closeButtonClassName}
      renderCloseButton={config.renderCloseButton}
      dismissOnOutsideClick={config.dismissOnOutsideClick}
    >
      {config.content(handleClose)}
    </CommonModalComponent>
  );
}

// ===== 通用模态框函数 =====
export function CommonModal(config: ModalOpenConfig): ModalInstance {
  if (typeof window === "undefined") {
    return { close: () => {}, isOpen: false };
  }

  let isOpen = true;
  let container: HTMLDivElement | null = document.createElement("div");
  document.body.appendChild(container);
  let root: Root | null = createRoot(container);
  const closeRequestRef: React.MutableRefObject<(() => void) | null> = { current: null };

  const cleanup = () => {
    if (root && container) {
      root.unmount();
      container.remove();
      root = null;
      container = null;
    }
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    config.onClose?.();
    if (closeRequestRef.current) closeRequestRef.current();
    else cleanup();
  };

  root.render(
    <ModalComponent config={config} onClose={cleanup} closeRequestRef={closeRequestRef} />
  );

  return { close, isOpen: true };
}
