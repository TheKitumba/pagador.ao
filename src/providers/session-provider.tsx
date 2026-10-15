"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect } from "react";

import { ApiError } from "@api/lib/api-error";
import { ROLE_LABEL, type SessionUser } from "@api/types/auth";
import { Button } from "@/components/ui/button";
import { areaRedirect, canOpen, homePath } from "@/config/access";
import { useSessionQuery } from "@/queries/auth/query";

const SessionContext = createContext<SessionUser | null>(null);

/** The signed-in user. Only inside <SessionGate>, which renders nothing until the session is known. */
export function useSession(): SessionUser {
  const user = useContext(SessionContext);
  if (!user) throw new Error("useSession() must be used inside <SessionGate>");
  return user;
}

/** Whether the user has at least one of the permissions. */
export function useCan(...permissions: string[]) {
  const user = useSession();
  return permissions.some((permission) => user.permissions.includes(permission));
}

function FullPageStatus({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      {children}
    </div>
  );
}

/**
 * Loads the session (GET /auth/me) before rendering a protected area, and sends the user to the
 * right one (back office or portal). A 401 never reaches here: the API client refreshes the session
 * or goes to /login.
 */
export function SessionGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSessionQuery();
  const user = session.data;
  const target = user ? areaRedirect(pathname, user) : null;

  useEffect(() => {
    if (target) router.replace(target);
  }, [target, router]);

  if (session.isError && !ApiError.from(session.error).isUnauthorized) {
    return (
      <FullPageStatus>
        <p className="font-medium">Não foi possível abrir a sua conta</p>
        <p className="max-w-sm text-sm text-muted-foreground">{ApiError.from(session.error).message}</p>
        <Button variant="outline" onClick={() => session.refetch()}>
          Tentar de novo
        </Button>
      </FullPageStatus>
    );
  }

  if (!user || target) {
    return (
      <FullPageStatus>
        <span aria-hidden className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <span className="sr-only">A abrir a sua conta…</span>
      </FullPageStatus>
    );
  }

  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
}

/** Renders the page only if the user's permissions open it (config/access.ts), otherwise explains why. */
export function PageAccess({ children }: { children: ReactNode }) {
  const user = useSession();
  const pathname = usePathname();
  if (canOpen(user.permissions, pathname)) return children;

  const roles = user.roles.map((role) => ROLE_LABEL[role]).join(", ");
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md text-center">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <HugeiconsIcon icon={LockIcon} className="size-5" aria-hidden />
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-tight">Sem acesso a esta página</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O seu papel ({roles}) não inclui esta área. Se precisa dela, peça acesso a um administrador da conta.
        </p>
        <Button asChild className="mt-6">
          <Link href={homePath(user)}>Ir para o início</Link>
        </Button>
      </div>
    </div>
  );
}
