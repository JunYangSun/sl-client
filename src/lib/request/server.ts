/**
 * 服务端请求
 * - 手动传 cookie
 * - 支持 Next.js cache / revalidate
 * - 可以 redirect
 * - 注意：不能在 Server Component 中设置 cookies（只能在 Server Action/Route Handler 中）
 */

import type { ApiResponse, RequestOptions } from "./types";
import { parseResponse } from "./core";

/**
 * 服务端 API 配置
 * 服务端不需要代理，直接请求后端地址
 */
const SERVER_API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 30000,
};

/**
 * 获取服务端 Token（从 Next.js cookies）
 * 这是一个可选的辅助函数，如果不需要可以手动传 token
 */
async function getServerToken(): Promise<string | null> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value || null;
  } catch {
    return null;
  }
}

/**
 * 服务端核心请求函数
 * 支持手动传 token，支持 Next.js cache/revalidate
 */
async function serverRequest<T>(
  url: string,
  options: RequestOptions & { token?: string } = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    headers = {},
    searchParams,
    body,
    timeout = SERVER_API_CONFIG.timeout,
    token,
    next,
    cache,
  } = options;

  // 拼接 URL（服务端直接使用后端地址）
  const fullURL = new URL(url, SERVER_API_CONFIG.baseURL);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      fullURL.searchParams.append(key, String(value));
    });
  }

  // 构建请求头
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // 自动获取 token 或使用手动传入的 token
  const authToken = token !== undefined ? token : await getServerToken();
  if (authToken) {
    requestHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  // 构建 fetch 选项
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // 添加 body（仅非 GET 请求）
  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  // Next.js 缓存配置
  if (next) {
    fetchOptions.next = next;
  } else if (cache) {
    fetchOptions.cache = cache;
  } else {
    // 默认不缓存（适合需要认证的动态数据）
    // 如果需要缓存，请显式传入 next 或 cache 选项
    fetchOptions.cache = "no-store";
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
    // 处理超时错误
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("请求超时，请稍后重试");
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
  } & Omit<RequestOptions, "method" | "searchParams" | "body"> & { token?: string }
): Promise<ApiResponse<T>> {
  return serverRequest<T>(url, {
    method,
    searchParams: options?.searchParams,
    body: options?.body,
    ...options,
  });
}

/**
 * GET 请求
 *
 * @example
 * // 自动获取 token，不缓存
 * const res = await get<User>('/user/profile');
 *
 * @example
 * // 手动传 token，缓存 60 秒
 * const res = await get<User>('/user/profile', undefined, {
 *   token: 'custom-token',
 *   next: { revalidate: 60 }
 * });
 */
export async function get<T>(
  url: string,
  searchParams?: Record<string, string | number | boolean>,
  options?: Omit<RequestOptions, "method" | "searchParams"> & { token?: string }
): Promise<ApiResponse<T>> {
  return serverRequest<T>(url, {
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
  options?: Omit<RequestOptions, "method" | "body"> & { token?: string }
): Promise<ApiResponse<T>> {
  return serverRequest<T>(url, {
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
  options?: Omit<RequestOptions, "method" | "body"> & { token?: string }
): Promise<ApiResponse<T>> {
  return serverRequest<T>(url, {
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
  options?: Omit<RequestOptions, "method"> & { token?: string }
): Promise<ApiResponse<T>> {
  return serverRequest<T>(url, {
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
  options?: Omit<RequestOptions, "method" | "body"> & { token?: string }
): Promise<ApiResponse<T>> {
  return serverRequest<T>(url, {
    method: "PATCH",
    body,
    ...options,
  });
}
