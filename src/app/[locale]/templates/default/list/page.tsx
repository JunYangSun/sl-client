import { get } from "@/lib/request/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { CreateRoleButton } from "./CreateRoleButton";
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

export default async function AgentListPage() {
  const t = await getTranslations("list");

  let agents: Agent[] = [];
  let total = 0;
  let errorMessage: string | null = null;

  // 获取状态翻译的辅助函数
  const getStatusText = (status: string) => {
    try {
      // return t(`status.${status}` as any);
      return status;
    } catch {
      return status;
    }
  };

  try {
    // 添加延迟以便看到 loading 效果（开发测试用，生产环境请删除）
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Server Component 初始加载
    const response = await get<AgentListResponse>("/admin/agent/list");
    agents = response.data?.records || [];
    total = response.data?.total || 0;
  } catch (err) {
    // 捕获错误信息，传递给客户端组件显示 Toast
    errorMessage = err instanceof Error ? err.message : "加载失败，请重试";
    console.error("Failed to fetch agent list:", err);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 服务器端错误 Toast */}
      <ServerErrorToast error={errorMessage} />

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-gray-600 mt-2">
            {t("description")} {total > 0 && t("totalCount", { count: total })}
          </p>
        </div>
        <div className="flex gap-2">
          {/* <RefreshButton /> */}
          <CreateRoleButton />
        </div>
      </div>

      {agents.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            {t("noData")}
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
                    {getStatusText(agent.status)}
                  </span>
                </div>
                {agent.type && (
                  <CardDescription className="mt-1">
                    {t("type")} {agent.type}
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
                      {t("createdAt")}{" "}
                      {new Date(agent.createdAt).toLocaleString()}
                    </div>
                  )}
                  {agent.updatedAt && (
                    <div>
                      {t("updatedAt")}{" "}
                      {new Date(agent.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 渲染方式说明 */}
      <Card className="mt-6 bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <p className="text-sm text-green-800">
            <strong>服务器端渲染 (get):</strong> 此页面使用 Server Component + get 方法。{" "}
            <Link href="/server-list" className="text-green-600 hover:text-green-700 underline font-medium">
              查看 serverHttp 版本
            </Link>
            {" | "}
            <Link href="/clinet-list" className="text-green-600 hover:text-green-700 underline font-medium">
              查看客户端渲染版本
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
