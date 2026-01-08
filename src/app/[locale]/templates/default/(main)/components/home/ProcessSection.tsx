'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type ProcessItem = {
  id: string
  step: number
  title: string
  description: string
  icon?: string
}

export function ProcessSection({
  processes,
  className,
}: {
  processes: ProcessItem[]
  className?: string
}) {
  if (!processes?.length) return null

  return (
    <section className={cn('w-full px-4 py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5', className)}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            服务流程
          </h2>
          <p className="text-muted-foreground">
            专业规范的服务流程，确保项目成功
          </p>
        </div>
        <div className="relative">
          {/* 连接线（桌面端显示） */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-primary/20" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
            {processes.map((process) => (
              <div key={process.id} className="relative">
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    {/* 步骤编号 */}
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4 z-10">
                      {process.step}
                    </div>
                    
                    {process.icon && (
                      <div className="text-3xl mb-3">{process.icon}</div>
                    )}
                    
                    <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                    <p className="text-sm text-muted-foreground">{process.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

