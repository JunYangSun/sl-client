"use client";

import { useEffect } from "react";
import { toast } from "@/lib/utils/toast";

interface ServerErrorToastProps {
  error: string | null;
}

/**
 * 服务器端错误 Toast 组件
 * 用于在 Server Component 中捕获的错误显示为 Toast
 */
export function ServerErrorToast({ error }: ServerErrorToastProps) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return null; // 不渲染任何 UI
}
