import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false,
  localePrefix: "as-needed",
});

const PROTECTED_PATHS = ["/list"];

function stripLocale(pathname: string) {
  // 不要写死 zh|en，直接用 locales
  const localePattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`);
  return pathname.replace(localePattern, "") || "/";
}

function isProtectedPath(pathname: string): boolean {
  const p = stripLocale(pathname);
  return PROTECTED_PATHS.some((path) => p === path || p.startsWith(`${path}/`));
}

function isAuthPage(pathname: string): boolean {
  const p = stripLocale(pathname);
  return p === "/login" || p === "/register";
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // 先让 next-intl 处理（在 redirect 时直接返回）
  const intlResponse = intlMiddleware(request);
  const isRedirect = intlResponse.headers.has("location");
  if (isRedirect) return intlResponse;

  // 1. 已登录访问登录/注册 -> /
  if (isAuthPage(pathname) && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 2. 未登录访问受保护页 -> /{locale}/login
  if (isProtectedPath(pathname) && !token) {
    const url = request.nextUrl.clone();

    const matchedLocale = locales.find(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
    );
    const localePrefix = matchedLocale ? `/${matchedLocale}` : `/${defaultLocale}`; // as-needed：默认语言不加前缀
    url.pathname = `${localePrefix}/login`;

    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 3. 模板检测
  let template = request.cookies.get("template")?.value;
  const templateParam = request.nextUrl.searchParams.get("template");
  if (templateParam) template = templateParam;

  if (!template) {
    const host = request.headers.get("host") ?? "";
    if (host === "marerex.com") template = "enterprise";
    else if (host === "junyos.com") template = "default";
  }
  if (!template) template = "default";

  // 4. 计算 locale + 去掉 locale 后的 path
  const matchedLocale = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  const locale = matchedLocale ?? defaultLocale;

  // 内部路由结构是 /[locale]/templates/...
  // 即便外部 as-needed 不展示默认语言前缀，内部也要强制带上 /{locale}
  const localePrefixInternal = `/${locale}`;
  const pathWithoutLocale = stripLocale(pathname);

  if (pathWithoutLocale.startsWith("/templates/")) {
    return intlResponse; // 已经是内部路由了，不重复改写
  }

  const url = request.nextUrl.clone();
  url.pathname = `${localePrefixInternal}/templates/${template}${pathWithoutLocale || "/"}`;

  // 关键：把 x-next-intl-locale 注入回“请求头覆盖”，否则语言会丢
  const headers = new Headers(request.headers);
  headers.set("x-next-intl-locale", locale);

  const response = NextResponse.rewrite(url, { request: { headers } });

  // 把 next-intl 产生的 cookies 带上
  for (const cookie of intlResponse.cookies.getAll()) {
    response.cookies.set(cookie);
  }

  response.cookies.set("template", template, {
    path: "/",
    httpOnly: process.env.NODE_ENV === "production",
  });

  response.headers.set("x-template", template);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
