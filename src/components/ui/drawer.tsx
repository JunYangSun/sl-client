"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Drawer 基于 Dialog，但样式不同
function Drawer({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
  direction?: "top" | "bottom" | "left" | "right";
  dismissible?: boolean;
}) {
  return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerContent({
  className,
  children,
  showCloseButton = false,
  direction = "bottom",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
  direction?: "top" | "bottom" | "left" | "right";
}) {
  const directionClasses = {
    top: "top-0 left-0 right-0 translate-y-[-100%]",
    bottom: "bottom-0 left-0 right-0 translate-y-[100%]",
    left: "left-0 top-0 bottom-0 translate-x-[-100%]",
    right: "right-0 top-0 bottom-0 translate-x-[100%]",
  };

  return (
    <DialogPrimitive.Portal data-slot="drawer-portal">
      <DialogPrimitive.Overlay
        data-slot="drawer-overlay"
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
          className
        )}
      />
      <DialogPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed z-50 flex flex-col gap-4 border shadow-lg duration-200 outline-none",
          directionClasses[direction],
          direction === "top" || direction === "bottom" ? "w-full rounded-t-lg p-4" : "h-full w-80 rounded-l-lg p-4",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="drawer-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export { Drawer, DrawerContent, DrawerTitle, DrawerDescription };

