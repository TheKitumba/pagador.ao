import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { ArrowDownRight01Icon, ArrowRight01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import type React from "react";

import { cn } from "@/lib/utils";

import type { Tone } from "./status-badge";

const iconTone: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
};

export function IconTile({ icon, tone = "neutral", className }: { icon: IconSvgElement; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-lg", iconTone[tone], className)}>
      <HugeiconsIcon icon={icon} className="size-[18px]" aria-hidden />
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon?: IconSvgElement;
  tone?: Tone;
  /** e.g. "+2,4%" — the sign decides the arrow; `positive` decides if it is good news. */
  delta?: { value: string; positive: boolean; direction: "up" | "down" };
  hint?: string;
  href?: string;
  className?: string;
}

export function StatCard({ label, value, icon, tone = "neutral", delta, hint, href, className }: StatCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <IconTile icon={icon} tone={tone} className="size-8" />}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular">{value}</p>
      {(delta || hint) && (
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                delta.positive ? "text-success" : "text-destructive",
              )}
            >
              <HugeiconsIcon
                icon={delta.direction === "up" ? ArrowUpRight01Icon : ArrowDownRight01Icon}
                className="size-3.5"
                aria-hidden
              />
              {delta.value}
            </span>
          )}
          {hint}
        </p>
      )}
    </>
  );

  const classes = cn("block min-w-0 rounded-xl border bg-card p-4 shadow-card", className);

  return href ? (
    <Link href={href} className={cn(classes, "transition-colors hover:border-foreground/15 hover:bg-accent/40")}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
}

export function StatGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>{children}</div>;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: IconSvgElement;
  href?: string;
  onClick?: () => void;
}

/** Large entry point to a frequent task, as in the "New document" cards of the reference design. */
export function QuickActionCard({ title, description, icon, href, onClick }: QuickActionProps) {
  const content = (
    <>
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/60 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <HugeiconsIcon icon={icon} className="size-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">{title}</span>
        <span className="block truncate text-[13px] text-muted-foreground">{description}</span>
      </span>
    </>
  );
  const classes =
    "group flex w-full items-center gap-3 rounded-xl border bg-card p-3.5 text-left shadow-card transition-colors hover:border-foreground/15 hover:bg-accent/40";

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}

export function QuickActions({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

interface SectionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Link shown in the header as "Ver tudo". */
  href?: string;
}

export function SectionCard({ title, description, action, children, className, contentClassName, href }: SectionCardProps) {
  const headingId = `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section aria-labelledby={headingId} className={cn("flex min-w-0 flex-col rounded-xl border bg-card shadow-card", className)}>
      <div className="flex flex-col gap-3 px-5 pb-3 pt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 id={headingId} className="text-[15px] font-semibold tracking-tight">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
        {href && !action && (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 rounded-md text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Ver tudo
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" aria-hidden />
          </Link>
        )}
      </div>
      <div className={cn("flex-1 px-5 pb-5", contentClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: IconSvgElement;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 px-6 py-12 text-center">
      <IconTile icon={icon} className="size-11" />
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function DescriptionList({ items, columns = 2 }: { items: { label: string; value: React.ReactNode }[]; columns?: 1 | 2 | 3 }) {
  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="mt-0.5 break-words text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProgressBar({ value, tone = "info", label }: { value: number; tone?: Tone; label: string }) {
  const bar: Record<Tone, string> = {
    neutral: "bg-muted-foreground",
    info: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
    violet: "bg-violet-500",
  };

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
    >
      <div className={cn("h-full rounded-full", bar[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
