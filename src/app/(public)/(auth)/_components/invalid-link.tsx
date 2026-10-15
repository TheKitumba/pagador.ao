import { HugeiconsIcon } from "@hugeicons/react";
import { LinkBackwardIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/app";

/** A link from an e-mail that is missing its token, or that the API rejected as expired or used. */
export function InvalidLink({ title, description, action }: { title: string; description: string; action: "forgot" | "login" }) {
  return (
    <div role="status" className="text-center">
      <span className="mx-auto inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
        <HugeiconsIcon icon={LinkBackwardIcon} className="size-5" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Button asChild className="btn-glossy mt-8 h-10 w-full">
        {action === "forgot" ? <Link href={ROUTES.forgotPassword}>Pedir nova ligação</Link> : <Link href={ROUTES.login}>Ir para a entrada</Link>}
      </Button>
    </div>
  );
}
