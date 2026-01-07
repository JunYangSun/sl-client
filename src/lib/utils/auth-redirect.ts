/**
 * 认证重定向工具函数
 * 用于处理登录后的跳转逻辑
 */

/**
 * 从 URL 查询参数中获取回调地址
 */
export function getCallbackUrl(searchParams?: URLSearchParams | string): string | null {
  if (!searchParams) return null;

  const params = typeof searchParams === 'string'
    ? new URLSearchParams(searchParams)
    : searchParams;

  return params.get('callbackUrl');
}

/**
 * 获取登录后应该跳转的 URL
 * @param callbackUrl 回调地址（来自 URL 参数）
 * @param defaultUrl 默认跳转地址，默认为首页
 * @returns 跳转地址
 */
export function getRedirectUrl(callbackUrl?: string | null, defaultUrl: string = '/'): string {
  // 如果没有 callbackUrl，使用默认地址
  if (!callbackUrl) return defaultUrl;

  // 安全检查：只允许相对路径，防止开放重定向漏洞
  if (callbackUrl.startsWith('http://') || callbackUrl.startsWith('https://')) {
    console.warn('不允许跳转到外部 URL，使用默认地址');
    return defaultUrl;
  }

  // 确保 URL 以 / 开头
  return callbackUrl.startsWith('/') ? callbackUrl : `/${callbackUrl}`;
}

/**
 * 检查错误是否为 401 未授权
 */
export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('401') ||
           error.message.includes('未授权') ||
           error.message.includes('Unauthorized');
  }
  return false;
}
