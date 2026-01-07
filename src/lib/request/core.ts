/**
 * 请求核心功能
 * - 拼接 URL
 * - 统一错误处理
 * - 解析数据
 */

import type { ApiResponse, ApiError, RequestOptions } from "./types";

/**
 * API 配置
 */
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_PREFIX || "",
  timeout: 30000,
};

/**
 * 1. 拼接 URL
 * 将相对路径和查询参数拼接成完整 URL
 */
export function buildURL(
  url: string,
  searchParams?: Record<string, string | number | boolean>
): string {
  // 处理 baseURL
  let baseURL = API_CONFIG.baseURL;

  // 如果 baseURL 是相对路径（如 /api），在客户端环境下需要加上当前域名
  if (baseURL.startsWith('/') && typeof window !== 'undefined') {
    baseURL = window.location.origin + baseURL;
    // 确保 baseURL 以 / 结尾，否则 new URL() 会替换掉最后一段
    if (!baseURL.endsWith('/')) {
      baseURL += '/';
    }
  }

  // 如果 baseURL 为空或者是相对路径（服务端），直接拼接
  if (!baseURL || (baseURL.startsWith('/') && typeof window === 'undefined')) {
    // 简单拼接
    const separator = baseURL.endsWith('/') || url.startsWith('/') ? '' : '/';
    let fullPath = baseURL + separator + url;

    // 添加查询参数
    if (searchParams) {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      const queryString = params.toString();
      fullPath += queryString ? `?${queryString}` : '';
    }

    return fullPath;
  }

  // 如果 url 以 / 开头，需要去掉开头的 /，否则会被视为绝对路径，替换掉 baseURL 的路径部分
  const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;
  const fullURL = new URL(normalizedUrl, baseURL);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      fullURL.searchParams.append(key, String(value));
    });
  }

  return fullURL.toString();
}

/**
 * 2. 统一错误处理
 * 处理 HTTP 错误和业务错误
 */
export function handleError(error: unknown): never {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(String(error));
}

/**
 * 3. 解析响应数据
 * 解析 Java 后端统一响应格式，处理业务错误码
 */
export async function parseResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  // 检查 HTTP 状态码
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  // 检查是否为 JSON 响应
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("响应不是 JSON 格式");
  }

  // 解析 JSON
  const data = (await response.json()) as ApiResponse<T>;

  // 处理业务错误码（code !== 200 && code !== 0 表示失败）
  if (data.code !== 200 && data.code !== 0) {
    const error = new Error(data.message || "请求失败") as ApiError;
    error.code = data.code;
    error.data = data.data;
    throw error;
  }

  return data;
}

/**
 * 核心请求函数
 * 封装 fetch，添加超时控制
 */
export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    headers = {},
    searchParams,
    body,
    timeout = API_CONFIG.timeout,
    next,
    cache,
  } = options;

  // 1. 拼接 URL
  const fullURL = buildURL(url, searchParams);

  // 构建请求头
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  // 构建 fetch 选项
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // 添加 body（仅非 GET 请求）
  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  // Next.js 缓存配置（仅服务端）
  if (next) {
    fetchOptions.next = next;
  }

  // fetch cache 配置
  if (cache) {
    fetchOptions.cache = cache;
  }

  // 超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  fetchOptions.signal = controller.signal;

  try {
    // 发起请求
    const response = await fetch(fullURL, fetchOptions);

    // 3. 解析数据
    const result = await parseResponse<T>(response);

    return result;
  } catch (error) {
    // 2. 统一错误处理
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("请求超时");
    }
    handleError(error);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * GET 请求
 */
export async function get<T>(
  url: string,
  searchParams?: Record<string, string | number | boolean>,
  options?: Omit<RequestOptions, "method" | "searchParams">
): Promise<ApiResponse<T>> {
  return request<T>(url, {
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
  return request<T>(url, {
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
  return request<T>(url, {
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
  return request<T>(url, {
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
  return request<T>(url, {
    method: "PATCH",
    body,
    ...options,
  });
}
