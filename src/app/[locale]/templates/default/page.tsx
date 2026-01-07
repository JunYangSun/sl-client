import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getHomeData } from "@/lib/logic/pages/home";

/**
 * 默认模板 - 首页（Server Component）
 * 使用响应式布局适配移动端、平板端、桌面端
 */
export default async function DefaultPage() {
  // 在服务器端获取数据
  const data = await getHomeData();
  const { hero, features, cta } = data;

  return (
    <div className="w-full">
      {/* Hero Section - 响应式 */}
      <section className="w-full px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 md:mb-6">
            {hero.title}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href={hero.primaryButton.href}>{hero.primaryButton.text}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href={hero.secondaryButton.href}>{hero.secondaryButton.text}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - 响应式网格 */}
      <section className="w-full px-4 py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {features.map((feature) => (
              <Card key={feature.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  {feature.icon && (
                    <div className="text-3xl md:text-4xl mb-2">{feature.icon}</div>
                  )}
                  <CardTitle className="text-lg md:text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {feature.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - 响应式 */}
      <section className="w-full px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            {cta.title}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8">
            {cta.description}
          </p>
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href={cta.buttonHref}>{cta.buttonText}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
