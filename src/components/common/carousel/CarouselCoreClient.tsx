'use client'

import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// 定义 Embla 选项类型
type EmblaOptionsType = Parameters<typeof useEmblaCarousel>[0]
// 定义 Embla API 类型
type EmblaCarouselType = ReturnType<typeof useEmblaCarousel>[1]

type CarouselAutoplay = {
  enabled?: boolean
  delay?: number
  stopOnInteraction?: boolean
}

export function CarouselCoreClient({
  targetId,
  options,
  autoplay,
  showArrows,
  showDots,
  onApi,
  onIndexChange,
}: {
  targetId: string
  options?: EmblaOptionsType
  autoplay?: CarouselAutoplay
  showArrows: boolean
  showDots: boolean
  onApi?: (api: EmblaCarouselType | undefined) => void
  onIndexChange?: (index: number) => void
}) {
  const autoplayPlugin = React.useMemo(() => {
    if (!autoplay?.enabled) return null
    return Autoplay({
      delay: autoplay.delay ?? 4500,
      stopOnInteraction: autoplay.stopOnInteraction ?? false,
    })
  }, [autoplay?.enabled, autoplay?.delay, autoplay?.stopOnInteraction])

  const plugins = React.useMemo(() => (autoplayPlugin ? [autoplayPlugin] : []), [autoplayPlugin])

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', ...options },
    plugins
  )

  const [index, setIndex] = React.useState(0)
  const [snapCount, setSnapCount] = React.useState(0)
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)

  // 把 Embla ref 挂到 SSR 输出的 viewport 上
  React.useEffect(() => {
    const root = document.getElementById(targetId)
    const viewport = root?.querySelector('[data-carousel-viewport]') as HTMLElement | null
    if (!viewport) return
    emblaRef(viewport)
  }, [targetId, emblaRef])

  // 监听 Embla 状态变化（index、按钮禁用）
  React.useEffect(() => {
    onApi?.(emblaApi ?? undefined)
    if (!emblaApi) return

    const update = () => {
      const i = emblaApi.selectedScrollSnap()
      setIndex(i)
      setSnapCount(emblaApi.scrollSnapList().length)
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
      onIndexChange?.(i)
    }

    update()
    emblaApi.on('select', update)
    emblaApi.on('reInit', update)

    return () => {
      emblaApi.off('select', update)
      emblaApi.off('reInit', update)
    }
  }, [emblaApi, onApi, onIndexChange])

  if (!showArrows && !showDots) return null

  return (
    <>
      {showArrows && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto rounded-full shadow"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto rounded-full shadow"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {showDots && snapCount > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'h-2 w-2 rounded-full transition',
                i === index ? 'bg-foreground' : 'bg-muted'
              )}
            />
          ))}
        </div>
      )}
    </>
  )
}
