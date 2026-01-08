import * as React from 'react'
import { cn } from '@/lib/utils'
import useEmblaCarousel from 'embla-carousel-react'
import { CarouselCoreClient } from './CarouselCoreClient'

// 定义 Embla 选项类型
type EmblaOptionsType = Parameters<typeof useEmblaCarousel>[0]
// 定义 Embla API 类型
type EmblaCarouselType = ReturnType<typeof useEmblaCarousel>[1]

export type CarouselAutoplay = {
  enabled?: boolean
  delay?: number
  stopOnInteraction?: boolean
}

export type CarouselCoreProps<T> = {
  items: T[]
  options?: EmblaOptionsType
  autoplay?: CarouselAutoplay
  showArrows?: boolean
  showDots?: boolean

  className?: string
  viewportClassName?: string
  trackClassName?: string

  /** 每个 slide 的 class（函数形式方便按 idx 控制） */
  slideClassName?: (item: T, index: number) => string

  /** SSR 渲染内容 */
  renderItem: (item: T, index: number) => React.ReactNode

  /** 客户端回调：拿 embla api */
  onApi?: (api: EmblaCarouselType | undefined) => void

  /** 客户端回调：当前 index（0-based） */
  onIndexChange?: (index: number) => void

  /**
   * 可选：你想自己指定 id（推荐首页模块都写死一个，方便调试）
   * 不传也没关系：内部 useId() 会生成 SSR/CSR 一致的稳定 id
   */
  id?: string
}

export function CarouselCore<T>({
  items,
  options,
  autoplay,
  showArrows = true,
  showDots = true,
  className,
  viewportClassName,
  trackClassName,
  slideClassName,
  renderItem,
  onApi,
  onIndexChange,
  id,
}: CarouselCoreProps<T>) {
  // SSR/CSR 一致的稳定 id（解决 hydration mismatch）
  // 必须在条件返回之前调用 Hook
  const rid = React.useId()
  const rootId = id ?? `carousel-${rid}`

  if (!items?.length) return null

  return (
    <div id={rootId} className={cn('relative w-full', className)} data-carousel-root>
      {/* SSR 输出结构与内容 */}
      <div className={cn('overflow-hidden', viewportClassName)} data-carousel-viewport>
        <div className={cn('flex', trackClassName)} data-carousel-track>
          {items.map((item, idx) => (
            <div
              key={(item as { id?: string | number })?.id ?? idx}
              className={cn(
                'min-w-0',
                slideClassName ? slideClassName(item, idx) : 'flex-[0_0_100%]'
              )}
              data-carousel-slide
            >
              {renderItem(item, idx)}
            </div>
          ))}
        </div>
      </div>

      {/* Client：挂 Embla + arrows/dots + autoplay */}
      <CarouselCoreClient
        targetId={rootId}
        options={options}
        autoplay={autoplay}
        showArrows={showArrows}
        showDots={showDots}
        onApi={onApi}
        onIndexChange={onIndexChange}
      />
    </div>
  )
}
