"use client";

import { canOpen } from "@/config/access";
import { ROUTES } from "@/config/app";
import { footerNav, type NavGroup, type NavItem, navGroups, primaryNav } from "@/config/navigation";
import { useSession } from "@/providers/session-provider";

/**
 * The navigation the signed-in user can open: pages their permissions allow (config/access.ts),
 * and the employee portal only when the account is linked to a worker. Empty groups are dropped.
 */
export function useVisibleNav() {
  const user = useSession();
  const visible = (item: NavItem) => (item.href === ROUTES.portal ? Boolean(user.employeeId) : canOpen(user.permissions, item.href));

  const groups: NavGroup[] = navGroups.map((group) => ({ ...group, items: group.items.filter(visible) })).filter((group) => group.items.length > 0);
  return { primary: primaryNav.filter(visible), groups, footer: footerNav.filter(visible) };
}
