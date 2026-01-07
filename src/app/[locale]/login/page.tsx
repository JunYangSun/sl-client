"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image  from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { getCaptcha, loginAndSaveToken, type CaptchaResponse } from "@/services/auth";
import { useAuthStore } from "@/stores/auth";
import { getCallbackUrl, getRedirectUrl } from "@/lib/utils/auth-redirect";
import { toast } from "@/lib/utils/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * 登录页面 - 使用 fetch 统一处理请求
 * 如果用户已登录，中间件会自动重定向到首页
 */
export default function LoginPage() {
  const fullPage = true;
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginAction = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    code: "",
  });
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState<CaptchaResponse | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // 获取回调地址（从中间件传递过来的）
  const callbackUrl = getCallbackUrl(searchParams);

  // 获取验证码
  const refreshCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const captcha = await getCaptcha();  // 禁用自动错误提示
      setCaptcha(captcha);
    } catch (err) {
      console.error("获取验证码失败:", err);
      // 不显示错误 Toast，静默失败
    } finally {
      setCaptchaLoading(false);
    }
  };

  // 页面加载时获取验证码
  useEffect(() => {
    refreshCaptcha();
  }, []);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!captcha?.uuid) {
      setError("请等待验证码加载完成");
      toast.warning("请等待验证码加载完成");
      return;
    }

    setLoginLoading(true);
    try {
      // 创建登录 promise
      const loginPromise = loginAndSaveToken({
        username: formData.username,
        password: formData.password,
        code: formData.code,
        uuid: captcha.uuid,
      }, {
        showErrorToast: false, // toast.promise 会处理错误显示
      });

      // 使用 toast.promise 自动处理 loading/success/error
      toast.promise(loginPromise, {
        loading: "登录中...",
        success: "登录成功！",
        error: (err) => err.message || "登录失败，请检查用户名和密码",
      });

      // 等待登录结果
      const result = await loginPromise;

      // 保存到 store
      loginAction(result.data.access_token, result.data.expires_in);

      // 登录成功后跳转：优先跳转到 callbackUrl，否则跳转到首页
      const redirectUrl = getRedirectUrl(callbackUrl, "/");
      router.push(redirectUrl);
    } catch (err) {
      const error = err as Error;
      console.log("error-->",error);
      setError(error.message || "登录失败，请检查用户名和密码");

      // 刷新验证码
      refreshCaptcha();

      // 清空验证码输入
      setFormData(prev => ({ ...prev, code: "" }));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  return (
    <div className={fullPage ? "min-h-screen flex items-center justify-center px-4" : "flex items-center justify-center px-4 py-8 md:py-12"}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">登录账户</CardTitle>
          <CardDescription>
            输入您的用户名和密码以访问您的账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名 */}
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={loginLoading}
              />
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loginLoading}
              />
            </div>

            {/* 验证码 */}
            <div className="space-y-2">
              <Label htmlFor="code">验证码</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="请输入验证码"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  disabled={loginLoading}
                  className="flex-1"
                />

                {/* 验证码图片 */}
                <div
                  className="w-32 h-10 border border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => refreshCaptcha()}
                  title="点击刷新验证码"
                >
                  {captchaLoading ? (
                    <span className="text-xs text-gray-500">加载中...</span>
                  ) : captcha?.img ? (
                    <Image
                      src={`data:image/png;base64,${captcha.img}`}
                      alt="验证码"
                      width={128}
                      height={40}
                      className="w-full h-full object-cover rounded"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xs text-gray-500">点击加载</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">点击验证码图片可刷新</p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 登录按钮 */}
            <Button
              type="submit"
              className="w-full"
              disabled={loginLoading || captchaLoading}
            >
              {loginLoading ? "登录中..." : "登录"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">还没有账户？</span>{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              立即注册
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              返回首页
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
