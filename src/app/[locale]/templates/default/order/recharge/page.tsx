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
import { Button } from "@/components/ui/button";
import { Plus, Wallet, CreditCard, Filter } from "lucide-react";

// 充值记录类型
interface RechargeRecord {
  id: string;
  rechargeNo: string;
  amount: number;
  method: "alipay" | "wechat" | "bank" | "balance";
  status: "success" | "pending" | "failed";
  createTime: string;
  completeTime?: string;
  remark?: string;
}

// 模拟数据
const mockRecharges: RechargeRecord[] = [
  {
    id: "1",
    rechargeNo: "RCH202501050001",
    amount: 1000,
    method: "alipay",
    status: "success",
    createTime: "2025-01-05 14:30:00",
    completeTime: "2025-01-05 14:30:15",
    remark: "支付宝充值",
  },
  {
    id: "2",
    rechargeNo: "RCH202501040002",
    amount: 500,
    method: "wechat",
    status: "success",
    createTime: "2025-01-04 10:20:00",
    completeTime: "2025-01-04 10:20:08",
    remark: "微信充值",
  },
  {
    id: "3",
    rechargeNo: "RCH202501030003",
    amount: 2000,
    method: "bank",
    status: "pending",
    createTime: "2025-01-03 16:45:00",
    remark: "银行卡转账",
  },
  {
    id: "4",
    rechargeNo: "RCH202501020004",
    amount: 300,
    method: "alipay",
    status: "success",
    createTime: "2025-01-02 09:15:00",
    completeTime: "2025-01-02 09:15:10",
  },
  {
    id: "5",
    rechargeNo: "RCH202501010005",
    amount: 100,
    method: "wechat",
    status: "failed",
    createTime: "2025-01-01 20:30:00",
    remark: "支付超时",
  },
];

const methodMap = {
  alipay: { label: "支付宝", icon: "💰" },
  wechat: { label: "微信支付", icon: "💳" },
  bank: { label: "银行卡", icon: "🏦" },
  balance: { label: "余额", icon: "💵" },
};

const statusMap = {
  success: { label: "成功", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  pending: { label: "处理中", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  failed: { label: "失败", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export default function RechargePage() {
  const [recharges] = useState<RechargeRecord[]>(mockRecharges);

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">充值列表</CardTitle>
              <CardDescription className="mt-1">
                查看和管理您的充值记录
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                新增充值
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 统计卡片 - 仅PC端显示 */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">累计充值</p>
                <p className="text-2xl font-bold">¥3,900</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">本月充值</p>
                <p className="text-2xl font-bold">¥3,900</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">充值次数</p>
                <p className="text-2xl font-bold">{recharges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 充值记录列表 */}
      <div className="space-y-3">
        {recharges.map((recharge) => {
          const methodInfo = methodMap[recharge.method];
          const statusInfo = statusMap[recharge.status];

          return (
            <Card key={recharge.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* 充值头部 */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      充值单号：
                    </span>
                    <span className="text-sm font-mono font-medium">
                      {recharge.rechargeNo}
                    </span>
                  </div>
                  <Badge variant="secondary" className={statusInfo.className}>
                    {statusInfo.label}
                  </Badge>
                </div>

                {/* 充值内容 */}
                <div className="py-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* 支付方式图标 */}
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                      {methodInfo.icon}
                    </div>

                    {/* 充值信息 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1">
                        {methodInfo.label}充值
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        发起时间：{recharge.createTime}
                      </p>
                      {recharge.completeTime && (
                        <p className="text-sm text-muted-foreground">
                          完成时间：{recharge.completeTime}
                        </p>
                      )}
                      {recharge.remark && (
                        <p className="text-sm text-muted-foreground mt-1">
                          备注：{recharge.remark}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 金额 */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +¥{recharge.amount.toFixed(2)}
                    </p>
                    {recharge.status === "pending" && (
                      <Button variant="outline" size="sm" className="mt-2">
                        查看进度
                      </Button>
                    )}
                  </div>
                </div>

                {/* 移动端操作按钮 */}
                <div className="md:hidden pt-3 border-t border-border">
                  {recharge.status === "pending" && (
                    <Button variant="outline" size="sm" className="w-full">
                      查看进度
                    </Button>
                  )}
                  {recharge.status === "failed" && (
                    <Button size="sm" className="w-full">
                      重新充值
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 空状态提示 */}
      {recharges.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">暂无充值记录</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              立即充值
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
