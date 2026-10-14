import type React from "react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "received" | "pending" | "processed" | "failed"
  children: React.ReactNode
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", {
        "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400": status === "received",
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400": status === "pending",
        "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400": status === "processed",
        "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400": status === "failed",
      })}
    >
      <div
        className={cn("w-1.5 h-1.5 rounded-full", {
          "bg-green-500": status === "received",
          "bg-yellow-500": status === "pending",
          "bg-blue-500": status === "processed",
          "bg-red-500": status === "failed",
        })}
      />
      {children}
    </span>
  )
}
