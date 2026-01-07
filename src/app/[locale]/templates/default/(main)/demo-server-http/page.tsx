import { http } from "@/lib/request/server";
import { ServerErrorToast } from "@/components/ServerErrorToast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

/**
 * 服务器端 HTTP 请求 Demo
 * 演示如何使用 http 通用方法在 Server Component 中发送各种请求
 */

// 强制动态渲染
export const dynamic = 'force-dynamic';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
}

interface Config {
  siteName: string;
  version: string;
  features: string[];
}

export default async function ServerHttpDemoPage() {
  const results: Array<{ title: string; data: unknown; error?: string }> = [];

  // ==================== 示例 1: GET - 基础请求 ====================
  try {
    const response = await http<User>("GET", "/user/1");
    results.push({
      title: "1. GET - 获取单个用户（无缓存）",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "1. GET - 获取单个用户（无缓存）",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 2: GET - 带查询参数 ====================
  try {
    const response = await http<User[]>("GET", "/users", {
      searchParams: {
        page: 1,
        size: 10,
        status: "active"
      }
    });
    results.push({
      title: "2. GET - 用户列表（带查询参数）",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "2. GET - 用户列表（带查询参数）",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 3: GET - 缓存 60 秒 ====================
  try {
    const response = await http<Post[]>("GET", "/posts", {
      searchParams: {
        category: "tech"
      },
      next: {
        revalidate: 60  // 缓存 60 秒
      }
    });
    results.push({
      title: "3. GET - 文章列表（缓存 60 秒）",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "3. GET - 文章列表（缓存 60 秒）",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 4: GET - 永久缓存 ====================
  try {
    const response = await http<Config>("GET", "/config", {
      next: {
        revalidate: false  // 永久缓存
      }
    });
    results.push({
      title: "4. GET - 系统配置（永久缓存）",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "4. GET - 系统配置（永久缓存）",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 5: GET - 使用缓存标签 ====================
  try {
    const response = await http<Post[]>("GET", "/posts/featured", {
      next: {
        revalidate: 300,  // 缓存 5 分钟
        tags: ["posts", "featured"]  // 缓存标签
      }
    });
    results.push({
      title: "5. GET - 推荐文章（缓存标签: posts, featured）",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "5. GET - 推荐文章（缓存标签）",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 6: GET - 标准 cache 选项 ====================
  try {
    const response = await http<User>("GET", "/user/profile", {
      cache: "force-cache"  // 强制缓存
    });
    results.push({
      title: "6. GET - 用户资料（force-cache）",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "6. GET - 用户资料（force-cache）",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 7: POST - 创建数据 ====================
  try {
    const response = await http<User>("POST", "/user", {
      body: {
        name: "李四",
        email: "lisi@example.com",
        age: 28
      }
    });
    results.push({
      title: "7. POST - 创建用户",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "7. POST - 创建用户",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 8: PUT - 更新数据 ====================
  try {
    const response = await http<User>("PUT", "/user/1", {
      body: {
        name: "张三（已更新）",
        email: "zhangsan_new@example.com",
        age: 30
      }
    });
    results.push({
      title: "8. PUT - 更新用户",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "8. PUT - 更新用户",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 9: PATCH - 部分更新 ====================
  try {
    const response = await http<User>("PATCH", "/user/1", {
      body: {
        age: 31  // 只更新年龄
      }
    });
    results.push({
      title: "9. PATCH - 部分更新用户",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "9. PATCH - 部分更新用户",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 10: DELETE - 删除数据 ====================
  try {
    await http<void>("DELETE", "/user/999");
    results.push({
      title: "10. DELETE - 删除用户",
      data: { message: "删除成功" }
    });
  } catch (err) {
    results.push({
      title: "10. DELETE - 删除用户",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 11: 自定义请求头 ====================
  try {
    const response = await http<User>("GET", "/user/1", {
      headers: {
        "X-Custom-Header": "server-demo",
        "Accept-Language": "zh-CN"
      }
    });
    results.push({
      title: "11. GET - 自定义请求头",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "11. GET - 自定义请求头",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 12: 手动传 Token ====================
  try {
    const customToken = "custom-jwt-token-123456";
    const response = await http<User>("GET", "/user/profile", {
      token: customToken  // 手动传入 token
    });
    results.push({
      title: "12. GET - 手动传入 Token",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "12. GET - 手动传入 Token",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // ==================== 示例 13: 设置超时 ====================
  try {
    const response = await http<User>("GET", "/user/slow", {
      timeout: 10000  // 10 秒超时
    });
    results.push({
      title: "13. GET - 设置超时（10秒）",
      data: response.data
    });
  } catch (err) {
    results.push({
      title: "13. GET - 设置超时（10秒）",
      data: null,
      error: err instanceof Error ? err.message : "请求失败"
    });
  }

  // 收集所有错误信息
  const errorMessage = results
    .filter(r => r.error)
    .map(r => `${r.title}: ${r.error}`)
    .join("\n");

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 服务器端错误 Toast */}
      <ServerErrorToast error={errorMessage || null} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">服务器端 HTTP 请求 Demo</h1>
        <p className="text-gray-600">
          演示如何使用 <code className="px-2 py-1 bg-gray-100 rounded">http</code> 通用方法在 Server Component 中发送各种 HTTP 请求
        </p>
      </div>

      {/* 说明卡片 */}
      <Card className="mb-6 bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <h3 className="font-bold text-purple-800 mb-2">Server Component 特性</h3>
          <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
            <li>支持 Next.js 缓存策略（<code>next.revalidate</code> 和 <code>cache</code>）</li>
            <li>可以使用缓存标签（<code>next.tags</code>）进行按需重新验证</li>
            <li>可以手动传入 token（<code>token</code> 参数）</li>
            <li>错误通过 <code>ServerErrorToast</code> 组件显示</li>
            <li>默认不缓存（<code>cache: &quot;no-store&quot;</code>）</li>
          </ul>
        </CardContent>
      </Card>

      {/* 请求结果展示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <Card key={index} className={result.error ? "border-red-200 bg-red-50" : ""}>
            <CardHeader>
              <CardTitle className="text-base">{result.title}</CardTitle>
              {result.error && (
                <CardDescription className="text-red-600">
                  ❌ {result.error}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {result.data ? (
                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-gray-500">请求失败</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 缓存策略说明 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Next.js Revalidate（推荐）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-1">
                next: {"{ revalidate: 60 }"}
              </code>
              <p className="text-sm text-gray-600">缓存 60 秒</p>
            </div>
            <div>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-1">
                next: {"{ revalidate: false }"}
              </code>
              <p className="text-sm text-gray-600">永久缓存</p>
            </div>
            <div>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-1">
                next: {"{ revalidate: 300, tags: ['posts'] }"}
              </code>
              <p className="text-sm text-gray-600">缓存 5 分钟 + 使用标签</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>标准 Cache 选项</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-1">
                cache: &quot;force-cache&quot;
              </code>
              <p className="text-sm text-gray-600">强制缓存</p>
            </div>
            <div>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-1">
                cache: &quot;no-store&quot;
              </code>
              <p className="text-sm text-gray-600">不缓存（默认）</p>
            </div>
            <div>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-1">
                cache: &quot;reload&quot;
              </code>
              <p className="text-sm text-gray-600">重新加载</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 链接到客户端 Demo */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6 text-center">
          <p className="text-blue-800 mb-3">
            想看客户端 HTTP 请求示例？
          </p>
          <Link
            href="/demo-client-http"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            查看客户端 Demo
          </Link>
        </CardContent>
      </Card>

      {/* 代码示例 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>代码示例</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto">
{`import { http } from "@/lib/request/server";

// GET - 缓存 60 秒
const response = await http<User>("GET", "/user/1", {
  next: { revalidate: 60 }
});

// POST - 创建数据
const response = await http<User>("POST", "/user", {
  body: { name: "张三", email: "zhangsan@example.com" }
});

// PUT - 更新数据 + 缓存标签
const response = await http<User>("PUT", "/user/1", {
  body: { name: "李四" },
  next: { revalidate: 300, tags: ["users"] }
});

// DELETE - 删除数据
const response = await http<void>("DELETE", "/user/1");

// 自定义请求头 + 手动传 token
const response = await http<User>("GET", "/user/profile", {
  headers: { "X-Custom": "value" },
  token: "custom-token"
});`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
