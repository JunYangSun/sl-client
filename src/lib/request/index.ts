/**
 * 请求库统一导出
 *
 * 使用示例：
 *
 * // 客户端（组件中）
 * import { get, post, getToken, setToken, clearToken } from '@/lib/request/client'
 *
 * // 服务端（Server Component、API Route）
 * import { get, post } from '@/lib/request/server'
 *
 * // 类型
 * import type { ApiResponse, PageResponse } from '@/lib/request'
 */

// 类型导出
export type {
  ApiResponse,
  PageResponse,
  LoginRequest,
  LoginResponse,
  UserInfo,
  RequestOptions,
} from "./types";

export { ApiError } from "./types";

// 核心功能（一般不直接使用，除非需要自定义）
export { buildURL, parseResponse, request, API_CONFIG } from "./core";

// 客户端导出（建议从 './client' 导入）
export * as client from "./client";

// 服务端导出（建议从 './server' 导入）
export * as server from "./server";
