"use client"

import { Toaster } from "sonner"
import { useEffect } from "react"
import { showToastFromCookie } from "@/lib/utils/toast"

/**
 * 全局 Toast Provider
 *
 * 功能：
 * 1. 渲染 Sonner Toaster 组件
 * 2. 监听服务端通过 cookies 传递的 toast 消息
 * 3. 自动显示 toast 并清除 cookie
 *
 * 使用：在 layout.tsx 中添加此组件
 */
export function ToastProvider() {
  useEffect(() => {
    // 页面加载时检查是否有服务端设置的 toast
    showToastFromCookie()

    // 使用 MutationObserver 监听 DOM 变化（简单的路由变化检测）
    const observer = new MutationObserver(() => {
      showToastFromCookie()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Toaster
      position="top-center"
      richColors
      expand={false}
      duration={3000}
      closeButton
    />
  )
}
