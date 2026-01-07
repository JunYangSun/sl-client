"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * 注册页面
 * 如果用户已登录，中间件会自动重定向到首页
 */
export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "姓名不能为空";
    }

    if (!formData.email.trim()) {
      newErrors.email = "邮箱不能为空";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "邮箱格式不正确";
    }

    if (!formData.password) {
      newErrors.password = "密码不能为空";
    } else if (formData.password.length < 6) {
      newErrors.password = "密码长度至少6位";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次密码输入不一致";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 模拟注册API调用
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟

      // 模拟成功注册
      alert("注册成功！请登录您的账户");
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("注册失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 清除对应字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">注册账户</CardTitle>
          <CardDescription>
            创建您的新账户，开始使用我们的服务
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="请输入您的姓名"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="请输入您的邮箱"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码（至少6位）"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "注册中..." : "注册"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">已有账户？</span>{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              立即登录
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