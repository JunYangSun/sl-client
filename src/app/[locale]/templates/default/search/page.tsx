import { getTranslations } from "next-intl/server";
import { get } from "@/lib/request/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServerErrorToast } from "@/components/ServerErrorToast";
import SearchInput from "@/components/ui/SearchBox";
import { SearchResults } from "./components/SearchResults";

// 强制动态渲染（因为需要根据查询参数动态显示结果）
export const dynamic = "force-dynamic";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url?: string;
  type?: string;
  createdAt?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const t = await getTranslations("search");

  let results: SearchResult[] = [];
  let total = 0;
  let errorMessage: string | null = null;

  // 如果有搜索关键词，调用搜索 API
  if (query.trim()) {
    try {
      // TODO: 替换为实际的搜索 API 端点
      // const response = await get<SearchResponse>("/search", {
      //   q: query.trim(),
      // });
      // results = response.data?.results || [];
      // total = response.data?.total || 0;

      // 模拟搜索结果（开发测试用）
      await new Promise((resolve) => setTimeout(resolve, 500));
      results = [
        {
          id: "1",
          title: `搜索结果示例 1 - ${query}`,
          description: `这是关于 "${query}" 的搜索结果描述。`,
          url: "/example/1",
          type: "article",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: `搜索结果示例 2 - ${query}`,
          description: `另一个关于 "${query}" 的搜索结果。`,
          url: "/example/2",
          type: "page",
          createdAt: new Date().toISOString(),
        },
      ];
      total = results.length;
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : t("error");
      console.error("Failed to fetch search results:", err);
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {/* 服务器端错误 Toast */}
      <ServerErrorToast error={errorMessage} />

      {/* 页面标题和搜索框 */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          {t("title")}
        </h1>
        <SearchInput defaultValue={query} />
      </div>

      {/* 搜索结果 */}
      {!query.trim() ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            {t("noQuery")}
          </CardContent>
        </Card>
      ) : (
        <SearchResults
          query={query}
          results={results}
          total={total}
          isLoading={false}
        />
      )}
    </div>
  );
}

