import { HugeiconsIcon } from "@hugeicons/react";
import { BeachIcon, Coins01Icon, File02Icon, Invoice01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { QuickActionCard } from "@/components/common/cards";
import { FormDialog } from "@/components/common/form-dialog";
import { StatusBadge } from "@/components/common/status-badge";
import { requestStatusTone } from "@/components/common/status-maps";
import { forms } from "@/config/forms";
import { formatDate } from "@/lib/format";
import { requestStatusLabel, type RequestStatus } from "@/mocks/time";

export const metadata: Metadata = { title: "Pedidos" };

/** The worker's own requests: same forms as the back office, without the "Trabalhador" field. */
const withoutEmployee = <T extends { fields: { name: string }[] }>(spec: T) => ({ ...spec, fields: spec.fields.filter((field) => field.name !== "employee") });

const portalForms = {
  leave: { ...withoutEmployee(forms.leave), title: "Pedir férias ou falta", successDescription: "Enviado à sua chefia directa." },
  advance: { ...withoutEmployee(forms.advance), title: "Pedir adiantamento", fields: withoutEmployee(forms.advance).fields.filter((field) => field.name !== "type") },
  expense: { ...withoutEmployee(forms.reimbursement), title: "Pedir reembolso" },
  letter: { ...forms.declaration, title: "Pedir declaração", submitLabel: "Pedir", successTitle: "Pedido enviado", successDescription: "Recebe a declaração no portal quando estiver pronta." },
};

const myRequests: { title: string; detail: string; date: string; status: RequestStatus; icon: typeof BeachIcon }[] = [
  { title: "Férias de 21/12 a 08/01", detail: "12 dias úteis", date: "2026-09-02", status: "approved", icon: BeachIcon },
  { title: "Declaração de rendimentos", detail: "Para o banco", date: "2026-10-10", status: "pending", icon: File02Icon },
  { title: "Reembolso — táxi para a AGT", detail: "4 500,00 Kz", date: "2026-09-18", status: "approved", icon: Invoice01Icon },
];

export default function PortalRequestsPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Pedidos</h1>
      <section aria-labelledby="new-request" className="space-y-3">
        <h2 id="new-request" className="text-sm font-medium text-muted-foreground">
          Novo pedido
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickActionCard href="/portal/requests?new=leave" icon={BeachIcon} title="Férias ou falta" description="Com justificativo, se necessário" />
          <QuickActionCard href="/portal/requests?new=advance" icon={Coins01Icon} title="Adiantamento" description="Até 50% do vencimento" />
          <QuickActionCard href="/portal/requests?new=expense" icon={Invoice01Icon} title="Reembolso" description="Fotografe o recibo" />
          <QuickActionCard href="/portal/requests?new=letter" icon={File02Icon} title="Declaração" description="Rendimentos ou de serviço" />
        </div>
      </section>
      <FormDialog {...portalForms.leave} openParam="new" openValue="leave" />
      <FormDialog {...portalForms.advance} openParam="new" openValue="advance" />
      <FormDialog {...portalForms.expense} openParam="new" openValue="expense" />
      <FormDialog {...portalForms.letter} openParam="new" openValue="letter" />
      <section aria-labelledby="my-requests" className="space-y-3">
        <h2 id="my-requests" className="text-sm font-medium text-muted-foreground">
          Os meus pedidos
        </h2>
        <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-card">
          {myRequests.map((request) => (
            <li key={request.title} className="flex items-center gap-3 px-4 py-3.5">
              <HugeiconsIcon icon={request.icon} className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{request.title}</p>
                <p className="text-xs text-muted-foreground">
                  {request.detail} · pedido a {formatDate(request.date)}
                </p>
              </div>
              <StatusBadge tone={requestStatusTone[request.status]}>{requestStatusLabel[request.status]}</StatusBadge>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
