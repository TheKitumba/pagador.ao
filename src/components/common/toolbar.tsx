"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowUpDownIcon,
  Download04Icon,
  FilterHorizontalIcon,
  GridViewIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { parseAsString, useQueryState } from "nuqs";
import type React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Search box bound to `?q=`, so results can be shared by URL. */
export function SearchField({ label, placeholder, className }: { label: string; placeholder?: string; className?: string }) {
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));

  return (
    <div className={cn("relative w-full sm:w-72", className)}>
      <HugeiconsIcon
        icon={Search01Icon}
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        aria-label={label}
        placeholder={placeholder ?? label}
        value={query}
        onChange={(event) => setQuery(event.target.value || null)}
        className="h-8 pl-9 text-[13px]"
      />
    </div>
  );
}

export function useSearchQuery() {
  const [query] = useQueryState("q", parseAsString.withDefault(""));
  return query.trim().toLocaleLowerCase("pt");
}

export function matches(query: string, ...values: (string | null | undefined)[]) {
  if (!query) return true;
  return values.some((value) => value?.toLocaleLowerCase("pt").includes(query));
}

interface FilterMenuProps {
  label: string;
  param: string;
  options: { value: string; label: string }[];
  icon?: IconSvgElement;
}

/** Single-choice filter bound to a query param; shows the active choice in the button. */
export function FilterMenu({ label, param, options, icon = FilterHorizontalIcon }: FilterMenuProps) {
  const [value, setValue] = useQueryState(param, parseAsString);
  const active = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn(active && "border-primary/40 bg-primary/5 text-primary")}>
          <HugeiconsIcon icon={icon} aria-hidden />
          {active ? `${label}: ${active.label}` : label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setValue(null)}>
          <HugeiconsIcon icon={Tick02Icon} className={cn("size-4", active && "invisible")} aria-hidden />
          Todos
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => setValue(option.value)}>
            <HugeiconsIcon
              icon={Tick02Icon}
              className={cn("size-4", option.value !== value && "invisible")}
              aria-hidden
            />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function useFilter(param: string) {
  const [value] = useQueryState(param, parseAsString);
  return value;
}

export function ToolbarButton({
  icon,
  children,
  onClick,
}: {
  icon: IconSvgElement;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <HugeiconsIcon icon={icon} aria-hidden />
      {children}
    </Button>
  );
}

export function SortButton() {
  return <ToolbarButton icon={ArrowUpDownIcon}>Ordenar</ToolbarButton>;
}

export function ExportButton() {
  return <ToolbarButton icon={Download04Icon}>Exportar</ToolbarButton>;
}

export function ViewButton() {
  return <ToolbarButton icon={GridViewIcon}>Vista</ToolbarButton>;
}
