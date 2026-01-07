import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { locales, type Locale } from "@/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADOS Client",
  description: "ADOS客户端应用",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: false,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const storedMode = cookies().get("theme-mode")?.value;
  const isDark = storedMode === "dark";

  // 验证语言参数
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 获取翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale} className={isDark ? "dark" : undefined} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var stored=localStorage.getItem('theme-storage');if(!stored){return;}var data=JSON.parse(stored);var mode=data&&data.state&&data.state.mode;var root=document.documentElement;if(mode==='dark'){root.classList.add('dark');}else if(mode==='light'){root.classList.remove('dark');}}catch(e){}})();",
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
            <ToastProvider />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// 生成静态参数（用于静态生成）
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
