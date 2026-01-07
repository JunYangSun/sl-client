"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url?: string;
  type?: string;
  createdAt?: string;
}

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  total: number;
  isLoading?: boolean;
}

/**
 * 搜索结果列表组件
 */
export function SearchResults({
  query,
  results,
  total,
  isLoading = false,
}: SearchResultsProps) {
  const t = useTranslations("search");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          {t("noResults", { query })}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 搜索结果统计 */}
      <div className="text-sm text-muted-foreground">
        {t("resultsCount", { count: total, query })}
      </div>

      {/* 搜索结果列表 */}
      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg md:text-xl">
                  {result.url ? (
                    <Link
                      href={result.url}
                      className="text-primary hover:underline"
                    >
                      {result.title}
                    </Link>
                  ) : (
                    result.title
                  )}
                </CardTitle>
                {result.type && (
                  <Badge variant="secondary" className="shrink-0">
                    {result.type}
                  </Badge>
                )}
              </div>
              {result.description && (
                <CardDescription className="mt-2">
                  {result.description}
                </CardDescription>
              )}
            </CardHeader>
            {result.createdAt && (
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {new Date(result.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

