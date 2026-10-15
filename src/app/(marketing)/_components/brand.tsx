import Link from "next/link";

import { APP_NAME, ROUTES } from "@/config/app";
import { cn } from "@/lib/utils";

/** The product mark, as in the auth layout and onboarding header. */
export function Brand({ className }: { className?: string }) {
  return (
    <Link href={ROUTES.home} className={cn("flex items-center gap-2 rounded-md font-semibold tracking-tight", className)}>
      <span aria-hidden className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-sm font-bold text-white">
        P
      </span>
      {APP_NAME}
    </Link>
  );
}
