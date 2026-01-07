import { notFound } from "next/navigation";

/**
 * Catch-all 路由
 * 捕获所有未匹配的路由并触发 404 页面
 */
export default function CatchAllPage() {
  notFound();
}
