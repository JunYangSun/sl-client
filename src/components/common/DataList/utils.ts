import type { EcomListProps, EcomListClientProps } from "./types";

/**
 * 判断是否为 EcomList 客户端模式
 */
export function isEcomClientProps<T>(
  props: EcomListProps<T>
): props is EcomListClientProps<T> {
  return "request" in props || "url" in props;
}

