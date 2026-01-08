"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountForm() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 账户统计 */}
      <Card>
        <CardHeader>
          <CardTitle>账户统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap- text-center">
            <div>
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">登录次数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">活动天数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">2024</div>
              <div className="text-sm text-muted-foreground">注册年份</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
