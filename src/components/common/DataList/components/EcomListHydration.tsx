"use client";

import { useEffect } from "react";

/**
 * EcomListHydration：客户端 hydration 标记组件
 * 
 * 在客户端 hydration 后，给父容器添加类名，用于切换 SSR/Client 显示
 */
export function EcomListHydration() {
  useEffect(() => {
    // 查找所有 ecom-list-wrapper，添加 hydrated 类名
    const wrappers = document.querySelectorAll(".ecom-list-wrapper");
    wrappers.forEach((wrapper) => {
      wrapper.classList.add("ecom-list-hydrated");
    });
  }, []);

  return null;
}

