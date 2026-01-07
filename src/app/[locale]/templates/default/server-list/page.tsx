import { get } from "@/lib/request/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServerErrorToast } from "@/components/ServerErrorToast";
import Link from "next/link";

// 强制动态渲染（因为需要用户认证）
export const dynamic = 'force-dynamic';

interface Agent {
  id: string;
  name: string;
  status: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  agentName?: string;
}

interface AgentListResponse {
  records: Agent[];
  total: number;
}

export default async function ServerListPage() {
  let agents: Agent[] = [];
  let total = 0;
  let errorMessage: string | null = null;

  try {
    // 使用 get (实际是 get 函数)
    const response = await get<AgentListResponse>("/admin/agent/list");

    agents = response.data?.records || [];
    total = response.data?.total || 0;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "请求失败";
    console.error("Failed to fetch agent list:", err);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 服务器端错误 Toast */}
      <ServerErrorToast error={errorMessage} />

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">服务器端 get 测试</h1>
          <p className="text-gray-600 mt-2">
            使用 get 统一方法测试服务器端请求{" "}
            {total > 0 && `(共 ${total} 条数据)`}
          </p>
        </div>
      </div>

      {agents.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            暂无数据
          </CardContent>
        </Card>
      )}

      {agents.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, index) => (
            <Card key={`${agent?.id}-${index}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{agent?.agentName}</CardTitle>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      agent.status === "active" || agent.status === "1"
                        ? "bg-green-100 text-green-700"
                        : agent.status === "inactive" || agent.status === "0"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
                {agent.type && (
                  <CardDescription className="mt-1">
                    类型: {agent.type}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {agent.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {agent.description}
                  </p>
                )}
                <div className="space-y-1 text-xs text-gray-500">
                  <div>ID: {agent.id}</div>
                  {agent.createdAt && (
                    <div>
                      创建时间: {new Date(agent.createdAt).toLocaleString()}
                    </div>
                  )}
                  {agent.updatedAt && (
                    <div>
                      更新时间: {new Date(agent.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 使用说明 */}
      <Card className="mt-6 bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm text-purple-800">
              <strong>使用 get 统一方法:</strong>
            </p>
            <pre className="text-xs bg-purple-100 p-3 rounded overflow-x-auto">
{`const data = await get<Response>({
  url: '/admin/agent/list',
  method: 'GET', // GET | POST | PUT | DELETE
  searchParams: { page: 1 }, // 可选
  body: { ... }, // POST/PUT 时使用
  revalidate: 60, // 可选：缓存配置
});`}
            </pre>
            <div className="flex gap-2 mt-3 text-sm">
              <Link
                href="/list"
                className="text-purple-600 hover:text-purple-700 underline font-medium"
              >
                查看 serverGet 版本
              </Link>
              <span className="text-purple-400">|</span>
              <Link
                href="/clinet-list"
                className="text-purple-600 hover:text-purple-700 underline font-medium"
              >
                查看客户端版本
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
