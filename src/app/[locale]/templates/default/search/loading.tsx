import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

/**
 * 搜索结果页面加载状态
 */
export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div className="mb-6 md:mb-8">
        <div className="h-8 bg-muted rounded w-48 mb-4 md:mb-6 animate-pulse"></div>
        <div className="h-10 bg-muted rounded w-full md:w-96 animate-pulse"></div>
      </div>

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
    </div>
  );
}

