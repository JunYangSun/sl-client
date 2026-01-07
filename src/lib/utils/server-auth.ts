/**
 * 服务器端工具函数
 * 用于在 Server Components、API Routes 中获取认证信息
 */

import { cookies } from "next/headers";

/**
 * 从 cookies 中获取 JWT Token（服务器端）
 *
 * @example
 * // 在 Server Component 中
 * const token = await getServerToken();
 * const userData = await serverGet('/api/user', { token });
 */
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value || null;
}

/**
 * 服务器端设置 Token 到 Cookie
 * （通常在登录接口的 API Route 中使用）
 *
 * @example
 * // 在 API Route 中
 * export async function POST(request: Request) {
 *   const { username, password } = await request.json();
 *   const { token } = await loginApi(username, password);
 *
 *   await setServerToken(token);
 *   return Response.json({ success: true });
 * }
 */
export async function setServerToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true, // 防止 XSS 攻击
    secure: process.env.NODE_ENV === "production", // 生产环境使用 HTTPS
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7天
    path: "/",
  });
}

/**
 * 服务器端清除 Token
 *
 * @example
 * // 在登出的 API Route 中
 * export async function POST() {
 *   await clearServerToken();
 *   return Response.json({ success: true });
 * }
 */
export async function clearServerToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
