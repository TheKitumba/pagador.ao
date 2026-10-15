import type React from "react";

import { cn } from "@/lib/utils";

/** Left-aligned, editorial section heading: a quiet kicker, a statement, and an optional lead. */
export function SectionHeading({
  id,
  kicker,
  title,
  children,
  className,
}: {
  id: string;
  kicker?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {kicker && <p className="text-sm font-medium text-muted-foreground">{kicker}</p>}
      <h2 id={id} className="mt-3 text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[2.5rem]">
        {title}
      </h2>
      {children && <div className="mt-5 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
}
