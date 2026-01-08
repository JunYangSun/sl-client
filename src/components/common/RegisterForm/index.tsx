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
 * 注册表单数据
 */
interface RegisterFormData {
  username: string;
  phone: string;
  email: string;
  password: string;
  inviteCode?: string;
}

/**
 * 注册请求参数
 */
interface RegisterRequest {
  username: string;
  phone: string;
  email: string;
  password: string;
  inviteCode?: string;
}

/**
 * 注册响应
 */
interface RegisterResponse {
  code: number;
  message: string;
}

/**
 * 注册表单内容组件
 */
function RegisterFormContent({ onClose }: { onClose: () => void }) {
  // 使用 react-hook-form 管理表单
  const form = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      phone: "",
      email: "",
      password: "",
      inviteCode: "",
    },
  });

  const [error, setError] = useState("");

  // 注册请求（使用 useHttp）
  const registerMutation = useHttp<RegisterResponse, RegisterRequest>({
    url: "register", // 修复：使用正确的注册API端点
    method: "POST",
  });

  // 处理表单提交
  const onSubmit = async (data: RegisterFormData) => {
    setError("");

    try {
      // 调用注册
      const result = await registerMutation.submit({
        username: data.username,
        phone: data.phone,
        email: data.email,
        password: data.password,
        inviteCode: data.inviteCode || undefined, // 如果为空则设为undefined
      });
      if (result?.code === 200) {
        setError("注册成功，请登录");
      }

      // 关闭对话框
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "注册失败，请检查输入信息");
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-center">注册账户</h3>
      <p className="text-sm text-gray-500 text-center mt-3">
        输入您的信息以创建新账户
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
                    disabled={registerMutation.loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 手机号 */}
          <FormField
            control={form.control}
            name="phone"
            rules={{
              required: "手机号不能为空",
              pattern: {
                value: /^1[3-9]\d{9}$/,
                message: "手机号格式不正确",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  手机号 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入手机号"
                    disabled={registerMutation.loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 邮箱 */}
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "邮箱不能为空",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "邮箱格式不正确",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  邮箱 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入邮箱"
                    disabled={registerMutation.loading}
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
              minLength: {
                value: 6,
                message: "密码长度至少6位",
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
                    disabled={registerMutation.loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 邀请码 - 非必填 */}
          <FormField
            control={form.control}
            name="inviteCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邀请码</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入邀请码（选填）"
                    disabled={registerMutation.loading}
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

          {/* 注册按钮 */}
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.loading}
          >
            {registerMutation.loading ? "注册中..." : "注册"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

/**
 * 打开注册对话框（函数式调用）
 *
 * @example
 * ```tsx
 * import { openRegisterModal } from "@/components/common/RegisterForm";
 *
 * const handleRegister = () => {
 *   openRegisterModal();
 * };
 * ```
 */
export function openRegisterModal(): ModalInstance {
  return CommonModal({
    width: "400px",
    dismissOnOutsideClick: false,
    content: (close) => <RegisterFormContent onClose={close} />,
  });
}
