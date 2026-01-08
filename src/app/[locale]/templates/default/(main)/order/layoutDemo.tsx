import { ReactNode } from "react";
import OrderLayout from "@/components/order/OrderLayout";

export default function OrderRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <OrderLayout>{children}</OrderLayout>;
}
