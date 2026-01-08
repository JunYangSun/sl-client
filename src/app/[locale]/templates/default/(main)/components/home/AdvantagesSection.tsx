'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type AdvantageItem = {
  id: string
  title: string
  description: string
  icon?: string
}

export function AdvantagesSection({
  advantages,
  className,
}: {
  advantages: AdvantageItem[]
  className?: string
}) {
  if (!advantages?.length) return null

  return (
    <section className={cn('w-full px-4 py-12 md:py-16 bg-muted/30', className)}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            服务优势
          </h2>
          <p className="text-muted-foreground">
            为什么选择我们
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {advantages.map((advantage) => (
            <Card key={advantage.id} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {advantage.icon && (
                  <div className="text-4xl md:text-5xl mb-4">{advantage.icon}</div>
                )}
                <h3 className="text-lg font-semibold mb-2">{advantage.title}</h3>
                <p className="text-sm text-muted-foreground">{advantage.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

