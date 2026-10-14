"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Search01Icon, SidebarLeftIcon } from "@hugeicons/core-free-icons";
import { parseAsString, useQueryState } from "nuqs";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useCommandMenu } from "@/stores/command-menu.store";

import { Kbd } from "./kbd";

interface PageHeaderProps {
  title: string;
  icon?: IconSvgElement;
  description?: string;
  /** Contextual actions on the right (the page's primary action goes last). */
  actions?: React.ReactNode;
  /** Optional content before the title, e.g. a back link. */
  leading?: React.ReactNode;
  menu?: React.ReactNode;
}

/** Top bar of every authenticated page: title on the left, search and actions on the right. */
export function PageHeader({ title, icon, description, actions, leading, menu }: PageHeaderProps) {
  const { toggleSidebar } = useSidebar();
  const commandMenu = useCommandMenu();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleSidebar}
        className="md:hidden"
        aria-label="Abrir navegação"
      >
        <HugeiconsIcon icon={SidebarLeftIcon} />
      </Button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        {leading}
        {icon && <HugeiconsIcon icon={icon} className="size-[18px] shrink-0 text-foreground" aria-hidden />}
        <h1 className="truncate text-[15px] font-semibold tracking-tight">{title}</h1>
        {menu}
        {description && (
          <p className="ml-2 hidden truncate border-l pl-3 text-sm text-muted-foreground xl:block">{description}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          className="hidden gap-2 text-muted-foreground sm:inline-flex"
          onClick={commandMenu.open}
          aria-keyshortcuts="Control+K Meta+K"
        >
          <HugeiconsIcon icon={Search01Icon} />
          Pesquisar
          <Kbd className="ml-2">⌘K</Kbd>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="sm:hidden"
          onClick={commandMenu.open}
          aria-label="Pesquisar"
        >
          <HugeiconsIcon icon={Search01Icon} />
        </Button>
        {actions}
      </div>
    </header>
  );
}

export interface PageTab {
  value: string;
  label: string;
  icon?: IconSvgElement;
  count?: number;
}

interface PageTabsProps {
  tabs: PageTab[];
  /** Controls on the right of the tab bar (group, sort, view, filter). */
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  /** Query-string key, so a tab can be linked to and survives reloads. */
  param?: string;
}

/** Tab bar under the page header, synced with the URL (`?tab=`). */
export function PageTabs({ tabs, toolbar, children, param = "tab" }: PageTabsProps) {
  const [value, setValue] = useQueryState(param, parseAsString.withDefault(tabs[0].value));

  return (
    <Tabs value={value} onValueChange={(next) => setValue(next === tabs[0].value ? null : next)} className="flex flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-card px-4 py-2 md:px-6">
        <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-8 gap-2 rounded-lg border border-transparent px-3 text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
            >
              {tab.icon && <HugeiconsIcon icon={tab.icon} className="size-4" aria-hidden />}
              {tab.label}
              {tab.count !== undefined && (
                <span className="tabular text-xs text-muted-foreground">{tab.count}</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {toolbar && <div className="ml-auto flex flex-wrap items-center gap-2">{toolbar}</div>}
      </div>
      {children}
    </Tabs>
  );
}

export function PageTabPanel({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <TabsContent value={value} className={cn("mt-0 flex-1 focus-visible:ring-inset", className)}>
      {children}
    </TabsContent>
  );
}

/** Scrollable page content area with consistent spacing. */
export function PageBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1440px] flex-1 space-y-6 p-4 md:p-6", className)}>{children}</div>;
}

/** Small heading for a group of content inside a page, like "Previous 7 days" in a list. */
export function SectionHeading({
  title,
  count,
  action,
  id,
}: {
  title: string;
  count?: number;
  action?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 id={id} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {title}
        {count !== undefined && <span className="tabular text-xs underline underline-offset-4">{count}</span>}
      </h2>
      {action}
    </div>
  );
}
