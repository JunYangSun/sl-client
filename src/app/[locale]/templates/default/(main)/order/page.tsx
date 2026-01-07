import { redirect } from "next/navigation";

export default function OrderPage() {
  // 默认重定向到交易记录页面
  redirect("/order/transactions");
}
