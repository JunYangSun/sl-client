import Image from 'next/image'
import { MarqueeCore } from '@/components/common/carousel/MarqueeCore'
import type { LogoItem } from '@/lib/logic/pages/home/useHomeData'

export function PartnersMarquee({
  logos,
  className,
}: {
  logos: LogoItem[]
  className?: string
}) {
  if (!logos?.length) return null

  return (
    <div className={className}>
      <MarqueeCore
        id="home-partners-marquee"
        items={logos}
        height={64}
        gap={32}
        duration={28}
        toggleOnClick
        renderItem={(it) => (
          <div className="relative h-full w-[180px] opacity-80 hover:opacity-100 transition-opacity">
            <Image
              src={it.img}
              alt={it.alt}
              fill
              className="object-contain"
              sizes="180px"
            />
          </div>
        )}
      />
    </div>
  )
}

