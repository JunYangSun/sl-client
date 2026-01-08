"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountTableClient } from "./account-table-client";
export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟用户数据
  const [userInfo, setUserInfo] = useState({
    name: "张三",
    email: "zhangsan@example.com",
    phone: "13800138000",
    bio: "这是我的个人简介",
    avatar: "",
  });
  const [editForm, setEditForm] = useState(userInfo);

  const handleEditToggle = () => {
    if (isEditing) {
      // 取消编辑，重置表单
      setEditForm(userInfo);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 保存数据
      setUserInfo(editForm);
      setIsEditing(false);
      alert("个人信息更新成功！");
    } catch (error) {
      console.error("Update failed:", error);
      alert("更新失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    if (confirm("确定要退出登录吗？")) {
      alert("已退出登录");
      // 这里应该清除用户状态并重定向到首页
      window.location.href = "/";
    }
  };

  return (
    <div className="container mx-auto   max-w-15xl">
      <div className="grid gap-6">
        {/* 详细信息 */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
              <CardDescription>管理您的个人信息和账户设置</CardDescription>
            </CardHeader>
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center text-2xl font-bold text-muted-foreground mb-4">
                {userInfo.name.charAt(0)}
              </div>
              <CardTitle>{userInfo.name}</CardTitle>
              <CardDescription>{userInfo.email}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="px-3 py-2 border border-border rounded-md bg-muted text-foreground">
                      {userInfo.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="px-3 py-2 border border-border rounded-md bg-muted text-foreground">
                      {userInfo.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">电话</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="px-3 py-2 border border-border rounded-md bg-muted text-foreground">
                      {userInfo.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    name="bio"
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    rows={4}
                    value={editForm.bio}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                ) : (
                  <div className="px-3 py-2 border border-border rounded-md bg-muted text-foreground min-h-[100px]">
                    {userInfo.bio}
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "保存中..." : "保存更改"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleEditToggle}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    取消
                  </Button>
                </div>
              )}
              <CardContent className="max-w-125 mx-auto flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleEditToggle}
                  disabled={isLoading}
                >
                  {isEditing ? "取消编辑" : "编辑资料"}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleLogout}
                >
                  退出登录
                </Button>
              </CardContent>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* 公共表格组件演示（PC端分页，使用真实接口） */}
      <div className="mt-12 space-y-4">
        <h3 className="text-2xl font-semibold">账户列表（分页示例）</h3>
        <p className="text-gray-600">
          通过公共表格组件调用 /admin/account/page/list 接口，支持分页和搜索。
        </p>
        <AccountTableClient />
      </div>
    </div>
  );
}
