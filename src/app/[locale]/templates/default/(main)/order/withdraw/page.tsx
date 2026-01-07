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
import { Plus, ArrowUpFromLine, DollarSign, Filter, Clock } from "lucide-react";

// 提现记录类型
interface WithdrawRecord {
  id: string;
  withdrawNo: string;
  amount: number;
  fee: number;
  actualAmount: number;
  method: "alipay" | "wechat" | "bank";
  accountInfo: string;
  status: "success" | "pending" | "processing" | "rejected";
  createTime: string;
  completeTime?: string;
  remark?: string;
  rejectReason?: string;
}

// 模拟数据
const mockWithdraws: WithdrawRecord[] = [
  {
    id: "1",
    withdrawNo: "WTD202501050001",
    amount: 500,
    fee: 5,
    actualAmount: 495,
    method: "alipay",
    accountInfo: "138****8888",
    status: "success",
    createTime: "2025-01-05 09:30:00",
    completeTime: "2025-01-05 15:20:15",
    remark: "提现到支付宝",
  },
  {
    id: "2",
    withdrawNo: "WTD202501040002",
    amount: 1000,
    fee: 10,
    actualAmount: 990,
    method: "bank",
    accountInfo: "建设银行 ****6789",
    status: "processing",
    createTime: "2025-01-04 14:20:00",
    remark: "提现到银行卡",
  },
  {
    id: "3",
    withdrawNo: "WTD202501030003",
    amount: 200,
    fee: 2,
    actualAmount: 198,
    method: "wechat",
    accountInfo: "微信号：wx****123",
    status: "pending",
    createTime: "2025-01-03 16:45:00",
    remark: "提现到微信",
  },
  {
    id: "4",
    withdrawNo: "WTD202501020004",
    amount: 300,
    fee: 3,
    actualAmount: 297,
    method: "alipay",
    accountInfo: "139****6666",
    status: "success",
    createTime: "2025-01-02 10:15:00",
    completeTime: "2025-01-02 18:30:00",
  },
  {
    id: "5",
    withdrawNo: "WTD202501010005",
    amount: 100,
    fee: 1,
    actualAmount: 99,
    method: "bank",
    accountInfo: "工商银行 ****1234",
    status: "rejected",
    createTime: "2025-01-01 08:30:00",
    remark: "提现到银行卡",
    rejectReason: "账户信息不匹配",
  },
];

const methodMap = {
  alipay: { label: "支付宝", icon: "💰" },
  wechat: { label: "微信", icon: "💳" },
  bank: { label: "银行卡", icon: "🏦" },
};

const statusMap = {
  success: { label: "已完成", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  pending: { label: "待审核", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  processing: { label: "处理中", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  rejected: { label: "已驳回", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

export default function WithdrawPage() {
  const [withdraws] = useState<WithdrawRecord[]>(mockWithdraws);

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">提现列表</CardTitle>
              <CardDescription className="mt-1">
                查看和管理您的提现记录
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                申请提现
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 统计卡片 - 仅PC端显示 */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <ArrowUpFromLine className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">累计提现</p>
                <p className="text-2xl font-bold">¥1,100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">处理中</p>
                <p className="text-2xl font-bold">¥1,200</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">手续费</p>
                <p className="text-2xl font-bold">¥21</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">提现次数</p>
                <p className="text-2xl font-bold">{withdraws.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 提现记录列表 */}
      <div className="space-y-3">
        {withdraws.map((withdraw) => {
          const methodInfo = methodMap[withdraw.method];
          const statusInfo = statusMap[withdraw.status];

          return (
            <Card key={withdraw.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* 提现头部 */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      提现单号：
                    </span>
                    <span className="text-sm font-mono font-medium">
                      {withdraw.withdrawNo}
                    </span>
                  </div>
                  <Badge variant="secondary" className={statusInfo.className}>
                    {statusInfo.label}
                  </Badge>
                </div>

                {/* 提现内容 */}
                <div className="py-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* 提现方式图标 */}
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                        {methodInfo.icon}
                      </div>

                      {/* 提现信息 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base mb-1">
                          提现至{methodInfo.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          账户：{withdraw.accountInfo}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          申请时间：{withdraw.createTime}
                        </p>
                        {withdraw.completeTime && (
                          <p className="text-sm text-muted-foreground">
                            完成时间：{withdraw.completeTime}
                          </p>
                        )}
                        {withdraw.remark && (
                          <p className="text-sm text-muted-foreground mt-1">
                            备注：{withdraw.remark}
                          </p>
                        )}
                        {withdraw.rejectReason && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            驳回原因：{withdraw.rejectReason}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 金额信息 */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        -¥{withdraw.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        手续费：¥{withdraw.fee.toFixed(2)}
                      </p>
                      <p className="text-sm font-medium text-primary mt-1">
                        实际到账：¥{withdraw.actualAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* PC端进度条或状态说明 */}
                  {withdraw.status === "processing" && (
                    <div className="hidden md:block p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        ⏳ 您的提现申请正在处理中，预计1-3个工作日到账
                      </p>
                    </div>
                  )}
                  {withdraw.status === "pending" && (
                    <div className="hidden md:block p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        ⏱️ 您的提现申请待审核，请耐心等待
                      </p>
                    </div>
                  )}
                </div>

                {/* 移动端操作按钮 */}
                <div className="md:hidden pt-3 border-t border-border">
                  {withdraw.status === "rejected" && (
                    <Button size="sm" className="w-full">
                      重新申请
                    </Button>
                  )}
                  {(withdraw.status === "pending" || withdraw.status === "processing") && (
                    <Button variant="outline" size="sm" className="w-full">
                      查看进度
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 空状态提示 */}
      {withdraws.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ArrowUpFromLine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">暂无提现记录</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              申请提现
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
