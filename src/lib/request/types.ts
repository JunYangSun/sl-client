/**
 * 请求相关的类型定义
 */

/**
 * 统一响应格式（Java 后端标准格式）
 */
export interface ApiResponse<T = unknown> {
  code: number;      // 业务状态码：200 成功，其他为失败
  data: T;           // 实际数据
  message: string;   // 提示信息
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
}

/**
 * 认证相关
 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  userInfo?: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  roles?: string[];
}

/**
 * API 错误类型
 */
export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 请求配置选项
 */
export interface RequestOptions {
  /** 请求方法 */
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /** 请求头 */
  headers?: Record<string, string>;
  /** 查询参数（GET 请求） */
  searchParams?: Record<string, string | number | boolean>;
  /** 请求体（POST/PUT/PATCH） */
  body?: unknown;
  /** 请求超时时间（毫秒） */
  timeout?: number;
  /** 是否跳过 401 错误时的自动跳转到登录页 */
  skipAuthRedirect?: boolean;
  /** 是否自动显示错误 Toast（默认 true） */
  showErrorToast?: boolean;
  /** Next.js 缓存配置（仅服务端） */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  /** fetch cache 配置（仅服务端） */
  cache?: RequestCache;
}
