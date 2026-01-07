/**
 * 全局认证状态管理
 * 使用 Zustand + Cookie 存储
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  getToken,
  setToken as setCookie,
  clearToken as clearCookie,
} from "@/lib/request/client";

// ========== 类型定义 ==========

interface User {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
  [key: string]: unknown;
}

interface AuthState {
  // 状态
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;

  // Actions
  login: (token: string, expiresIn: number, user?: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => void;
}

// ========== Store ==========

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isLoggedIn: false,
      token: null,
      user: null,

      /**
       * 登录
       * @param token JWT Token
       * @param expiresIn 过期时间（分钟）
       * @param user 用户信息（可选）
       */
      login: (token, expiresIn, user) => {

        // 1. 保存 Token 到 Cookie
        setCookie(token, expiresIn);

        // 2. 更新 Zustand 状态
        set({
          isLoggedIn: true,
          token,
          user: user || null,
        });

      },

      /**
       * 登出
       */
      logout: () => {

        // 1. 清除 Cookie
        clearCookie();

        // 2. 清空 Zustand 状态
        set({
          isLoggedIn: false,
          token: null,
          user: null,
        });

      },

      /**
       * 设置用户信息
       */
      setUser: (user) => {
        set({ user });
      },

      /**
       * 检查认证状态
       * 从 Cookie 中读取 Token 并同步到 Zustand
       */
      checkAuth: () => {
        const token = getToken();
        const currentState = get();


        // 如果 Cookie 中有 Token，但 Zustand 中没有，则同步
        if (token && !currentState.isLoggedIn) {
          set({
            isLoggedIn: true,
            token,
          });
        }
        // 如果 Cookie 中没有 Token，但 Zustand 中有，则清除
        else if (!token && currentState.isLoggedIn) {
          set({
            isLoggedIn: false,
            token: null,
            user: null,
          });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage 中的 key
      storage: createJSONStorage(() => localStorage),
      // 只持久化用户信息，Token 存在 Cookie 中
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
