/**
 * 客户端请求
 * - 自动带 cookie
 * - 401 → 跳登录页
 * - 自动显示错误 Toast
 */

import type { ApiResponse, RequestOptions } from "./types";
import { buildURL, parseResponse, API_CONFIG } from "./core";
import { toast } from "@/lib/utils/toast";

/**
 * Token 配置
 */
const TOKEN_KEY = "auth_token";

/**
 * Cookie 工具函数
 */
const CookieUtils = {
  /**
   * 设置 Cookie
   */
  set(name: string, value: string, days?: number): void {
    if (typeof window === "undefined") return;

    let cookieString = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;

    if (days) {
      const maxAge = Math.floor(days * 24 * 60 * 60);
      cookieString += `; max-age=${maxAge}`;

      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    document.cookie = cookieString;
  },

  /**
   * 获取 Cookie
   */
  get(name: string): string | null {
    if (typeof window === "undefined") return null;

    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
      }
    }
    return null;
  },

  /**
   * 删除 Cookie
   */
  remove(name: string): void {
    if (typeof window === "undefined") return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=0`;
  },
};

/**
 * 获取存储的 JWT Token
 */
export function getToken(): string | null {
  return CookieUtils.get(TOKEN_KEY);
}

/**
 * 存储 JWT Token（登录成功后调用）
 * @param token JWT Token
 * @param expiresInMinutes 过期时间（分钟），默认 12 小时
 */
export function setToken(token: string, expiresInMinutes = 720): void {
  if (typeof window === "undefined") {
    console.warn("⚠️ setToken: 在服务端环境中无法设置 Cookie");
    return;
  }

  const days = expiresInMinutes / (24 * 60);
  CookieUtils.set(TOKEN_KEY, token, days);
}

/**
 * 清除 JWT Token（登出时调用）
 */
export function clearToken(): void {
  CookieUtils.remove(TOKEN_KEY);
}

/**
 * 客户端核心请求函数
 * 自动添加 token，处理 401 错误
 */
async function clientRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    headers = {},
    searchParams,
    body,
    timeout = API_CONFIG.timeout,
    skipAuthRedirect = false,
    showErrorToast = true, // 默认自动显示错误 Toast
  } = options;

  // 拼接 URL
  const fullURL = buildURL(url, searchParams);

  // 自动添加 token
  const token = getToken();
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // 构建 fetch 选项
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: "include", // 自动带 cookie
  };

  // 添加 body（仅非 GET 请求）
  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  // 超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  fetchOptions.signal = controller.signal;

  try {
    const response = await fetch(fullURL, fetchOptions);

    // 解析数据
    const result = await parseResponse<T>(response);

    return result;
  } catch (error) {
    // 处理 401 错误
    if (error instanceof Error) {
      const apiError = error as { code?: number };
      if (apiError.code === 401) {
        clearToken();
        if (!skipAuthRedirect && typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      // 处理超时
      if (error.name === "AbortError") {
        const timeoutError = new Error("请求超时，请稍后重试");
        if (showErrorToast) {
          toast.error(timeoutError.message);
        }
        throw timeoutError;
      }

      // 自动显示错误 Toast
      if (showErrorToast) {
        toast.error(error.message || "请求失败，请稍后重试");
      }
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 通用 HTTP 请求（可自定义请求方法）
 */
export async function http<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  options?: {
    searchParams?: Record<string, string | number | boolean>;
    body?: unknown;
  } & Omit<RequestOptions, "method" | "searchParams" | "body">
): Promise<ApiResponse<T>> {
  return clientRequest<T>(url, {
    method,
    searchParams: options?.searchParams,
    body: options?.body,
    ...options,
  });
}

/**
 * GET 请求
 */
export async function get<T>(
  url: string,
  searchParams?: Record<string, string | number | boolean>,
  options?: Omit<RequestOptions, "method" | "searchParams">
): Promise<ApiResponse<T>> {
  return clientRequest<T>(url, {
    method: "GET",
    searchParams,
    ...options,
  });
}

/**
 * POST 请求
 */
export async function post<T>(
  url: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResponse<T>> {
  return clientRequest<T>(url, {
    method: "POST",
    body,
    ...options,
  });
}

/**
 * PUT 请求
 */
export async function put<T>(
  url: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResponse<T>> {
  return clientRequest<T>(url, {
    method: "PUT",
    body,
    ...options,
  });
}

/**
 * DELETE 请求
 */
export async function del<T>(
  url: string,
  options?: Omit<RequestOptions, "method">
): Promise<ApiResponse<T>> {
  return clientRequest<T>(url, {
    method: "DELETE",
    ...options,
  });
}

/**
 * PATCH 请求
 */
export async function patch<T>(
  url: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">
): Promise<ApiResponse<T>> {
  return clientRequest<T>(url, {
    method: "PATCH",
    body,
    ...options,
  });
}
