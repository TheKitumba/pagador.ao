"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PersonAvatar } from "@/components/common/person-avatar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { canOpen } from "@/config/access";
import { employees } from "@/mocks/people";
import { useSession } from "@/providers/session-provider";
import { useCommandMenu } from "@/stores/command-menu.store";

import { createActions } from "./create-menu";
import { useVisibleNav } from "./use-visible-nav";

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/** Global search: pages, quick actions and people. Opens with ⌘K / Ctrl+K, or "/" outside text fields. */
export function CommandMenu() {
  const router = useRouter();
  const user = useSession();
  const nav = useVisibleNav();
  const actions = createActions.filter((action) => canOpen(user.permissions, action.href));
  const { isOpen, setOpen, toggle } = useCommandMenu();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      } else if (event.key === "/" && !isTyping(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle, setOpen]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Pesquisar páginas, acções ou trabalhadores…" aria-label="Pesquisar" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>Sem resultados.</CommandEmpty>

        <CommandGroup heading="Acções rápidas">
          {actions.map((action) => (
            <CommandItem key={action.href} value={`acção ${action.title}`} onSelect={() => go(action.href)} className="gap-3">
              <HugeiconsIcon icon={action.icon} className="size-4 text-muted-foreground" aria-hidden />
              {action.title}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {[{ id: "main", title: "Principal", items: nav.primary }, ...nav.groups, { id: "system", title: "Sistema", items: nav.footer }].map(
          (group) => (
            <CommandGroup key={group.id} heading={group.title}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${item.title} ${item.description} ${(item.keywords ?? []).join(" ")}`}
                  onSelect={() => go(item.href)}
                  className="gap-3"
                >
                  <HugeiconsIcon icon={item.icon} className="size-4 text-muted-foreground" aria-hidden />
                  <span className="flex-1">{item.title}</span>
                  <span className="hidden truncate text-xs text-muted-foreground sm:block">{item.description}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ),
        )}

        <CommandSeparator />

        <CommandGroup heading="Trabalhadores">
          {employees.map((employee) => (
            <CommandItem
              key={employee.id}
              value={`${employee.name} ${employee.number} ${employee.position} ${employee.department}`}
              onSelect={() => go(`/employees/${employee.id}`)}
              className="gap-3"
            >
              <PersonAvatar name={employee.name} size="xs" />
              <span className="flex-1">{employee.name}</span>
              <span className="text-xs text-muted-foreground">{employee.position}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
