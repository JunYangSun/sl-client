// 首页第一个轮播图组件
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CarouselCore } from '@/components/common/carousel/CarouselCore'

type HeroSlide = {
  id: string
  img: string
  alt: string
  href?: string
  title?: string
  subtitle?: string
}

type HeroCarouselProps = {
  slides: HeroSlide[]
  className?: string
  viewportClassName?: string
  slideClassName?: string
  mediaClassName?: string
  imageClassName?: string

  showArrows?: boolean
  showDots?: boolean
  overlay?: 'none' | 'gradient'
  /** 控制图片“盛满/适配” */
  fit?: 'cover' | 'contain'
  /** 控制裁切位置（object-position） */
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  /**（响应式比例），用 aspectClassName */
  aspect?: '16/7' | '16/9' | '21/9' | '4/5' | '1/1'
  /** 比例/高度控制（优先级高于 aspect） */
  aspectClassName?: string
  /** contain 模式下的背景（避免留白太突兀） */
  containBgClassName?: string
}

const aspectMap: Record<NonNullable<HeroCarouselProps['aspect']>, string> = {
  '16/7': 'aspect-[16/7]',
  '16/9': 'aspect-[16/9]',
  '21/9': 'aspect-[21/9]',
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
}

const positionMap: Record<NonNullable<HeroCarouselProps['position']>, string> = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
}

export function HeroCarousel({
  slides,
  className,
  viewportClassName,
  slideClassName,
  mediaClassName,
  imageClassName,
  showArrows = true,
  showDots = true,
  overlay = 'gradient',

  fit = 'cover',
  position = 'center',
  aspect = '16/7',
  aspectClassName,
  containBgClassName = 'bg-muted',
}: HeroCarouselProps) {
  if (!slides?.length) return null

  const mediaAspect = aspectClassName ?? aspectMap[aspect]
  const objectFitClass = fit === 'cover' ? 'object-cover' : 'object-contain'
  const objectPosClass = positionMap[position]
  const containBg = fit === 'contain' ? containBgClassName : undefined

  return (
    <CarouselCore
      items={slides}
      options={{ loop: true }}
      autoplay={{ enabled: true, delay: 4500, stopOnInteraction: false }}
      showArrows={showArrows}
      showDots={showDots}
      className={cn('w-full', className)}
      viewportClassName={cn('rounded-2xl overflow-hidden', viewportClassName)}
      slideClassName={() => cn('flex-[0_0_100%]', slideClassName)}
      renderItem={(s, idx) => {
        const content = (
          <div className={cn('relative w-full transition-all duration-300 ease-in-out', mediaAspect, mediaClassName)}>
            <Image
              src={s.img}
              alt={s.alt}
              fill
              priority={idx === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 1920px"
              className={cn('transition-all duration-300 ease-in-out', objectFitClass, objectPosClass, containBg, imageClassName)}
            />

            {overlay === 'gradient' && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            )}

            {(s.title || s.subtitle) && (
              <div className="absolute bottom-4 left-4 right-4 text-white">
                {s.title && <div className="text-xl font-semibold">{s.title}</div>}
                {s.subtitle && <div className="mt-1 text-sm text-white/90">{s.subtitle}</div>}
              </div>
            )}
          </div>
        )

        return s.href ? (
          <Link href={s.href} className="block">
            {content}
          </Link>
        ) : (
          content
        )
      }}
    />
  )
}
