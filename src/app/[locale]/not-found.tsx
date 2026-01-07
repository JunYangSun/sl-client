import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/BackButton";

export default async function NotFound() {
  const t = await getTranslations("error.notFound");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="text-4xl font-bold text-blue-600">404</div>
          </div>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            {t("reasons")}
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{t("reason1")}</li>
              <li>{t("reason2")}</li>
              <li>{t("reason3")}</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/">{t("backHome")}</Link>
            </Button>
            <BackButton />
          </div>

          <div className="text-xs text-gray-500 mt-4">
            {t("support")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}