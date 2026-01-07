"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function BackButton() {
  const t = useTranslations("error.notFound");

  return (
    <Button variant="outline" onClick={() => window.history.back()}>
      {t("backPrevious")}
    </Button>
  );
}
