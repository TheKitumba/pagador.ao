import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const gradients = [
  "from-fuchsia-500 via-rose-400 to-amber-300",
  "from-sky-400 via-indigo-500 to-violet-500",
  "from-emerald-400 via-teal-400 to-sky-500",
  "from-orange-400 via-rose-500 to-fuchsia-600",
  "from-violet-500 via-purple-400 to-pink-300",
  "from-blue-500 via-cyan-400 to-emerald-300",
  "from-amber-400 via-orange-500 to-red-500",
];

function hash(value: string) {
  let result = 0;
  for (const char of value) result = (result * 31 + char.charCodeAt(0)) >>> 0;
  return result;
}

const sizes = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl",
};

const statusColor = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-destructive",
};

interface PersonAvatarProps {
  name: string;
  size?: keyof typeof sizes;
  status?: keyof typeof statusColor;
  /** Set when the name is not shown next to the avatar, so screen readers still get it. */
  labelled?: boolean;
  className?: string;
}

/** Deterministic gradient avatar with initials (no photo upload needed). */
export function PersonAvatar({ name, size = "sm", status, labelled = false, className }: PersonAvatarProps) {
  const gradient = gradients[hash(name) % gradients.length];

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? name : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ring-2 ring-card",
          gradient,
          sizes[size],
        )}
      >
        {initials(name)}
      </span>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-card",
            statusColor[status],
          )}
        />
      )}
    </span>
  );
}

export function AvatarStack({ names, max = 3, size = "xs" }: { names: string[]; max?: number; size?: keyof typeof sizes }) {
  const visible = names.slice(0, max);
  const hidden = names.length - visible.length;

  return (
    <span className="flex items-center -space-x-1.5" role="img" aria-label={names.join(", ")}>
      {visible.map((name) => (
        <PersonAvatar key={name} name={name} size={size} />
      ))}
      {hidden > 0 && (
        <span
          aria-hidden
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-card",
            sizes[size],
          )}
        >
          +{hidden}
        </span>
      )}
    </span>
  );
}

export function PersonCell({ name, detail, href }: { name: string; detail?: string; href?: string }) {
  const label = href ? (
    <a href={href} className="font-medium text-foreground hover:underline underline-offset-4">
      {name}
    </a>
  ) : (
    <span className="font-medium text-foreground">{name}</span>
  );

  return (
    <div className="flex min-w-0 items-center gap-3">
      <PersonAvatar name={name} />
      <div className="min-w-0">
        <div className="truncate">{label}</div>
        {detail && <div className="truncate text-xs text-muted-foreground">{detail}</div>}
      </div>
    </div>
  );
}
