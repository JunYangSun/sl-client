/**
 * 响应式断点配置
 * 基于 Tailwind CSS 默认断点，结合项目需求定制
 */

export const BREAKPOINTS = {
  // 移动设备: 0 - 767px
  mobile: '0px',

  // 平板设备: 768px - 1023px
  tablet: '768px',

  // 桌面设备: 1024px+
  desktop: '1024px',

  // 大屏设备: 1280px+
  wide: '1280px',
} as const;

/**
 * Tailwind 响应式断点配置
 * 对应 tailwind.config.ts 中的 screens 配置
 *
 * 使用方式:
 * - 默认样式: 移动端优先 (mobile-first)
 * - md: 平板及以上 (≥768px)
 * - lg: 桌面及以上 (≥1024px)
 * - xl: 大屏及以上 (≥1280px)
 *
 * 示例:
 * <div className="text-sm md:text-base lg:text-lg">
 *   移动端小字，平板中等，桌面大字
 * </div>
 *
 * <div className="hidden md:block">
 *   只在平板和桌面显示
 * </div>
 *
 * <div className="block md:hidden">
 *   只在移动端显示
 * </div>
 */
export const RESPONSIVE_CLASSES = {
  // 显示/隐藏
  showOnMobile: 'block md:hidden',
  showOnTablet: 'hidden md:block lg:hidden',
  showOnDesktop: 'hidden lg:block',
  hideOnMobile: 'hidden md:block',
  hideOnTablet: 'block md:hidden lg:block',
  hideOnDesktop: 'block lg:hidden',

  // 容器
  container: 'w-full mx-auto px-4 md:px-6 lg:px-8',
  containerNarrow: 'w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8',

  // 间距
  spacing: {
    section: 'py-8 md:py-12 lg:py-16',
    item: 'p-4 md:p-6 lg:p-8',
  },

  // 网格
  grid: {
    auto: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
    responsive: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
  },

  // 文字
  text: {
    heading: 'text-2xl md:text-3xl lg:text-4xl',
    title: 'text-xl md:text-2xl lg:text-3xl',
    body: 'text-sm md:text-base',
  },
} as const;

/**
 * 获取响应式类名的辅助函数
 */
export function getResponsiveClass(key: keyof typeof RESPONSIVE_CLASSES): string {
  return RESPONSIVE_CLASSES[key] as string;
}
