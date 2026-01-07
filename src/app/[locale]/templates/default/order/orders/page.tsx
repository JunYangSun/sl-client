"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { get } from "@/lib/request/client";
import { toast } from "@/lib/utils/toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye, Filter } from "lucide-react";

// 订单数据类型
interface Order {
  id: string;
  orderNo: string;
  productName: string;
  productImage?: string;
  quantity: number;
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createTime: string;
  payTime?: string;
}

// 模拟数据
const mockOrders: Order[] = [
  {
    id: "1",
    orderNo: "ORD202501050001",
    productName: "高级会员套餐（年费）",
    quantity: 1,
    totalAmount: 299,
    status: "completed",
    createTime: "2025-01-05 10:15:00",
    payTime: "2025-01-05 10:16:30",
  },
  {
    id: "2",
    orderNo: "ORD202501040002",
    productName: "数据分析服务包",
    quantity: 2,
    totalAmount: 598,
    status: "shipped",
    createTime: "2025-01-04 14:20:00",
    payTime: "2025-01-04 14:21:15",
  },
  {
    id: "3",
    orderNo: "ORD202501030003",
    productName: "API调用次数包（1000次）",
    quantity: 5,
    totalAmount: 500,
    status: "paid",
    createTime: "2025-01-03 16:45:00",
    payTime: "2025-01-03 16:46:00",
  },
  {
    id: "4",
    orderNo: "ORD202501020004",
    productName: "云存储空间（100GB）",
    quantity: 1,
    totalAmount: 199,
    status: "pending",
    createTime: "2025-01-02 11:30:00",
  },
  {
    id: "5",
    orderNo: "ORD202501010005",
    productName: "企业版授权",
    quantity: 1,
    totalAmount: 9999,
    status: "cancelled",
    createTime: "2025-01-01 09:00:00",
  },
];

const statusMap = {
  pending: { label: "待支付", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  paid: { label: "已支付", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  shipped: { label: "已发货", className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  completed: { label: "已完成", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export default function OrdersPage() {
  const [data, setData] = useState<Order[] | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await get<Order[]>("orders", {
        page: 1,
        size: 10,
      });
      setData(response.data);
      toast.success("订单数据加载成功");
    } catch (err) {
      console.error("获取订单失败:", err);
      // 错误 Toast 会自动显示，不需要手动调用
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  // 使用请求返回的数据，如果没有数据则使用模拟数据
  const orders = data ?? mockOrders;

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">订单列表</CardTitle>
              <CardDescription className="mt-1">
                查看和管理您的所有订单
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 订单列表 */}
      <div className="space-y-3">
        {orders.map((order) => {
          const statusInfo = statusMap[order.status];

          return (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* 订单头部 */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      订单号：
                    </span>
                    <span className="text-sm font-mono font-medium">
                      {order.orderNo}
                    </span>
                  </div>
                  <Badge variant="secondary" className={statusInfo.className}>
                    {statusInfo.label}
                  </Badge>
                </div>

                {/* 订单内容 */}
                <div className="py-4 flex items-start gap-4">
                  {/* 产品图标/图片 */}
                  <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    {order.productImage ? (
                      <Image
                        src={order.productImage}
                        alt={order.productName}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* 产品信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 truncate">
                      {order.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      数量：{order.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      下单时间：{order.createTime}
                    </p>
                    {order.payTime && (
                      <p className="text-sm text-muted-foreground">
                        支付时间：{order.payTime}
                      </p>
                    )}
                  </div>

                  {/* 价格和操作 */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-primary mb-2">
                      ¥{order.totalAmount.toFixed(2)}
                    </p>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      查看详情
                    </Button>
                  </div>
                </div>

                {/* 移动端操作按钮 */}
                <div className="md:hidden pt-3 border-t border-border">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full">
                      查看详情
                    </Button>
                    {order.status === "pending" && (
                      <Button size="sm" className="w-full">
                        去支付
                      </Button>
                    )}
                    {order.status === "completed" && (
                      <Button variant="outline" size="sm" className="w-full">
                        再次购买
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 空状态提示 */}
      {orders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">暂无订单记录</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
