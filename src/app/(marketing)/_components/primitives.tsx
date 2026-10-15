import type React from "react";

import { cn } from "@/lib/utils";

/**
 * Visual primitives of the landing page (dark-only, after raycast.com): glossy light buttons,
 * hairline cards lit by a coloured glow, keycaps and two-tone headings.
 */

/** Light, glossy pill: the primary call to action on a dark page. */
export const glossyButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-white to-neutral-300 px-5 text-sm font-medium text-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_0_1px_rgba(0,0,0,0.5),0_8px_24px_-8px_rgba(255,255,255,0.25)] transition hover:from-white hover:to-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080a]";

/** Quiet dark button with a hairline border. */
export const ghostButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-neutral-200 transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

export const glows = {
  blue: "rgba(59,130,246,0.32)",
  violet: "rgba(139,92,246,0.32)",
  green: "rgba(34,197,94,0.26)",
  amber: "rgba(245,158,11,0.26)",
  red: "rgba(239,68,68,0.30)",
  cyan: "rgba(34,211,238,0.24)",
  pink: "rgba(236,72,153,0.26)",
  none: "transparent",
} as const;

export type Glow = keyof typeof glows;

export function GlowCard({
  glow = "none",
  from = "top",
  className,
  children,
}: {
  glow?: Glow;
  from?: "top" | "bottom";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0d10]", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(110% 70% at 50% ${from === "top" ? "0%" : "100%"}, ${glows[glow]} 0%, transparent 65%)` }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function Keycap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-white/10 bg-gradient-to-b from-white/[0.10] to-white/[0.03] px-1.5 font-sans text-[11px] font-medium text-neutral-300 shadow-[inset_0_-1px_0_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/** "Statement. Continuation." — the white sentence carries the point, the grey one the detail. */
export function TwoTone({
  id,
  lead,
  rest,
  align = "center",
  size = "lg",
  className,
}: {
  id: string;
  lead: string;
  rest?: string;
  align?: "center" | "left";
  size?: "lg" | "md";
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "text-balance font-semibold tracking-[-0.03em]",
        size === "lg" ? "text-3xl leading-[1.1] sm:text-5xl" : "text-2xl leading-[1.2] sm:text-3xl",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      )}
    >
      <span className="text-white">{lead}</span>
      {rest && <span className="text-neutral-500"> {rest}</span>}
    </h2>
  );
}

/** Small monospace caption, the way Raycast labels facts and figures. */
export function Mono({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-mono text-xs tracking-tight text-neutral-500", className)}>{children}</span>;
}
