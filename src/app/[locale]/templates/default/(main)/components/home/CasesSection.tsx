'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type CaseItem = {
  id: string
  title: string
  description: string
  image: string
  category?: string
  href?: string
}

export function CasesSection({
  cases,
  className,
}: {
  cases: CaseItem[]
  className?: string
}) {
  if (!cases?.length) return null

  return (
    <section className={cn('w-full px-4 py-12 md:py-16', className)}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            成功案例
          </h2>
          <p className="text-muted-foreground">
            见证我们的专业实力
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cases.map((caseItem) => (
            <Link key={caseItem.id} href={caseItem.href || '#'}>
              <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image
                    src={caseItem.image}
                    alt={caseItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {caseItem.category && (
                    <Badge className="absolute top-4 right-4 bg-primary/90">
                      {caseItem.category}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{caseItem.title}</h3>
                  <p className="text-muted-foreground">{caseItem.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

