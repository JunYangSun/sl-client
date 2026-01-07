/**
 * 默认模板布局 - Server Component
 * 具体的导航布局交由路由分组内部处理
 */
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
