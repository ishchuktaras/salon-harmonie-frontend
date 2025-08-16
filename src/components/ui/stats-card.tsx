import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-stone-800">{value}</p>
            {trend && (
              <p className={cn("text-sm font-medium mt-1", trend.isPositive ? "text-green-600" : "text-red-600")}>
                {trend.value}
              </p>
            )}
          </div>
          <div className="p-3 bg-sage-50 rounded-lg">
            <Icon className="h-6 w-6 text-sage-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
