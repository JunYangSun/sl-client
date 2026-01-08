"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHttp, setToken } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { CommonModal, type ModalInstance } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
/**
 * 登录表单数据
 */
interface LoginFormData {
  username: string;
  password: string;
  code: string;
}

/**
 * 登录请求参数
 */
interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 登录响应
 */
interface LoginResponse {
  access_token: string;
  expires_in: number;
}

/**
 * 登录表单内容组件
 */
function LoginFormContent({ onClose }: { onClose: () => void }) {
  const loginAction = useAuthStore((state) => state.login);

  // 使用 react-hook-form 管理表单
  const form = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
  });

  const [error, setError] = useState("");

  // 登录请求（使用 useHttp）
  const loginMutation = useHttp<LoginResponse, LoginRequest>({
    url: "login",
    method: "POST",
  });

  // 处理表单提交
  const onSubmit = async (data: LoginFormData) => {
    setError("");

    try {
      // 调用登录
      const result = await loginMutation.submit({
        username: data.username,
        password: data.password,
      });

      // 保存 token
      setToken(result.access_token, result.expires_in);

      // 保存到 store
      loginAction(result.access_token, result.expires_in);

      // 关闭对话框
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "登录失败，请检查用户名和密码");

      // 清空验证码输入
      form.setValue("code", "");
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-center">登录账户</h3>
      <p className="text-sm text-gray-500 text-center mt-3">
        输入您的用户名和密码以访问您的账户
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-14"
          noValidate
        >
          {/* 用户名 */}
          <FormField
            control={form.control}
            name="username"
            rules={{
              required: "用户名不能为空",
              validate: (value) => {
                if (!value?.trim()) {
                  return "用户名不能为空";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  用户名 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入用户名"
                    disabled={loginMutation.loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 密码 */}
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "密码不能为空",
              validate: (value) => {
                if (!value?.trim()) {
                  return "密码不能为空";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  密码 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="请输入密码"
                    disabled={loginMutation.loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            disabled={loginMutation.loading}
          >
            {loginMutation.loading ? "登录中..." : "登录"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

/**
 * 打开登录对话框（函数式调用）
 *
 * @example
 * ```tsx
 * import { openLoginModal } from "@/components/common/LoginForm";
 *
 * const handleLogin = () => {
 *   openLoginModal();
 * };
 * ```
 */
export function openLoginModal(): ModalInstance {
  return CommonModal({
    width: "400px",
    dismissOnOutsideClick: false,
    content: (close) => <LoginFormContent onClose={close} />,
  });
}
