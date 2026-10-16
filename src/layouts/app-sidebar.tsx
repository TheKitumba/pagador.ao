"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Logout03Icon,
  Moon02Icon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  Search01Icon,
  SidebarLeftIcon,
  SmartPhone01Icon,
  Sun03Icon,
  Tick02Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ROLE_LABEL } from "@api/types/auth";
import { ROUTES } from "@/config/app";
import { type NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { companies } from "@/mocks/people";
import { useSession } from "@/providers/session-provider";
import { useLogoutMutation } from "@/queries/auth/mutation";
import { toastService } from "@/services/toast.service";
import { useActiveCompany } from "@/stores/company.store";
import { useCommandMenu } from "@/stores/command-menu.store";

import { useVisibleNav } from "./use-visible-nav";

/*
 * Floating card navigation: logo, search pill and one action on top; roomy icon + label rows with a
 * soft active fill; hairline separators between groups; a sun/moon toggle and the user at the bottom.
 * Collapsed, it becomes an icon rail with the same order.
 */

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Round icon button for the header (expanded) or the rail (collapsed). */
function IconButton({ label, onClick, icon, shortcut }: { label: string; onClick: () => void; icon: typeof SidebarLeftIcon; shortcut?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          aria-keyshortcuts={shortcut}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          <HugeiconsIcon icon={icon} className="size-5" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

/** `notify`: the badge is something to act on (unread, pending), so the collapsed rail shows a dot. */
function NavLink({ item, pathname, notify = false }: { item: NavItem; pathname: string; notify?: boolean }) {
  const active = isActive(pathname, item.href);
  const { setOpenMobile } = useSidebar();
  const tooltip = item.badge !== undefined ? `${item.title} · ${item.badge}` : item.title;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={tooltip}
        className="relative text-[14.5px] text-sidebar-foreground data-[active=true]:font-medium data-[active=true]:text-foreground [&>svg]:text-muted-foreground data-[active=true]:[&>svg]:text-foreground"
      >
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          aria-label={item.badge !== undefined ? `${item.title}, ${item.badge}` : undefined}
          onClick={() => setOpenMobile(false)}
        >
          <HugeiconsIcon icon={item.icon} aria-hidden />
          <span className="min-w-0 flex-1 truncate group-data-[collapsible=icon]:sr-only">{item.title}</span>
          {item.badge !== undefined && (
            <span
              aria-hidden
              className={cn(
                "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-medium tabular-nums group-data-[collapsible=icon]:hidden",
                active ? "bg-sidebar text-foreground" : "bg-sidebar-accent text-muted-foreground",
              )}
            >
              {item.badge}
            </span>
          )}
          {notify && item.badge ? (
            <span aria-hidden className="absolute right-2 top-2 hidden size-2 rounded-full bg-primary ring-2 ring-sidebar group-data-[collapsible=icon]:block" />
          ) : null}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function CompanyLogo({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]",
        className,
      )}
    >
      {name[0]}
    </span>
  );
}

/** The logo is the company switcher (multi-company accounts). */
function CompanySwitcher() {
  const { company, setCompany } = useActiveCompany();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label={`Empresa: ${company.shortName}. Mudar de empresa`} className="shrink-0 rounded-xl outline-none ring-sidebar-ring focus-visible:ring-2">
              <CompanyLogo name={company.shortName} />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">{company.shortName}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Empresas do grupo</DropdownMenuLabel>
        {companies.map((item) => (
          <DropdownMenuItem
            key={item.nif}
            className="gap-3 py-2"
            onSelect={() => {
              if (item.nif === company.nif) return;
              setCompany(item.nif);
              toastService.success("Empresa alterada", item.name);
            }}
          >
            <CompanyLogo name={item.shortName} className="size-7 rounded-lg text-xs" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{item.name}</span>
              <span className="block text-xs text-muted-foreground">NIF {item.nif}</span>
            </span>
            {item.nif === company.nif && <HugeiconsIcon icon={Tick02Icon} className="size-4 text-primary" aria-label="Empresa actual" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=company">Configurar empresa</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Sun / moon segmented control. Horizontal in the card, stacked in the rail. */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only known in the browser; render both segments unselected until then.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const options = [
    { value: "light", label: "Tema claro", icon: Sun03Icon },
    { value: "dark", label: "Tema escuro", icon: Moon02Icon },
  ];

  return (
    <div
      role="group"
      aria-label="Tema"
      className="grid grid-cols-2 gap-1 rounded-full bg-sidebar-accent p-1 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:grid-cols-1 group-data-[collapsible=icon]:rounded-2xl"
    >
      {options.map((option) => {
        const selected = mounted && resolvedTheme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            aria-pressed={selected}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex h-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground group-data-[collapsible=icon]:rounded-xl",
              selected && "bg-white text-foreground shadow-[0_1px_2px_rgb(16_24_40/0.08)] dark:bg-white/[0.09]",
            )}
          >
            <HugeiconsIcon icon={option.icon} className="size-[18px]" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

function UserMenu() {
  const router = useRouter();
  const user = useSession();
  const logout = useLogoutMutation();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const roles = user.roles.map((role) => ROLE_LABEL[role]);

  return (
    <>
      <ConfirmDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Terminar sessão?"
        description={<p>Alterações por guardar nesta página perdem-se.</p>}
        confirmLabel="Terminar sessão"
        onConfirm={() => logout.mutate(undefined, { onSettled: () => router.replace(ROUTES.login) })}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            tooltip={user.name}
            className="h-14 gap-3 px-2 data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:rounded-full"
          >
            <PersonAvatar name={user.name} size="md" status="online" />
            <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <span className="block truncate text-sm font-medium text-foreground">{user.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{roles[0]}</span>
            </span>
            <HugeiconsIcon icon={MoreHorizontalIcon} className="size-5 text-muted-foreground group-data-[collapsible=icon]:hidden" aria-hidden />
            <span className="sr-only">Menu do utilizador</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <span className="block font-medium">{user.name}</span>
            {user.email && <span className="block text-xs text-muted-foreground">{user.email}</span>}
            <span className="mt-1 block text-xs text-muted-foreground">{roles.join(" · ")}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="gap-2">
            <Link href={ROUTES.account}>
              <HugeiconsIcon icon={UserCircleIcon} className="size-4" aria-hidden /> A minha conta
            </Link>
          </DropdownMenuItem>
          {user.employeeId && (
            <DropdownMenuItem asChild className="gap-2">
              <Link href={ROUTES.portal}>
                <HugeiconsIcon icon={SmartPhone01Icon} className="size-4" aria-hidden /> Portal do trabalhador
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onSelect={() => setConfirmLogout(true)}>
            <HugeiconsIcon icon={Logout03Icon} className="size-4" aria-hidden /> Terminar sessão
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

/** Hairline between sections; in the rail, a short centred line. */
function Divider() {
  return <SidebarSeparator className="mx-3 my-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />;
}

export function AppSidebar() {
  const pathname = usePathname();
  const commandMenu = useCommandMenu();
  const { toggleSidebar, state } = useSidebar();
  const contentRef = useRef<HTMLDivElement>(null);
  const nav = useVisibleNav();

  // Keep the current page visible in a long (or collapsed) navigation list.
  useEffect(() => {
    contentRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [pathname, state]);

  return (
    <Sidebar variant="floating" collapsible="icon" role="navigation" aria-label="Navegação principal">
      <SidebarHeader className="px-4 pb-2 pt-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        {/* Expanded: logo · search pill · collapse */}
        <div className="flex items-center gap-1.5 group-data-[collapsible=icon]:hidden">
          <CompanySwitcher />
          <button
            type="button"
            onClick={commandMenu.open}
            aria-keyshortcuts="/ Meta+K Control+K"
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full bg-sidebar-accent px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={Search01Icon} className="size-[18px] shrink-0" aria-hidden />
            <span className="truncate">Pesquisar…</span>
          </button>
          <IconButton label="Recolher navegação · ⌘B" onClick={toggleSidebar} icon={SidebarLeftIcon} shortcut="Control+B Meta+B" />
        </div>

        {/* Collapsed rail: logo · expand */}
        <div className="hidden flex-col items-center gap-1 group-data-[collapsible=icon]:flex">
          <CompanySwitcher />
          <IconButton label="Expandir navegação · ⌘B" onClick={toggleSidebar} icon={MoreVerticalIcon} shortcut="Control+B Meta+B" />
        </div>
      </SidebarHeader>

      <SidebarContent ref={contentRef} className="gap-0 px-1 py-1 [scrollbar-width:none] group-data-[collapsible=icon]:px-0 [&::-webkit-scrollbar]:hidden">
        <SidebarGroup className="py-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
              {nav.primary.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} notify />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {nav.groups.map((group) => (
          <Collapsible key={group.id} defaultOpen className="group/collapsible">
            <Divider />
            <SidebarGroup className="py-1">
              <CollapsibleTrigger className="group/trigger flex h-7 w-full items-center justify-between rounded-md px-3 text-xs font-medium text-muted-foreground/80 hover:text-foreground group-data-[collapsible=icon]:hidden">
                {group.title}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className="size-3.5 opacity-0 transition group-hover/trigger:opacity-100 group-focus-visible/trigger:opacity-100 group-data-[state=closed]/collapsible:-rotate-90 group-data-[state=closed]/collapsible:opacity-100"
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent forceMount className="data-[state=closed]:hidden group-data-[collapsible=icon]:!block">
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                    {group.items.map((item) => (
                      <NavLink key={item.href} item={item} pathname={pathname} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}

        {nav.footer.length > 0 && (
          <>
            <Divider />
            <SidebarGroup className="py-1">
              <SidebarGroupContent>
                <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
                  {nav.footer.map((item) => (
                    <NavLink key={item.href} item={item} pathname={pathname} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="gap-3 px-4 pb-4 pt-0 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <SidebarSeparator className="mx-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />
        <ThemeToggle />
        <SidebarSeparator className="mx-0 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
