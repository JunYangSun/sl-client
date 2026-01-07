"use client";

import { useState } from "react";
import { http } from "@/lib/request/client";
import { toast } from "@/lib/utils/toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * 客户端 HTTP 请求 Demo
 * 演示如何使用 http 通用方法发送各种请求
 */

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

interface ApiListResponse<T> {
  list: T[];
  total: number;
}

export default function ClientHttpDemoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [formData, setFormData] = useState({
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    age: "25",
  });

  // 清空结果
  const clearResult = () => setResult("");

  // 格式化显示结果
  const showResult = (title: string, data: unknown) => {
    setResult(`【${title}】\n${JSON.stringify(data, null, 2)}`);
  };

  // ==================== GET 请求 ====================

  // 示例 1: GET - 获取单个用户
  const handleGetUser = async () => {
    setLoading(true);
    clearResult();
    try {
      const response = await http<User>("GET", `/user/${formData.id}`);
      showResult("GET - 获取用户", response.data);
      toast.success("获取成功");
    } catch (err) {
      // 错误会自动显示 Toast
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 示例 2: GET - 带查询参数
  const handleGetUsers = async () => {
    setLoading(true);
    clearResult();
    try {
      const response = await http<ApiListResponse<User>>("GET", "/users", {
        searchParams: {
          page: 1,
          size: 10,
          status: "active"
        }
      });
      showResult("GET - 用户列表（带查询参数）", response.data);
      toast.success(`获取成功，共 ${response.data.total} 条数据`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== POST 请求 ====================

  // 示例 3: POST - 创建用户
  const handleCreateUser = async () => {
    setLoading(true);
    clearResult();
    try {
      const response = await http<User>("POST", "/user", {
        body: {
          name: formData.name,
          email: formData.email,
          age: Number(formData.age)
        }
      });
      showResult("POST - 创建用户", response.data);
      toast.success("创建成功");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 示例 4: POST - 使用 toast.promise
  const handleCreateUserWithToast = async () => {
    setLoading(true);
    clearResult();

    const promise = http<User>("POST", "/user", {
      body: {
        name: formData.name,
        email: formData.email,
        age: Number(formData.age)
      },
      showErrorToast: false  // 禁用自动错误 Toast
    });

    // 使用 toast.promise 显示进度
    toast.promise(promise, {
      loading: "创建中...",
      success: "创建成功！",
      error: (err) => err.message || "创建失败"
    });

    try {
      const response = await promise;
      showResult("POST - 创建用户（带 Toast 进度）", response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== PUT 请求 ====================

  // 示例 5: PUT - 更新用户
  const handleUpdateUser = async () => {
    setLoading(true);
    clearResult();
    try {
      const response = await http<User>("PUT", `/user/${formData.id}`, {
        body: {
          name: formData.name,
          email: formData.email,
          age: Number(formData.age)
        }
      });
      showResult("PUT - 更新用户", response.data);
      toast.success("更新成功");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== PATCH 请求 ====================

  // 示例 6: PATCH - 部分更新
  const handlePatchUser = async () => {
    setLoading(true);
    clearResult();
    try {
      const response = await http<User>("PATCH", `/user/${formData.id}`, {
        body: {
          name: formData.name  // 只更新名字
        }
      });
      showResult("PATCH - 部分更新用户", response.data);
      toast.success("更新成功");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== DELETE 请求 ====================

  // 示例 7: DELETE - 删除用户
  const handleDeleteUser = async () => {
    setLoading(true);
    clearResult();
    try {
      await http<void>("DELETE", `/user/${formData.id}`);
      showResult("DELETE - 删除用户", { message: "删除成功" });
      toast.success("删除成功");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== 高级用法 ====================

  // 示例 8: 自定义请求头
  const handleCustomHeaders = async () => {
    setLoading(true);
    clearResult();
    try {
      const response = await http<User>("GET", `/user/${formData.id}`, {
        headers: {
          "X-Custom-Header": "custom-value",
          "Accept-Language": "zh-CN"
        }
      });
      showResult("GET - 自定义请求头", response.data);
      toast.success("请求成功");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 示例 9: 设置超时
  const handleTimeout = async () => {
    setLoading(true);
    clearResult();
    try {
      const response = await http<User>("GET", "/user/slow", {
        timeout: 5000  // 5 秒超时
      });
      showResult("GET - 设置超时（5秒）", response.data);
      toast.success("请求成功");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 示例 10: 禁用自动错误 Toast
  const handleNoAutoToast = async () => {
    setLoading(true);
    clearResult();
    try {
      const response = await http<User>("GET", "/user/error", {
        showErrorToast: false  // 禁用自动错误提示
      });
      showResult("GET - 禁用自动错误 Toast", response.data);
    } catch (err) {
      // 需要手动处理错误
      const error = err as Error;
      setResult(`【错误】\n${error.message}`);
      toast.error(`手动处理错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 示例 11: 动态请求方法
  const handleDynamicMethod = async (method: "GET" | "POST" | "PUT" | "DELETE") => {
    setLoading(true);
    clearResult();
    try {
      const response = await http<User>(method, `/user/${formData.id}`, {
        searchParams: method === "GET" ? { detail: true } : undefined,
        body: method === "POST" || method === "PUT" ? {
          name: formData.name,
          email: formData.email
        } : undefined
      });
      showResult(`${method} - 动态请求方法`, response.data);
      toast.success(`${method} 请求成功`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">客户端 HTTP 请求 Demo</h1>
      <p className="text-gray-600 mb-8">
        演示如何使用 <code className="px-2 py-1 bg-gray-100 rounded">http</code> 通用方法发送各种 HTTP 请求
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：表单 */}
        <div className="space-y-6">
          {/* 表单输入 */}
          <Card>
            <CardHeader>
              <CardTitle>请求参数</CardTitle>
              <CardDescription>修改下面的参数来测试不同的请求</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="id">用户 ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="用户 ID"
                />
              </div>
              <div>
                <Label htmlFor="name">用户名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="用户名"
                />
              </div>
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="邮箱"
                />
              </div>
              <div>
                <Label htmlFor="age">年龄</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="年龄"
                />
              </div>
            </CardContent>
          </Card>

          {/* GET 请求 */}
          <Card>
            <CardHeader>
              <CardTitle>GET 请求</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleGetUser} disabled={loading} className="w-full">
                1. 获取单个用户
              </Button>
              <Button onClick={handleGetUsers} disabled={loading} className="w-full" variant="outline">
                2. 获取用户列表（带查询参数）
              </Button>
            </CardContent>
          </Card>

          {/* POST 请求 */}
          <Card>
            <CardHeader>
              <CardTitle>POST 请求</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleCreateUser} disabled={loading} className="w-full">
                3. 创建用户
              </Button>
              <Button onClick={handleCreateUserWithToast} disabled={loading} className="w-full" variant="outline">
                4. 创建用户（带 Toast 进度）
              </Button>
            </CardContent>
          </Card>

          {/* PUT/PATCH 请求 */}
          <Card>
            <CardHeader>
              <CardTitle>PUT/PATCH 请求</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleUpdateUser} disabled={loading} className="w-full">
                5. PUT - 更新用户
              </Button>
              <Button onClick={handlePatchUser} disabled={loading} className="w-full" variant="outline">
                6. PATCH - 部分更新
              </Button>
            </CardContent>
          </Card>

          {/* DELETE 请求 */}
          <Card>
            <CardHeader>
              <CardTitle>DELETE 请求</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleDeleteUser} disabled={loading} className="w-full" variant="destructive">
                7. 删除用户
              </Button>
            </CardContent>
          </Card>

          {/* 高级用法 */}
          <Card>
            <CardHeader>
              <CardTitle>高级用法</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleCustomHeaders} disabled={loading} className="w-full" variant="outline">
                8. 自定义请求头
              </Button>
              <Button onClick={handleTimeout} disabled={loading} className="w-full" variant="outline">
                9. 设置超时（5秒）
              </Button>
              <Button onClick={handleNoAutoToast} disabled={loading} className="w-full" variant="outline">
                10. 禁用自动错误 Toast
              </Button>
            </CardContent>
          </Card>

          {/* 动态方法 */}
          <Card>
            <CardHeader>
              <CardTitle>动态请求方法</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleDynamicMethod("GET")} disabled={loading} variant="outline" size="sm">
                  GET
                </Button>
                <Button onClick={() => handleDynamicMethod("POST")} disabled={loading} variant="outline" size="sm">
                  POST
                </Button>
                <Button onClick={() => handleDynamicMethod("PUT")} disabled={loading} variant="outline" size="sm">
                  PUT
                </Button>
                <Button onClick={() => handleDynamicMethod("DELETE")} disabled={loading} variant="outline" size="sm">
                  DELETE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：结果显示 */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>请求结果</CardTitle>
              <CardDescription>
                {loading ? "请求中..." : "等待请求..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {result}
                </pre>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  点击左侧按钮发送请求
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 说明文档 */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-bold text-blue-800 mb-2">使用说明</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>所有请求都使用 <code>http</code> 通用方法</li>
            <li>错误会自动显示 Toast 提示（除非设置 <code>showErrorToast: false</code>）</li>
            <li>可以自定义请求头、超时时间等参数</li>
            <li>支持 GET、POST、PUT、PATCH、DELETE 等所有 HTTP 方法</li>
            <li>可以使用 <code>toast.promise</code> 显示请求进度</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
