"use client";

import {
  Alert02Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Notification03Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useState } from "react";

import { EmptyState, IconTile } from "@/components/common/cards";
import type { Tone } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import type { NotificationKind } from "@/mocks/inbox";
import { cn } from "@/lib/utils";

const kindIcon: Record<NotificationKind, { icon: typeof Alert02Icon; tone: Tone; label: string }> = {
  alert: { icon: Alert02Icon, tone: "danger", label: "Alerta" },
  deadline: { icon: Calendar03Icon, tone: "warning", label: "Prazo" },
  info: { icon: InformationCircleIcon, tone: "info", label: "Informação" },
  success: { icon: CheckmarkCircle02Icon, tone: "success", label: "Concluído" },
};

interface Item {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
}

export function NotificationList({ items }: { items: Item[] }) {
  const [readIds, setReadIds] = useState<string[]>([]);
  const isRead = (item: Item) => item.read || readIds.includes(item.id);
  const unreadCount = items.filter((item) => !isRead(item)).length;

  if (items.length === 0) {
    return <EmptyState icon={Notification03Icon} title="Sem notificações" description="Quando houver novidades, aparecem aqui." />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {unreadCount === 0 ? "Todas lidas" : `${unreadCount} por ler`}
        </p>
        <Button variant="ghost" size="sm" disabled={unreadCount === 0} onClick={() => setReadIds(items.map((item) => item.id))}>
          Marcar todas como lidas
        </Button>
      </div>
      <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-card">
        {items.map((item) => {
          const meta = kindIcon[item.kind];
          const read = isRead(item);
          return (
            <li key={item.id} className={cn("relative", !read && "bg-primary/[0.03]")}>
              <Link
                href={item.href}
                onClick={() => setReadIds((current) => [...current, item.id])}
                className="flex gap-3 px-4 py-3.5 hover:bg-accent/50"
              >
                <IconTile icon={meta.icon} tone={meta.tone} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={cn("text-sm", read ? "font-medium" : "font-semibold")}>{item.title}</span>
                    {!read && (
                      <span className="size-2 rounded-full bg-primary">
                        <span className="sr-only">Não lida</span>
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{item.body}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {meta.label} · {item.time}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
