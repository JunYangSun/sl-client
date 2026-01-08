"use client";

import { useState, useCallback } from "react";
import { post, get, put, del, patch, type ApiResponse } from "@/lib/request/client";
import { setToken as saveToken } from "@/lib/request/client";

/**
 * HTTP 请求方法类型
 */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * useHttp Hook 配置
 */
export interface UseHttpConfig<TResponse, TRequest = unknown> {
  /** API 路径 */
  url: string;
  /** 请求方法 */
  method?: HttpMethod;
}

/**
 * useHttp Hook 返回值
 */
export interface UseHttpResult<TResponse, TRequest = unknown> {
  /** 提交请求 */
  submit: (data?: TRequest) => Promise<TResponse>;
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 响应数据 */
  data: TResponse | null;
}

/**
 * HTTP 请求 Hook
 * 
 * 封装 HTTP 请求，提供 loading 状态和错误处理
 * 
 * @example
 * ```tsx
 * const loginMutation = useHttp<LoginResponse, LoginRequest>({
 *   url: "login",
 *   method: "POST",
 * });
 * 
 * const handleLogin = async () => {
 *   const result = await loginMutation.submit({
 *     username: "user",
 *     password: "pass",
 *   });
 * };
 * ```
 */
export function useHttp<TResponse, TRequest = unknown>(
  config: UseHttpConfig<TResponse, TRequest>
): UseHttpResult<TResponse, TRequest> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  const { url, method = "POST" } = config;

  const submit = useCallback(
    async (requestData?: TRequest): Promise<TResponse> => {
      setLoading(true);
      setError(null);

      try {
        let response: ApiResponse<TResponse>;

        switch (method) {
          case "GET":
            response = await get<TResponse>(url, requestData as Record<string, string | number | boolean>);
            break;
          case "POST":
            response = await post<TResponse>(url, requestData);
            break;
          case "PUT":
            response = await put<TResponse>(url, requestData);
            break;
          case "DELETE":
            response = await del<TResponse>(url);
            break;
          case "PATCH":
            response = await patch<TResponse>(url, requestData);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        // 检查业务状态码
        if (response.code !== 200) {
          throw new Error(response.message || "请求失败");
        }

        setData(response.data);
        return response.data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("请求失败");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return {
    submit,
    loading,
    error,
    data,
  };
}

/**
 * 导出 setToken（从 request/client 重新导出）
 */
export { saveToken as setToken };

