"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const periods = [
  { label: "30 Dias", value: "30d" },
  { label: "3 Meses", value: "3m" },
  { label: "1 Ano", value: "1y" },
]

export function TimePeriodSelector() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant="ghost"
          size="sm"
          onClick={() => setSelectedPeriod(period.value)}
          className={cn(
            "h-8 px-3 text-sm font-medium transition-colors",
            selectedPeriod === period.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {period.label}
        </Button>
      ))}
    </div>
  )
}
