import { ROUTES } from "./app";

/**
 * Who may open which page. Shared by `src/proxy.ts` (on the server, from the access token's claims)
 * and by the app shells (in the browser, from GET /auth/me). It only shapes navigation: the API
 * authorises every request on its own (docs/05, 5.3), so these rules are never the last line.
 */

/** Pages anyone can open. */
const PUBLIC = [ROUTES.home, "/careers"];
/** Only for signed-out visitors: a signed-in user is sent to their home page. */
const GUEST_ONLY = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword];
/** Open either way: a link from an e-mail may arrive while another account is signed in. */
const FROM_EMAIL = [ROUTES.resetPassword, ROUTES.acceptInvitation];

function matches(pathname: string, prefix: string) {
  return prefix === "/" ? pathname === "/" : pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isGuestOnlyPath(pathname: string) {
  return GUEST_ONLY.some((prefix) => matches(pathname, prefix));
}

export function isPublicPath(pathname: string) {
  return [...PUBLIC, ...GUEST_ONLY, ...FROM_EMAIL].some((prefix) => matches(pathname, prefix));
}

export function isPortalPath(pathname: string) {
  return matches(pathname, ROUTES.portal);
}

/**
 * Back-office pages and the permissions that open them (any one is enough). Mirrors the checks of
 * the matching API module. Pages not listed are open to every back-office user.
 */
export const PAGE_PERMISSIONS: Record<string, readonly string[]> = {
  "/employees": ["employees.read", "team.read"],
  "/organization": ["organization.read"],
  "/contracts": ["contracts.read"],
  "/recruitment": ["recruitment.read"],
  "/attendance": ["attendance.read", "attendance.approve"],
  "/schedules": ["attendance.read"],
  "/leave": ["leave.read", "leave.approve"],
  "/overtime": ["overtime.read", "overtime.approve"],
  "/timesheets": ["attendance.read", "attendance.approve"],
  "/payroll": ["payroll.read"],
  "/payments": ["payments.read"],
  "/benefits": ["compensation.read"],
  "/loans": ["compensation.read", "payroll.read"],
  "/reimbursements": ["payroll.read"],
  "/tax-filings": ["tax.read"],
  "/terminations": ["contracts.read"],
  "/performance": ["performance.read"],
  "/feedback": ["performance.read"],
  "/training": ["training.read"],
  "/reports": ["reports.read"],
  "/disciplinary": ["disciplinary.read"],
  "/safety": ["safety.read"],
  "/invoices": ["invoices.read"],
  "/audit": ["audit.read"],
  "/settings": ["settings.read", "settings.write", "users.manage"],
};

/** Permissions required by the most specific rule for a pathname, if any. */
export function requiredPermissions(href: string): readonly string[] | undefined {
  const pathname = href.split(/[?#]/)[0];
  const prefix = Object.keys(PAGE_PERMISSIONS)
    .filter((candidate) => matches(pathname, candidate))
    .sort((a, b) => b.length - a.length)[0];
  return prefix ? PAGE_PERMISSIONS[prefix] : undefined;
}

export function canOpen(permissions: readonly string[], pathname: string) {
  const required = requiredPermissions(pathname);
  return !required || required.some((permission) => permissions.includes(permission));
}

export interface AccessSubject {
  roles: readonly string[];
  employeeId: string | null;
}

/** Workers with no other role use only the employee portal. */
export function isEmployeeOnly(roles: readonly string[]) {
  return roles.every((role) => role === "EMPLOYEE");
}

export function homePath(subject: AccessSubject) {
  return isEmployeeOnly(subject.roles) ? ROUTES.portal : ROUTES.dashboard;
}

/** Where to send a signed-in user who opened the wrong area, or null if the page is theirs. */
export function areaRedirect(pathname: string, subject: AccessSubject): string | null {
  if (isPortalPath(pathname)) {
    // The portal shows one worker's own data. An employee-only account without that link stays
    // there (it explains the problem) rather than bouncing between the two areas.
    return subject.employeeId || isEmployeeOnly(subject.roles) ? null : ROUTES.dashboard;
  }
  return isEmployeeOnly(subject.roles) ? ROUTES.portal : null;
}

/** Same-site paths only, so `?next=` cannot be used as an open redirect. */
export function safeNextPath(next: string | null | undefined) {
  return next?.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : null;
}
