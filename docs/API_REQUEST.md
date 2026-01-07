# API 请求封装使用文档

本项目基于原生 `fetch` 封装了统一的 API 请求库，支持客户端和服务器端请求，提供自动错误处理、Toast 提示、缓存控制等功能。

## 目录

- [快速开始](#快速开始)
- [客户端请求](#客户端请求)
- [服务器端请求](#服务器端请求)
- [错误处理](#错误处理)
- [缓存策略](#缓存策略)
- [高级用法](#高级用法)
- [最佳实践](#最佳实践)

---

## 快速开始

### 基本导入

```typescript
// 客户端组件
import { get, post, put, del, patch, http } from "@/lib/request/client";

// 服务器端组件
import { get, post, put, del, patch, http } from "@/lib/request/server";
```

### 最简单的例子

```typescript
// 客户端 GET 请求
const response = await get<User>("/user/profile");
const user = response.data;

// 客户端 POST 请求
const response = await post<User>("/user", {
  name: "张三",
  age: 25
});
```

---

## 客户端请求

客户端请求用于在 **Client Component** 中调用 API，支持自动 Toast 错误提示。

### 基础用法

#### GET 请求

```typescript
"use client";

import { get } from "@/lib/request/client";

interface User {
  id: string;
  name: string;
  email: string;
}

// 1. 基础 GET
const response = await get<User>("/user/123");
console.log(response.data); // { id: "123", name: "张三", ... }

// 2. 带查询参数
const response = await get<User[]>("/users", {
  page: 1,
  size: 10,
  status: "active"
});
// 实际请求: /api/users?page=1&size=10&status=active

// 3. 禁用自动错误 Toast
const response = await get<User>("/user/123", undefined, {
  showErrorToast: false
});
```

#### POST 请求

```typescript
import { post } from "@/lib/request/client";

// 1. 创建用户
const response = await post<User>("/user", {
  name: "李四",
  email: "lisi@example.com",
  age: 30
});

// 2. 登录
const response = await post<LoginResponse>("/auth/login", {
  username: "admin",
  password: "123456",
  code: "1234",
  uuid: "xxx-xxx-xxx"
});

// 3. 上传文件数据
const response = await post<Upload>("/upload", {
  file: base64Data,
  filename: "avatar.png"
});
```

#### PUT 请求

```typescript
import { put } from "@/lib/request/client";

// 1. 更新用户信息
const response = await put<User>("/user/123", {
  name: "王五",
  email: "wangwu@example.com"
});

// 2. 更新配置
const response = await put<Config>("/config", {
  theme: "dark",
  language: "zh-CN"
});
```

#### DELETE 请求

```typescript
import { del } from "@/lib/request/client";

// 1. 删除用户
const response = await del<void>("/user/123");

// 2. 带查询参数删除
const response = await del<void>("/posts/batch", {
  ids: "1,2,3"
});
```

#### PATCH 请求

```typescript
import { patch } from "@/lib/request/client";

// 1. 部分更新
const response = await patch<User>("/user/123", {
  status: "inactive"
});

// 2. 批量更新状态
const response = await patch<void>("/users/status", {
  ids: [1, 2, 3],
  status: "active"
});
```

#### 通用 HTTP 请求

```typescript
import { http } from "@/lib/request/client";

// 动态指定请求方法
const method = isCreate ? "POST" : "PUT";
const response = await http<User>(method, "/user", {
  body: userData
});

// 所有方法都支持
const response1 = await http<User>("GET", "/user/123");
const response2 = await http<User>("POST", "/user", { body: userData });
const response3 = await http<User>("PUT", "/user/123", { body: userData });
const response4 = await http<void>("DELETE", "/user/123");
const response5 = await http<User>("PATCH", "/user/123", { body: { status: "active" } });
```

### 在组件中使用

#### 基础数据获取

```typescript
"use client";

import { useState, useEffect } from "react";
import { get } from "@/lib/request/client";
import { toast } from "@/lib/utils/toast";

interface User {
  id: string;
  name: string;
}

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await get<User>("/user/profile");
      setUser(response.data);
      toast.success("加载成功");
    } catch (err) {
      // 错误会自动显示 Toast
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (!user) return <div>暂无数据</div>;

  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
}
```

#### 表单提交

```typescript
"use client";

import { useState } from "react";
import { post } from "@/lib/request/client";
import { toast } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";

export function CreateUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setLoading(true);
    try {
      await post("/user", {
        name: formData.get("name"),
        email: formData.get("email"),
      });
      toast.success("创建成功");
      router.push("/users");
    } catch (err) {
      // 错误会自动显示 Toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit" disabled={loading}>
        {loading ? "提交中..." : "提交"}
      </button>
    </form>
  );
}
```

#### 使用 toast.promise

```typescript
"use client";

import { post } from "@/lib/request/client";
import { toast } from "@/lib/utils/toast";

export function CreateButton() {
  const handleCreate = async () => {
    // 创建 promise
    const createPromise = post("/item", {
      name: "新项目",
      description: "描述"
    }, {
      showErrorToast: false  // 禁用自动错误 Toast
    });

    // 使用 toast.promise
    toast.promise(createPromise, {
      loading: "创建中...",
      success: "创建成功！",
      error: (err) => err.message || "创建失败"
    });

    try {
      const result = await createPromise;
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleCreate}>创建</button>;
}
```

---

## 服务器端请求

服务器端请求用于在 **Server Component** 中调用 API，支持 Next.js 缓存策略。

### 基础用法

#### GET 请求

```typescript
import { get } from "@/lib/request/server";

// 1. 基础 GET（默认不缓存）
const response = await get<User>("/user/123");

// 2. 带查询参数
const response = await get<Post[]>("/posts", {
  category: "tech",
  page: 1
});

// 3. 缓存 60 秒
const response = await get<Config>("/config", undefined, {
  next: { revalidate: 60 }
});

// 4. 永久缓存
const response = await get<StaticData>("/static", undefined, {
  next: { revalidate: false }
});

// 5. 使用缓存标签
const response = await get<Post[]>("/posts", undefined, {
  next: {
    revalidate: 300,
    tags: ["posts"]
  }
});

// 6. 手动传 token
const response = await get<User>("/user/profile", undefined, {
  token: "custom-token"
});
```

#### POST 请求

```typescript
import { post } from "@/lib/request/server";

// 1. 创建数据
const response = await post<User>("/user", {
  name: "张三",
  email: "zhangsan@example.com"
});

// 2. 手动传 token
const response = await post<Order>("/order", orderData, {
  token: customToken
});
```

#### 其他方法

```typescript
import { put, del, patch, http } from "@/lib/request/server";

// PUT
const response = await put<User>("/user/123", userData);

// DELETE
const response = await del<void>("/user/123");

// PATCH
const response = await patch<User>("/user/123", { status: "active" });

// HTTP 通用方法
const response = await http<User>("POST", "/user", { body: userData });
```

### 在 Server Component 中使用

#### 列表页面

```typescript
import { get } from "@/lib/request/server";
import { ServerErrorToast } from "@/components/ServerErrorToast";

interface Post {
  id: string;
  title: string;
  content: string;
}

export default async function PostsPage() {
  let posts: Post[] = [];
  let errorMessage: string | null = null;

  try {
    // 缓存 5 分钟
    const response = await get<Post[]>("/posts", undefined, {
      next: {
        revalidate: 300,
        tags: ["posts"]
      }
    });
    posts = response.data;
  } catch (err) {
    // 捕获错误，通过客户端组件显示 Toast
    errorMessage = err instanceof Error ? err.message : "加载失败";
    console.error(err);
  }

  return (
    <div>
      {/* 服务器端错误 Toast */}
      <ServerErrorToast error={errorMessage} />

      {posts.length === 0 ? (
        <p>暂无数据</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### 详情页面

```typescript
import { get } from "@/lib/request/server";
import { notFound } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    // 缓存 10 分钟
    const response = await get<Post>(`/posts/${id}`, undefined, {
      next: {
        revalidate: 600,
        tags: [`post-${id}`]
      }
    });

    return (
      <article>
        <h1>{response.data.title}</h1>
        <div>{response.data.content}</div>
      </article>
    );
  } catch (err) {
    // 数据不存在时返回 404
    notFound();
  }
}
```

#### Layout 中获取配置

```typescript
import { get } from "@/lib/request/server";

interface SiteConfig {
  title: string;
  description: string;
  logo: string;
}

export default async function RootLayout({ children }) {
  let config: SiteConfig | null = null;

  try {
    // 永久缓存配置数据
    const response = await get<SiteConfig>("/config/site", undefined, {
      next: { revalidate: false }  // 永久缓存
    });
    config = response.data;
  } catch (err) {
    console.error("Failed to load config:", err);
  }

  return (
    <html>
      <head>
        <title>{config?.title || "默认标题"}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 错误处理

### 客户端自动错误 Toast

```typescript
import { get } from "@/lib/request/client";

// 默认：错误自动显示 Toast
try {
  await get("/api/data");
} catch (err) {
  // Toast 已自动显示
  console.error(err);
}

// 禁用自动 Toast
try {
  await get("/api/data", undefined, {
    showErrorToast: false
  });
} catch (err) {
  // 需要手动处理错误
  customErrorHandler(err);
}
```

### 服务器端错误处理

```typescript
import { get } from "@/lib/request/server";
import { ServerErrorToast } from "@/components/ServerErrorToast";

export default async function Page() {
  let errorMessage: string | null = null;

  try {
    const response = await get("/api/data");
  } catch (err) {
    // 捕获错误消息
    errorMessage = err instanceof Error ? err.message : "加载失败";
  }

  return (
    <div>
      {/* 通过客户端组件显示 Toast */}
      <ServerErrorToast error={errorMessage} />
      {/* 其他内容 */}
    </div>
  );
}
```

### 使用 toast.promise

```typescript
"use client";

import { post } from "@/lib/request/client";
import { toast } from "@/lib/utils/toast";

async function handleSubmit() {
  const promise = post("/api/data", formData, {
    showErrorToast: false  // 禁用自动 Toast
  });

  // 使用 toast.promise 显示加载、成功、失败状态
  toast.promise(promise, {
    loading: "提交中...",
    success: "提交成功！",
    error: (err) => err.message || "提交失败"
  });

  try {
    const result = await promise;
    console.log(result.data);
  } catch (err) {
    console.error(err);
  }
}
```

### 错误类型

```typescript
import { ApiError } from "@/lib/request/types";

try {
  await get("/api/data");
} catch (err) {
  if (err instanceof ApiError) {
    console.log("错误码:", err.code);
    console.log("错误信息:", err.message);
    console.log("错误数据:", err.data);
  }
}
```

---

## 缓存策略

### Next.js Revalidate（推荐）

```typescript
import { get } from "@/lib/request/server";

// 1. 缓存 60 秒
const response = await get("/api/data", undefined, {
  next: { revalidate: 60 }
});

// 2. 永久缓存
const response = await get("/api/static", undefined, {
  next: { revalidate: false }
});

// 3. 不缓存
const response = await get("/api/dynamic", undefined, {
  next: { revalidate: 0 }
});

// 4. 使用标签（可按需重新验证）
const response = await get("/api/posts", undefined, {
  next: {
    revalidate: 300,
    tags: ["posts"]
  }
});
```

### 标准 Fetch Cache

```typescript
import { get } from "@/lib/request/server";

// 1. 强制缓存
const response = await get("/api/data", undefined, {
  cache: "force-cache"
});

// 2. 不缓存
const response = await get("/api/data", undefined, {
  cache: "no-store"
});

// 3. 重新加载
const response = await get("/api/data", undefined, {
  cache: "reload"
});

// 4. 如果新鲜则使用缓存
const response = await get("/api/data", undefined, {
  cache: "no-cache"
});
```

### 按需重新验证

```typescript
// Server Action
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

// 重新验证路径
export async function revalidatePostsPage() {
  revalidatePath("/posts");
}

// 重新验证标签
export async function revalidatePostsData() {
  revalidateTag("posts");
}

// 重新验证特定文章
export async function revalidatePost(id: string) {
  revalidateTag(`post-${id}`);
  revalidatePath(`/posts/${id}`);
}
```

### 缓存最佳实践

```typescript
// 1. 静态配置 - 永久缓存
const config = await get("/config", undefined, {
  next: { revalidate: false }
});

// 2. 公开文章列表 - 缓存 5 分钟
const posts = await get("/posts", undefined, {
  next: {
    revalidate: 300,
    tags: ["posts"]
  }
});

// 3. 用户数据 - 不缓存
const user = await get("/user/profile");  // 默认 no-store

// 4. 统计数据 - 缓存 1 小时
const stats = await get("/stats", undefined, {
  next: { revalidate: 3600 }
});
```

---

## 高级用法

### 自定义请求头

```typescript
import { get, post } from "@/lib/request/client";

// 添加自定义头
const response = await get("/api/data", undefined, {
  headers: {
    "X-Custom-Header": "custom-value",
    "Accept-Language": "zh-CN"
  }
});

// POST 请求自定义头
const response = await post("/api/data", body, {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});
```

### 请求超时

```typescript
import { get } from "@/lib/request/client";

// 设置 5 秒超时
const response = await get("/api/slow", undefined, {
  timeout: 5000
});

// 服务器端也支持
import { get as serverGet } from "@/lib/request/server";
const response = await serverGet("/api/slow", undefined, {
  timeout: 10000
});
```

### 跳过 401 自动跳转

```typescript
import { get } from "@/lib/request/client";

// 默认：401 会自动清除 token 并跳转到登录页
const response = await get("/api/protected");

// 禁用自动跳转
const response = await get("/api/protected", undefined, {
  skipAuthRedirect: true
});
```

### 手动管理 Token

```typescript
import { setToken, clearToken, getToken } from "@/lib/request/client";

// 登录成功后保存 token
setToken("your-jwt-token", 720);  // 720 分钟 = 12 小时

// 获取当前 token
const token = getToken();

// 登出时清除 token
clearToken();
```

### 服务器端手动传 Token

```typescript
import { get } from "@/lib/request/server";

// 从其他地方获取 token
const customToken = "custom-jwt-token";

// 手动传入 token
const response = await get("/api/data", undefined, {
  token: customToken
});
```

### 动态请求方法

```typescript
import { http } from "@/lib/request/client";

function makeRequest(method: "GET" | "POST", url: string, data?: any) {
  return http(method, url, {
    searchParams: method === "GET" ? data : undefined,
    body: method === "POST" ? data : undefined
  });
}

// 使用
await makeRequest("GET", "/api/users", { page: 1 });
await makeRequest("POST", "/api/users", { name: "张三" });
```

---

## 最佳实践

### 1. 类型安全

```typescript
// 定义响应类型
interface User {
  id: string;
  name: string;
  email: string;
}

interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

// 使用类型
const response = await get<PaginatedResponse<User>>("/users");
const users = response.data.list;  // 类型安全
```

### 2. 错误处理

```typescript
"use client";

import { get } from "@/lib/request/client";
import { toast } from "@/lib/utils/toast";

async function fetchData() {
  try {
    const response = await get<Data>("/api/data");
    // 成功处理
    toast.success("加载成功");
    return response.data;
  } catch (err) {
    // 错误已自动显示 Toast
    console.error("Failed to fetch:", err);
    return null;
  }
}
```

### 3. 缓存策略

```typescript
// 根据数据特性选择缓存策略
import { get } from "@/lib/request/server";

// 静态数据 - 永久缓存
const config = await get("/config", undefined, {
  next: { revalidate: false }
});

// 半静态数据 - 长时间缓存
const categories = await get("/categories", undefined, {
  next: { revalidate: 3600 }  // 1 小时
});

// 动态数据 - 短时间缓存
const posts = await get("/posts", undefined, {
  next: { revalidate: 60 }  // 1 分钟
});

// 实时数据 - 不缓存
const liveData = await get("/live");  // 默认 no-store
```

### 4. 统一的 API 服务层

```typescript
// services/user.ts
import { get, post, put, del } from "@/lib/request/client";

export const userService = {
  getUser: (id: string) => get<User>(`/users/${id}`),

  getUsers: (params: { page: number; size: number }) =>
    get<PaginatedResponse<User>>("/users", params),

  createUser: (data: CreateUserDto) =>
    post<User>("/users", data),

  updateUser: (id: string, data: UpdateUserDto) =>
    put<User>(`/users/${id}`, data),

  deleteUser: (id: string) =>
    del<void>(`/users/${id}`)
};

// 使用
import { userService } from "@/services/user";

const user = await userService.getUser("123");
const users = await userService.getUsers({ page: 1, size: 10 });
```

### 5. 组合使用

```typescript
// 页面组件（Server Component）
import { get } from "@/lib/request/server";
import { RefreshButton } from "./RefreshButton";
import { ServerErrorToast } from "@/components/ServerErrorToast";

export default async function Page() {
  let data = null;
  let errorMessage = null;

  try {
    const response = await get("/api/data", undefined, {
      next: { revalidate: 60 }
    });
    data = response.data;
  } catch (err) {
    errorMessage = err.message;
  }

  return (
    <div>
      <ServerErrorToast error={errorMessage} />
      <RefreshButton />
      {data && <DataView data={data} />}
    </div>
  );
}

// 刷新按钮（Client Component）
"use client";

export function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await get("/api/data");
      toast.success("刷新成功");
      router.refresh();
    } catch (err) {
      // 错误已自动显示 Toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleRefresh} disabled={loading}>
      {loading ? "刷新中..." : "刷新"}
    </button>
  );
}
```

---

## API 参考

### 请求函数

#### 客户端 (`@/lib/request/client`)

```typescript
function get<T>(url: string, searchParams?, options?): Promise<ApiResponse<T>>
function post<T>(url: string, body?, options?): Promise<ApiResponse<T>>
function put<T>(url: string, body?, options?): Promise<ApiResponse<T>>
function del<T>(url: string, options?): Promise<ApiResponse<T>>
function patch<T>(url: string, body?, options?): Promise<ApiResponse<T>>
function http<T>(method, url, options?): Promise<ApiResponse<T>>
```

#### 服务器端 (`@/lib/request/server`)

```typescript
function get<T>(url: string, searchParams?, options?): Promise<ApiResponse<T>>
function post<T>(url: string, body?, options?): Promise<ApiResponse<T>>
function put<T>(url: string, body?, options?): Promise<ApiResponse<T>>
function del<T>(url: string, options?): Promise<ApiResponse<T>>
function patch<T>(url: string, body?, options?): Promise<ApiResponse<T>>
function http<T>(method, url, options?): Promise<ApiResponse<T>>
```

### RequestOptions

```typescript
interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  searchParams?: Record<string, string | number | boolean>;
  body?: unknown;
  timeout?: number;
  skipAuthRedirect?: boolean;
  showErrorToast?: boolean;  // 客户端专用
  token?: string;  // 服务器端专用
  next?: {  // 服务器端专用
    revalidate?: number | false;
    tags?: string[];
  };
  cache?: RequestCache;  // 服务器端专用
}
```

### ApiResponse

```typescript
interface ApiResponse<T = unknown> {
  code: number;      // 业务状态码
  data: T;           // 实际数据
  message: string;   // 提示信息
}
```

---

## 常见问题

### Q: 客户端和服务器端有什么区别？

**客户端** (`@/lib/request/client`):
- 用于 Client Component (`"use client"`)
- 自动携带 cookies
- 401 错误自动跳转登录页
- 错误自动显示 Toast
- 不支持缓存配置

**服务器端** (`@/lib/request/server`):
- 用于 Server Component
- 支持 Next.js 缓存策略
- 可以手动传 token
- 错误需要通过 `ServerErrorToast` 组件显示

### Q: 为什么服务器端错误不能直接显示 Toast？

因为 Server Component 渲染时无法修改 cookies（Next.js 限制）。

**解决方案**：使用 `ServerErrorToast` 组件

```typescript
// Server Component
export default async function Page() {
  let errorMessage = null;

  try {
    await get("/api/data");
  } catch (err) {
    errorMessage = err.message;
  }

  return (
    <div>
      <ServerErrorToast error={errorMessage} />
    </div>
  );
}
```

### Q: 如何禁用自动错误 Toast？

```typescript
const response = await get("/api/data", undefined, {
  showErrorToast: false
});
```

### Q: 缓存配置只在服务器端有效吗？

是的。客户端请求不支持缓存配置，因为浏览器端的请求通常需要实时数据。

---

## 总结

| 场景 | 使用方式 | Toast 支持 | 缓存支持 |
|------|---------|-----------|---------|
| Client Component | `@/lib/request/client` | ✅ 自动 | ❌ |
| Server Component | `@/lib/request/server` | ✅ 通过组件 | ✅ |

选择原则：
- 需要交互 → Client Component + 客户端请求
- 需要 SEO → Server Component + 服务器端请求

---

**文档版本**: 1.0.0
**最后更新**: 2025-01-06
