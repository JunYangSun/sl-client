import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "./config";

/**
 * 动态加载指定语言的所有翻译模块
 * 自动合并 messages/{locale}/ 目录下的所有 JSON 文件
 */
async function loadMessages(locale: string) {
  // 定义所有模块文件名
  const modules = ["common", "nav", "auth", "home", "list", "error", "search"];

  // 动态导入所有模块并合并
  const messages: Record<string, Record<string, string>> = {};

  for (const moduleName of modules) {
    const moduleMessages = (
      await import(`./messages/${locale}/${moduleName}.json`)
    ).default;
    messages[moduleName] = moduleMessages;
  }

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取请求的语言，如果不在支持列表中则使用默认语言
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
