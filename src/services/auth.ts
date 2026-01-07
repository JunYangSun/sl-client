/**
 * 认证相关接口
 * 使用原生 fetch 封装的 API 函数
 */
import { get, post, setToken as saveToken, clearToken as removeToken } from '@/lib/request/client'
import type { RequestOptions } from '@/lib/request/types'

/**
 * 验证码响应
 */
export interface CaptchaResponse {
	uuid: string
	img: string
	captchaEnabled?: boolean
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
	username: string
	password: string
	code: string
	uuid: string
}

/**
 * 登录响应
 */
export interface LoginResponse {
	access_token: string
	expires_in: number
	userInfo?: UserInfo
}

/**
 * 用户信息
 */
export interface UserInfo {
	id?: string
	username?: string
	email?: string
	avatar?: string
	roles?: string[]
}

/**
 * 获取验证码
 *
 * @example
 * const captcha = await getCaptcha();
 * // captcha 直接是验证码数据，不需要 .data
 */
export async function getCaptcha(options?: Omit<RequestOptions, 'method' | 'searchParams'>) {
	const response = await get<CaptchaResponse>('/code', undefined, options)
	return response.data  // 直接返回数据，而不是完整响应
}

/**
 * 登录
 *
 * @example
 * const response = await login({ username, password, code, uuid });
 * const { access_token, expires_in } = response.data;
 * // Token 需要手动保存
 * setTokenWithExpiry(access_token, expires_in);
 */
export async function login(data: LoginRequest, options?: Omit<RequestOptions, 'method' | 'body'>) {
	return post<LoginResponse>('/auth/login', data, options)
}

/**
 * 登录并自动保存 token
 *
 * @example
 * const response = await loginAndSaveToken({ username, password, code, uuid });
 * // Token 已自动保存，可以直接跳转
 */
export async function loginAndSaveToken(data: LoginRequest, options?: Omit<RequestOptions, 'method' | 'body'>) {
	const response = await login(data, options)
	saveToken(response.data.access_token, response.data.expires_in)
	return response
}

/**
 * 登出
 *
 * @example
 * await logout();
 * // Token 已自动清除
 */
export async function logout() {
	try {
		await post<void>('/auth/logout')
	} finally {
		// 无论成功失败，都清除本地 token
		removeToken()
	}
}

/**
 * 获取用户信息
 *
 * @example
 * const response = await getUserInfo();
 * const userInfo = response.data;
 */
export async function getUserInfo() {
	return get<UserInfo>('/user/info')
}

/**
 * 更新用户信息
 *
 * @example
 * const response = await updateUserInfo({ email: 'new@example.com' });
 */
export async function updateUserInfo(data: Partial<UserInfo>) {
	return post<UserInfo>('/user/info', data)
}

/**
 * 修改密码
 *
 * @example
 * await changePassword({ oldPassword: '123456', newPassword: '654321' });
 */
export async function changePassword(data: { oldPassword: string; newPassword: string }) {
	return post<void>('/user/password', data)
}

/**
 * 重置密码（忘记密码）
 *
 * @example
 * await resetPassword({ email: 'user@example.com', code: '123456', newPassword: '654321' });
 */
export async function resetPassword(data: { email: string; code: string; newPassword: string }) {
	return post<void>('/auth/reset-password', data)
}

// 导出 token 工具函数
export { saveToken as setTokenWithExpiry, removeToken as clearToken }
