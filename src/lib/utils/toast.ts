/**
 * 全局 Toast 工具
 * 支持服务端和客户端统一调用
 */

import { toast as clientToast } from 'sonner'

/**
 * Toast 消息类型
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning'

/**
 * Toast 消息数据结构
 */
interface ToastMessage {
  type: ToastType
  message: string
}

/**
 * Toast Cookie 名称
 */
const TOAST_COOKIE_NAME = 'app_toast'

/**
 * 服务端设置 Toast（通过 cookies）
 * 在 Server Component、Server Action、API Route 中使用
 */
export async function setServerToast(type: ToastType, message: string) {
  // 动态导入 next/headers（只在服务端使用）
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  const toastData: ToastMessage = { type, message }

  cookieStore.set(TOAST_COOKIE_NAME, JSON.stringify(toastData), {
    path: '/',
    maxAge: 5, // 5秒后过期（足够客户端读取）
    sameSite: 'lax',
  })
}

/**
 * 客户端显示 Toast
 * 在 Client Component 中使用
 */
export const toast = {
  success: (message: string) => {
    if (typeof window !== 'undefined') {
      clientToast.success(message)
    }
  },

  error: (message: string) => {
    if (typeof window !== 'undefined') {
      clientToast.error(message)
    }
  },

  info: (message: string) => {
    if (typeof window !== 'undefined') {
      clientToast.info(message)
    }
  },

  warning: (message: string) => {
    if (typeof window !== 'undefined') {
      clientToast.warning(message)
    }
  },

  // Promise 提示
  promise: clientToast.promise,
}

/**
 * 统一的 Toast API（自动判断环境）
 * 可在服务端和客户端使用
 */
export const showToast = {
  success: async (message: string) => {
    if (typeof window === 'undefined') {
      // 服务端
      await setServerToast('success', message)
    } else {
      // 客户端
      toast.success(message)
    }
  },

  error: async (message: string) => {
    if (typeof window === 'undefined') {
      // 服务端
      await setServerToast('error', message)
    } else {
      // 客户端
      toast.error(message)
    }
  },

  info: async (message: string) => {
    if (typeof window === 'undefined') {
      // 服务端
      await setServerToast('info', message)
    } else {
      // 客户端
      toast.info(message)
    }
  },

  warning: async (message: string) => {
    if (typeof window === 'undefined') {
      // 服务端
      await setServerToast('warning', message)
    } else {
      // 客户端
      toast.warning(message)
    }
  },
}

/**
 * 从 cookies 读取并显示 Toast（客户端使用）
 */
export function showToastFromCookie() {
  if (typeof window === 'undefined') return

  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${TOAST_COOKIE_NAME}=`))
    ?.split('=')[1]

  if (!cookieValue) return

  try {
    const toastData: ToastMessage = JSON.parse(decodeURIComponent(cookieValue))
    const { type, message } = toastData

    // 显示 toast
    toast[type](message)

    // 立即清除 cookie
    document.cookie = `${TOAST_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
  } catch (error) {
    console.error('Failed to parse toast cookie:', error)
  }
}
