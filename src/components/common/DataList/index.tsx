/**
 * 列表组件主入口
 * 导出所有公共 API
 */

// 导出类型
export type {
  QueryParams,
  EcomListBaseRenderPayload,
  EcomListServerProps,
  EcomListClientProps,
  EcomListProps,
} from "./types";

// 导出组件
// - EcomList：统一入口（Server Component），自动处理 SSR + 客户端交互
// - EcomListClient：客户端版本（内部使用，React Query / 触底加载）
// - EcomListServer：仅用于 Server Component 的服务端封装（内部使用）
// - EcomListClientRoot：客户端根组件（内部使用，提供 QueryClientProvider）
// - EcomListAuto：客户端自动选择组件（内部使用，用于纯客户端场景）
export { EcomList } from "./components/EcomList";
export { EcomListClient } from "./components/EcomListClient";
export { EcomListServer } from "./components/EcomListUniversal";
export { EcomListClientRoot } from "./components/EcomListClientRoot";
export { EcomListAuto } from "./components/EcomListAuto";

// 导出工具函数
export { isEcomClientProps } from "./utils";
