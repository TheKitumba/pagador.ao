"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/cards";
import { PersonAvatar } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { useFilter } from "@/components/common/toolbar";
import { Button } from "@/components/ui/button";
import { type Approval, approvalKindLabel } from "@/mocks/inbox";

export function ApprovalList({ items }: { items: Approval[] }) {
  const kind = useFilter("kind");
  const [decided, setDecided] = useState<Record<string, "approved" | "rejected">>({});

  const visible = items.filter((item) => !decided[item.id] && (!kind || item.kind === kind));

  const decide = (approval: Approval, decision: "approved" | "rejected") => {
    setDecided((current) => ({ ...current, [approval.id]: decision }));
    toast.success(decision === "approved" ? "Pedido aprovado" : "Pedido rejeitado", {
      description: approval.title,
      action: {
        label: "Anular",
        onClick: () =>
          setDecided((current) => {
            const { [approval.id]: _removed, ...rest } = current;
            return rest;
          }),
      },
    });
  };

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={CheckmarkCircle02Icon}
        title="Está tudo em dia"
        description="Não há pedidos à espera da sua decisão. Avisamos quando chegar um novo."
      />
    );
  }

  return (
    <ul className="space-y-3" aria-label="Pedidos pendentes">
      {visible.map((approval) => (
        <li key={approval.id} className="rounded-xl border bg-card p-4 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <PersonAvatar name={approval.requester} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="neutral" dot={false}>
                  {approvalKindLabel[approval.kind]}
                </StatusBadge>
                {approval.urgent && <StatusBadge tone="danger">Urgente</StatusBadge>}
                <span className="text-xs text-muted-foreground">{approval.step}</span>
              </div>
              <h2 className="mt-2 text-[15px] font-semibold">
                <Link href={approval.href} className="hover:underline underline-offset-4">
                  {approval.title}
                </Link>
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{approval.detail}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Pedido por <span className="font-medium text-foreground">{approval.requester}</span> · {approval.submittedAt} ·{" "}
                {approval.dueIn}
              </p>
            </div>
            <div className="flex shrink-0 gap-2 sm:flex-col lg:flex-row">
              <Button variant="outline" size="sm" onClick={() => decide(approval, "rejected")} aria-label={`Rejeitar: ${approval.title}`}>
                <HugeiconsIcon icon={Cancel01Icon} aria-hidden />
                Rejeitar
              </Button>
              <Button size="sm" onClick={() => decide(approval, "approved")} aria-label={`Aprovar: ${approval.title}`}>
                <HugeiconsIcon icon={Tick02Icon} aria-hidden />
                Aprovar
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
