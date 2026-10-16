"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Home01Icon, Invoice01Icon, Logout03Icon, TaskDaily01Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";

import { PersonAvatar } from "@/components/common/person-avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/app";
import { cn } from "@/lib/utils";
import { useSession } from "@/providers/session-provider";
import { useLogoutMutation } from "@/queries/auth/mutation";
import { useCompaniesQuery } from "@/queries/organization/query";

const portalNav = [
  { href: "/portal", label: "Início", icon: Home01Icon },
  { href: "/portal/payslips", label: "Recibos", icon: Invoice01Icon },
  { href: "/portal/time", label: "Ponto", icon: Clock01Icon },
  { href: "/portal/requests", label: "Pedidos", icon: TaskDaily01Icon },
  { href: "/portal/profile", label: "Perfil", icon: UserCircleIcon },
];

/** Worker self-service: phone-first, bottom navigation on small screens, top tabs on larger ones. */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSession();
  const logout = useLogoutMutation();
  const companyName = useCompaniesQuery().data?.find((company) => company.current)?.tradeName ?? "";
  const isActive = (href: string) => (href === "/portal" ? pathname === href : pathname.startsWith(href));

  return (
    <div className="min-h-dvh bg-background pb-20 md:pb-0">
      <a
        href="#portal-content"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar para o conteúdo
      </a>
      <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4">
          <span className="flex items-center gap-2 font-semibold">
            <span aria-hidden className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-xs font-bold text-white">
              {companyName[0] ?? "P"}
            </span>
            <span className="truncate">{companyName}</span>
          </span>
          <div className="flex items-center gap-1">
            <Link href="/portal/profile" className="rounded-full" aria-label={`Perfil de ${user.name}`}>
              <PersonAvatar name={user.name} />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Terminar sessão"
              disabled={logout.isPending}
              onClick={() => logout.mutate(undefined, { onSettled: () => router.replace(ROUTES.login) })}
            >
              <HugeiconsIcon icon={Logout03Icon} aria-hidden />
            </Button>
          </div>
        </div>
        <nav aria-label="Portal do trabalhador" className="mx-auto hidden max-w-3xl px-4 md:block">
          <ul className="flex gap-1">
            {portalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium",
                    isActive(item.href) ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <HugeiconsIcon icon={item.icon} className="size-4" aria-hidden />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="portal-content" tabIndex={-1} className="mx-auto max-w-3xl space-y-6 px-4 py-6 outline-none">
        {children}
      </main>

      <nav aria-label="Portal do trabalhador" className="fixed inset-x-0 bottom-0 z-20 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <ul className="grid grid-cols-5">
          {portalNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground",
                )}
              >
                <HugeiconsIcon icon={item.icon} className="size-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
