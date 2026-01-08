'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type ServiceItem = {
  id: string
  name: string
  icon?: string
  description: string
  href: string
}

export function ServicesGrid({
  services,
  className,
}: {
  services: ServiceItem[]
  className?: string
}) {
  if (!services?.length) return null

  return (
    <section className={cn('w-full px-4 py-12 md:py-16', className)}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            核心服务
          </h2>
          <p className="text-muted-foreground">
            为您提供全方位的专业服务
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-center">
          {services.map((service) => (
            <Link key={service.id} href={service.href} className="group">
              <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-pointer overflow-hidden bg-gradient-to-br from-background to-muted/20">
                <CardContent className="p-8 pb-0 md:pb-4 flex flex-col h-full">
                  {service.icon && (
                    <div className="mb-6 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl group-hover:bg-primary/20 transition-colors duration-300"></div>
                        <div className="relative text-5xl md:text-6xl p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform duration-300">
                          {service.icon}
                        </div>
                      </div>
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed grow">
                    {service.description}
                  </p>
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <span className="text-primary text-sm font-medium group-hover:translate-x-1 inline-block transition-transform duration-300">
                      了解更多 →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

