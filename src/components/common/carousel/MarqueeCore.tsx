import * as React from 'react'
import { cn } from '@/lib/utils'
import { MarqueeController } from './MarqueeController.client'

// 扩展 CSSProperties 以支持 CSS 自定义属性
type CSSPropertiesWithVars = React.CSSProperties & {
  [key: `--${string}`]: string | number
}

// 用于检查对象是否有 id 属性的类型守卫
function hasId(item: unknown): item is { id: string | number } {
  return typeof item === 'object' && item !== null && 'id' in item
}

export type MarqueeCoreProps<T> = {
  id: string
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  trackClassName?: string
  itemClassName?: (item: T, index: number) => string
  height?: number
  gap?: number
  duration?: number
  reverse?: boolean
  toggleOnClick?: boolean
}

export function MarqueeCore<T>({
  id,
  items,
  renderItem,
  className,
  trackClassName,
  itemClassName,
  height = 56,
  gap = 28,
  duration = 28,
  reverse = false,
  toggleOnClick = true,
}: MarqueeCoreProps<T>) {
  if (!items?.length) return null
  const list = [...items, ...items]

  return (
    <div
      id={id}
      className={cn('mq-root relative overflow-hidden', className)}
      data-pressing="false"
      data-toggled="false"
      data-ignore-hover="false"
      style={
        {
          '--mq-height': `${height}px`,
          '--mq-gap': `${gap}px`,
          '--mq-duration': `${duration}s`,
          touchAction: 'manipulation',
        } as CSSPropertiesWithVars
      }
    >
      <div
        className={cn('mq-track flex w-max items-center', trackClassName)}
        style={{
          height: 'var(--mq-height)',
          gap: 'var(--mq-gap)',
          animation: `${reverse ? 'mq-marquee-r' : 'mq-marquee'} var(--mq-duration) linear infinite`,
        }}
      >
        {list.map((item, idx) => (
          <div
            key={hasId(item) ? `${item.id}-${idx}` : idx}
            className={cn('shrink-0', itemClassName?.(item, idx))}
            style={{ height: 'var(--mq-height)' }}
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      <MarqueeController targetId={id} toggleOnClick={toggleOnClick} />
    </div>
  )
}
