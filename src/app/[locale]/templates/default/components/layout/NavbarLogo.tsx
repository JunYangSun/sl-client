"use client";

import { Link } from "@/i18n/navigation";
import type { LayoutData } from "@/lib/logic/common/layout";

interface NavbarLogoProps {
  brand: LayoutData["brand"];
}

/**
 * Navbar Logo 组件
 */
export default function NavbarLogo({ brand }: NavbarLogoProps) {
  return (
    <Link
      href={brand.href}
      className="text-lg md:text-xl font-bold text-foreground shrink-0"
    >
      {brand.name}
    </Link>
  );
}

