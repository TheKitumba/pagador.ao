"use client";

import { useRouter, useSearchParams } from "next/navigation";

import type { SessionUser } from "@api/types/auth";
import { homePath, safeNextPath } from "@/config/access";

/** After signing in: back to the page that asked for it (`?next=`), or to the user's home area. */
export function useAfterSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (user: SessionUser) => router.replace(safeNextPath(searchParams.get("next")) ?? homePath(user));
}
