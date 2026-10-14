import type React from "react";

import { cn } from "@/lib/utils";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "violet";

const toneStyles: Record<Tone, { badge: string; dot: string }> = {
  neutral: { badge: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground/60" },
  info: { badge: "bg-info/10 text-info-strong border-info/20", dot: "bg-info" },
  success: { badge: "bg-success/10 text-success-strong border-success/20", dot: "bg-success" },
  warning: { badge: "bg-warning/10 text-warning-strong border-warning/25", dot: "bg-warning" },
  danger: { badge: "bg-destructive/10 text-destructive-strong border-destructive/20", dot: "bg-destructive" },
  violet: {
    badge: "bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-300",
    dot: "bg-violet-500",
  },
};

interface StatusBadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

/** Status pill. The text always carries the meaning; colour only reinforces it. */
export function StatusBadge({ tone = "neutral", children, dot = true, className }: StatusBadgeProps) {
  const styles = toneStyles[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        styles.badge,
        className,
      )}
    >
      {dot && <span aria-hidden className={cn("size-1.5 rounded-full", styles.dot)} />}
      {children}
    </span>
  );
}

export function CountBadge({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-muted px-1.5 text-[11px] font-medium tabular text-muted-foreground",
        className,
      )}
    >
      {value}
    </span>
  );
}
