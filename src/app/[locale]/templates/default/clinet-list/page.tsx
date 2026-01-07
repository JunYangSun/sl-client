"use client";

import { useState, useEffect } from "react";
import { get } from "@/lib/request/client";
import { toast } from "@/lib/utils/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export default function TestApiPage() {
  const [data, setData] = useState<AgentListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get<AgentListResponse>("/admin/agent/list");
      setData(response.data);
      toast.success("数据加载成功");
    } catch (err) {
      setError(err as Error);
      // 错误 Toast 会自动显示，不需要手动调用
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时自动请求
  useEffect(() => {
    fetchData();
  }, []);

  const agents = data?.records || [];
  const total = data?.total || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">客户端 API 测试页面</h1>
          <p className="text-gray-600 mt-2">
            使用 fetch 函数测试客户端请求{" "}
            {total > 0 && `(共 ${total} 条数据)`}
          </p>
        </div>
        <Button onClick={() => fetchData()} disabled={loading} className="cursor-pointer">
          {loading ? "刷新中..." : "刷新数据"}
        </Button>
      </div>

      {/* Loading 状态 */}
      {loading && !data && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">加载中...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error 状态 */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">
              请求失败: {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 无数据 */}
      {!loading && !error && agents.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            暂无数据
          </CardContent>
        </Card>
      )}

      {/* 数据列表 */}
      {!error && agents.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, index) => (
            <Card key={`${agent?.id}-${index}`} className={loading ? "opacity-50" : ""}>
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

      {/* 底部说明 */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>客户端渲染 (fetch):</strong> 此页面使用客户端渲染，通过 fetch 函数调用 API。
            点击&quot;刷新数据&quot;按钮可以重新请求接口。{" "}
            <Link href="/list" className="text-blue-600 hover:text-blue-700 underline font-medium">
              查看 serverGet 版本
            </Link>
            {" | "}
            <Link href="/server-list" className="text-blue-600 hover:text-blue-700 underline font-medium">
              查看 serverHttp 版本
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
