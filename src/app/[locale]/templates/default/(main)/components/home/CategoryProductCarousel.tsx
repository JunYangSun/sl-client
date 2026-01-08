'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CarouselCore } from '@/components/common/carousel/CarouselCore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, ChevronRight, ChevronLeft } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

// 定义 Embla API 类型
type EmblaCarouselType = ReturnType<typeof useEmblaCarousel>[1]

export type ProductItem = {
  id: string
  title: string
  subtitle?: string
  price?: number
  image: string
  badge?: string
  href?: string
}

export function ProductRowCarousel<T extends ProductItem = ProductItem>({
  title,
  subtitle,
  items,
  viewAllHref,
  className,
}: {
  title?: string
  subtitle?: string
  items: T[]
  viewAllHref?: string
  className?: string
}) {
  const [emblaApi, setEmblaApi] = React.useState<EmblaCarouselType>()
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)

  React.useEffect(() => {
    if (!emblaApi) return
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
    }
    update()
    emblaApi.on('select', update)
    emblaApi.on('reInit', update)
    return () => {
      emblaApi.off('select', update)
      emblaApi.off('reInit', update)
    }
  }, [emblaApi])

  if (!items?.length) return null

  return (
    <section className={cn('w-full', className)}>
      {(title || viewAllHref) && (
        <div className="mb-3 flex items-end justify-between gap-4 px-4 md:px-0">
          <div>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {subtitle && (
              <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {viewAllHref && (
            <Button asChild className="rounded-full px-5">
              <Link href={viewAllHref}>查看全部</Link>
            </Button>
          )}
        </div>
      )}

      <div className="relative">
        {/* 渐隐边缘（可选） */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />

        <CarouselCore<T>
          items={items}
          options={{
            align: 'start',
            containScroll: 'trimSnaps',
            dragFree: true,
            loop: false,
          }}
          showArrows={false}
          showDots={false}
          viewportClassName="overflow-hidden"
          trackClassName="gap-4 py-2"
          slideClassName={() =>
            `
            flex-[0_0_210px]
            sm:flex-[0_0_220px]
            md:flex-[0_0_230px]
          `
          }
          onApi={setEmblaApi}
          renderItem={(p) => (
            <Card className="relative h-full rounded-2xl p-3">
              {p.badge && (
                <Badge className="absolute left-3 top-3 bg-red-500 text-white hover:bg-red-500">
                  {p.badge}
                </Badge>
              )}

              <div className="relative mx-auto mt-6 h-32 w-32">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="128px"
                  className="object-contain opacity-90"
                />
              </div>

              <div className="mt-3 space-y-1">
                <div className="line-clamp-1 text-sm font-medium">{p.title}</div>
                {p.subtitle && (
                  <div className="line-clamp-1 text-xs text-muted-foreground">
                    {p.subtitle}
                  </div>
                )}
              </div>

              {p.price !== undefined && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-base font-semibold">{p.price}</div>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    aria-label="Add to cart"
                    onClick={() => console.log('add to cart', p.id)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {p.href && (
                <Link href={p.href} className="absolute inset-0 rounded-2xl">
                  <span className="sr-only">Open product</span>
                </Link>
              )}
            </Card>
          )}
        />

        {/* 左右按钮：逻辑完全对称 */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:block">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full shadow"
            disabled={!canPrev}
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:block">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full shadow"
            disabled={!canNext}
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
