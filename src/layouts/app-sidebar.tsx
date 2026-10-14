"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ComputerIcon,
  Logout03Icon,
  Moon02Icon,
  MoreHorizontalIcon,
  PaintBoardIcon,
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
import { Kbd } from "@/components/common/kbd";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { footerNav, type NavItem, navGroups, primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { companies, currentUser } from "@/mocks/people";
import { useLogoutMutation } from "@/queries/auth/mutation";
import { toastService } from "@/services/toast.service";
import { useActiveCompany } from "@/stores/company.store";
import { useCommandMenu } from "@/stores/command-menu.store";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** `notify`: the badge is something to act on (unread, pending), so the collapsed rail shows a dot. */
function NavLink({ item, pathname, notify = false }: { item: NavItem; pathname: string; notify?: boolean }) {
  const active = isActive(pathname, item.href);
  const { setOpenMobile } = useSidebar();
  const tooltip = item.badge !== undefined ? `${item.title} · ${item.badge}` : item.title;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={tooltip} className="relative">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          aria-label={item.badge !== undefined ? `${item.title}, ${item.badge}` : undefined}
          onClick={() => setOpenMobile(false)}
        >
          <HugeiconsIcon icon={item.icon} aria-hidden />
          <span className="group-data-[collapsible=icon]:sr-only">{item.title}</span>
          {notify && item.badge ? (
            <span
              aria-hidden
              className="absolute right-1.5 top-1.5 hidden size-2 rounded-full bg-primary ring-2 ring-sidebar group-data-[collapsible=icon]:block"
            />
          ) : null}
        </Link>
      </SidebarMenuButton>
      {item.badge !== undefined && (
        <SidebarMenuBadge aria-hidden className="text-[11px] font-normal text-muted-foreground underline underline-offset-2">
          {item.badge}
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}

function CompanyLogo({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 text-xs font-bold text-white",
        className,
      )}
    >
      {name[0]}
    </span>
  );
}

function CompanySwitcher() {
  const { company, setCompany } = useActiveCompany();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" aria-label={`Empresa: ${company.shortName}`} className="h-10 flex-1 data-[state=open]:bg-sidebar-accent">
          <CompanyLogo name={company.shortName} />
          <span className="flex min-w-0 flex-1 items-center gap-1 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-foreground">{company.shortName}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
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
            <CompanyLogo name={item.shortName} />
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

function ThemeMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip="Aparência">
            <HugeiconsIcon icon={PaintBoardIcon} aria-hidden />
            <span className="group-data-[collapsible=icon]:sr-only">Aparência</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="w-44">
          <DropdownMenuLabel>Tema</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light" className="gap-2">
              <HugeiconsIcon icon={Sun03Icon} className="size-4" aria-hidden /> Claro
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark" className="gap-2">
              <HugeiconsIcon icon={Moon02Icon} className="size-4" aria-hidden /> Escuro
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system" className="gap-2">
              <HugeiconsIcon icon={ComputerIcon} className="size-4" aria-hidden /> Sistema
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function UserMenu() {
  const router = useRouter();
  const logout = useLogoutMutation();
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <>
      <ConfirmDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Terminar sessão?"
        description={<p>Alterações por guardar nesta página perdem-se.</p>}
        confirmLabel="Terminar sessão"
        onConfirm={() => logout.mutate(undefined, { onSettled: () => router.push("/login") })}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="h-11 rounded-xl border bg-card shadow-xs data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:shadow-none"
          >
            <PersonAvatar name={currentUser.name} size="xs" />
            <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <span className="block truncate font-medium text-foreground">{currentUser.name}</span>
            </span>
            <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" aria-hidden />
            <span className="sr-only">Menu do utilizador</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <span className="block font-medium">{currentUser.name}</span>
            <span className="block text-xs text-muted-foreground">{currentUser.email}</span>
            <span className="mt-1 block text-xs text-muted-foreground">{currentUser.role}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="gap-2">
            <Link href="/settings?tab=profile">
              <HugeiconsIcon icon={UserCircleIcon} className="size-4" aria-hidden /> O meu perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="gap-2">
            <Link href="/portal">
              <HugeiconsIcon icon={SmartPhone01Icon} className="size-4" aria-hidden /> Portal do trabalhador
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onSelect={() => setConfirmLogout(true)}>
            <HugeiconsIcon icon={Logout03Icon} className="size-4" aria-hidden /> Terminar sessão
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const commandMenu = useCommandMenu();
  const { toggleSidebar, state } = useSidebar();
  const contentRef = useRef<HTMLDivElement>(null);

  // Keep the current page visible in a long (or collapsed) navigation list.
  useEffect(() => {
    contentRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [pathname, state]);

  return (
    <Sidebar collapsible="icon" role="navigation" aria-label="Navegação principal">
      <SidebarHeader className="gap-3 border-b border-sidebar-border px-3 pb-3 pt-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1 group-data-[collapsible=icon]:justify-center">
            <CompanySwitcher />
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground md:inline-flex group-data-[collapsible=icon]:hidden"
              aria-label="Recolher navegação"
              aria-keyshortcuts="Control+B Meta+B"
            >
              <HugeiconsIcon icon={SidebarLeftIcon} className="size-[18px]" aria-hidden />
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} tooltip="Expandir navegação · ⌘B" aria-keyshortcuts="Control+B Meta+B">
              <HugeiconsIcon icon={SidebarLeftIcon} aria-hidden />
              <span className="sr-only">Expandir navegação</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <button
          type="button"
          onClick={commandMenu.open}
          aria-label="Pesquisar"
          className="flex h-9 w-full items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:bg-sidebar-accent hover:text-foreground group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          aria-keyshortcuts="/"
        >
          <HugeiconsIcon icon={Search01Icon} className="size-4 shrink-0" aria-hidden />
          <span className="flex-1 text-left group-data-[collapsible=icon]:sr-only">Pesquisar</span>
          <Kbd className="group-data-[collapsible=icon]:hidden">/</Kbd>
        </button>
      </SidebarHeader>

      <SidebarContent ref={contentRef} className="gap-0 py-2 [scrollbar-width:none] group-data-[collapsible=icon]:overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <SidebarGroup className="py-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {primaryNav.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} notify />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-3 my-2 group-data-[collapsible=icon]:hidden" />

        {navGroups.map((group) => (
          <Collapsible key={group.id} defaultOpen className="group/collapsible">
            <SidebarGroup className="py-1">
              <div aria-hidden className="mx-auto mb-1 hidden h-px w-6 bg-sidebar-border group-data-[collapsible=icon]:block" />
              <CollapsibleTrigger className="flex h-8 w-full items-center gap-1.5 rounded-md px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:hidden">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90"
                  aria-hidden
                />
                {group.title}
              </CollapsibleTrigger>
              <CollapsibleContent forceMount className="data-[state=closed]:hidden group-data-[collapsible=icon]:!block">
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0.5">
                    {group.items.map((item) => (
                      <NavLink key={item.href} item={item} pathname={pathname} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-sidebar-border p-3 group-data-[collapsible=icon]:px-2">
        <SidebarMenu className="gap-0.5">
          <ThemeMenu />
          {footerNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
