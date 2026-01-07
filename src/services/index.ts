/**
 * API 服务统一导出
 * 所有业务 API 函数集中管理
 *
 * 使用示例：
 * import { getCaptcha, loginAndSaveToken } from '@/services'
 *
 * const captcha = await getCaptcha()
 * const result = await loginAndSaveToken({ username, password, code, uuid })
 */

// ========== 认证相关 ==========
export {
	getCaptcha,
	login,
	loginAndSaveToken,
	logout,
	getUserInfo,
	updateUserInfo,
	changePassword,
	resetPassword,
	setTokenWithExpiry,
	clearToken,
} from './auth'

export type {
	CaptchaResponse,
	LoginRequest,
	LoginResponse,
	UserInfo,
} from './auth'

// ========== 其他模块 ==========
// 后续可以在这里添加更多服务模块，例如：
// export { getProducts, createProduct } from './product'
// export { getOrders, createOrder } from './order'
