import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: number
  period: string
  trend: "up" | "down"
  children?: React.ReactNode
}

export function MetricCard({ title, value, change, period, trend, children }: MetricCardProps) {
  const isPositive = trend === "up"

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          <div className="flex items-center gap-1 text-sm">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span className={cn("font-medium", isPositive ? "text-green-600" : "text-red-600")}>
              {Math.abs(change)}%
            </span>
            <span className="text-muted-foreground">{period}</span>
          </div>
        </div>
        {children && <div className="h-20">{children}</div>}
      </CardContent>
    </Card>
  )
}
