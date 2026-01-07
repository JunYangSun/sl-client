"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

// 模拟数据类型
interface Transaction {
  id: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  time: string;
  description?: string;
}

// 模拟数据
const mockTransactions: Transaction[] = [
  {
    id: "TXN001",
    type: "income",
    title: "充值",
    amount: 1000,
    status: "completed",
    time: "2025-01-05 14:30:00",
    description: "支付宝充值",
  },
  {
    id: "TXN002",
    type: "expense",
    title: "购买商品",
    amount: 299,
    status: "completed",
    time: "2025-01-05 10:15:00",
    description: "订单号：ORD123456",
  },
  {
    id: "TXN003",
    type: "expense",
    title: "提现",
    amount: 500,
    status: "pending",
    time: "2025-01-04 16:20:00",
    description: "银行卡提现",
  },
  {
    id: "TXN004",
    type: "income",
    title: "退款",
    amount: 150,
    status: "completed",
    time: "2025-01-03 09:45:00",
    description: "订单取消退款",
  },
  {
    id: "TXN005",
    type: "expense",
    title: "购买VIP",
    amount: 99,
    status: "failed",
    time: "2025-01-02 20:10:00",
    description: "支付失败",
  },
];

const statusMap = {
  completed: { label: "已完成", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  pending: { label: "处理中", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  failed: { label: "失败", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">交易记录</CardTitle>
              <CardDescription className="mt-1">
                查看所有收入和支出记录
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 交易列表 */}
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === "income";
          const statusInfo = statusMap[transaction.status];

          return (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* 图标 */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isIncome
                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">
                          {transaction.title}
                        </h3>
                        {transaction.description && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {transaction.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {transaction.time}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-lg font-bold ${
                            isIncome ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {isIncome ? "+" : "-"}¥{transaction.amount.toFixed(2)}
                        </p>
                        <Badge
                          variant="secondary"
                          className={`mt-2 ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </div>

                    {/* 移动端额外信息 */}
                    <div className="md:hidden mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
                      <span>交易编号：{transaction.id}</span>
                    </div>
                  </div>
                </div>

                {/* PC端额外信息 */}
                <div className="hidden md:block mt-3 pt-3 border-t border-border">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>交易编号：{transaction.id}</span>
                    <span>类型：{isIncome ? "收入" : "支出"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 空状态提示 */}
      {transactions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">暂无交易记录</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
