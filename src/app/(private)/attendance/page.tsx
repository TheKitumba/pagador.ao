import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, BeachIcon, CheckmarkCircle02Icon, Clock01Icon, LockIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { ProgressBar, SectionCard, StatCard, StatGrid } from "@/components/common/cards";
import { DataTable } from "@/components/common/data-table";
import { DecisionButtons } from "@/components/common/decision-buttons";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge, type Tone } from "@/components/common/status-badge";
import { requestStatusTone } from "@/components/common/status-maps";
import { formatDate, formatPercent } from "@/lib/format";
import { establishments } from "@/mocks/people";
import { attendanceCorrections, attendanceToday, punches, requestStatusLabel } from "@/mocks/time";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { HeaderButton } from "@/components/common/header-button";

export const metadata: Metadata = { title: "Presença" };

const punchStatus: Record<(typeof punches)[number]["status"], { label: string; tone: Tone }> = {
  present: { label: "Presente", tone: "success" },
  late: { label: "Atraso", tone: "warning" },
  absent: { label: "Ausente", tone: "danger" },
  leave: { label: "De licença", tone: "neutral" },
};

export default function AttendancePage() {
  const presence = (attendanceToday.present / attendanceToday.expected) * 100;

  return (
    <>
      <PageHeader
        title="Presença"
        icon={Clock01Icon}
        description="Marcações do dia, correcções e fecho do período"
        actions={
          <ConfirmDialog
            title="Fechar o período de outubro?"
            description={
              <>
                <p>As marcações deixam de poder ser alteradas e as faltas e horas extra seguem para a folha de outubro.</p>
                <p>A Delegação do Huambo ainda tem 3 dias por consolidar.</p>
              </>
            }
            confirmLabel="Fechar período"
            successTitle="Período fechado"
            successDescription="Faltas e horas extra enviadas para a folha de outubro."
            trigger={<HeaderButton variant="outline" icon={LockIcon} label="Fechar período" />}
          />
        }
      />
      <PageTabs
        tabs={[
          { value: "today", label: "Hoje" },
          { value: "corrections", label: "Correcções", count: attendanceCorrections.filter((c) => c.status === "pending").length },
          { value: "period", label: "Fecho do período" },
        ]}
      >
        <PageBody>
          <PageTabPanel value="today" className="space-y-6">
            <StatGrid>
              <StatCard label="Presentes" value={`${attendanceToday.present} / ${attendanceToday.expected}`} icon={CheckmarkCircle02Icon} tone="success" hint={`${formatPercent(presence)} de presença`} />
              <StatCard label="Atrasos" value={String(attendanceToday.late)} icon={Clock01Icon} tone="warning" />
              <StatCard label="Ausências sem justificação" value={String(attendanceToday.absent)} icon={Alert02Icon} tone="danger" />
              <StatCard label="De férias ou licença" value={String(attendanceToday.onLeave)} icon={BeachIcon} tone="info" />
            </StatGrid>
            <DataTable
              caption="Marcações de hoje"
              rows={punches}
              getRowKey={(row) => row.employee}
              columns={[
                { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.establishment} /> },
                { key: "in", header: "Entrada", cell: (row) => <span className="tabular">{row.in ?? "—"}</span> },
                { key: "out", header: "Saída", hideBelow: "sm", cell: (row) => <span className="tabular">{row.out ?? "—"}</span> },
                { key: "source", header: "Origem", hideBelow: "md", cell: (row) => <span className="text-muted-foreground">{row.source ?? "—"}</span> },
                { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={punchStatus[row.status].tone}>{punchStatus[row.status].label}</StatusBadge> },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="corrections">
            <DataTable
              caption="Pedidos de correcção de ponto"
              rows={attendanceCorrections}
              getRowKey={(row) => `${row.employee}-${row.date}`}
              columns={[
                { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} /> },
                { key: "date", header: "Dia", cell: (row) => formatDate(row.date) },
                { key: "requested", header: "Pedido", hideBelow: "sm", cell: (row) => row.requested },
                { key: "reason", header: "Motivo", hideBelow: "lg", cell: (row) => <span className="text-muted-foreground">{row.reason}</span> },
                {
                  key: "decision",
                  header: "Decisão",
                  align: "right",
                  cell: (row) =>
                    row.status === "pending" ? (
                      <DecisionButtons subject={`Correcção de ${row.employee} em ${formatDate(row.date)}`} />
                    ) : (
                      <StatusBadge tone={requestStatusTone[row.status]}>{requestStatusLabel[row.status]}</StatusBadge>
                    ),
                },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="period">
            <SectionCard title="Fecho de outubro de 2026" description="Fecha as marcações e envia faltas e horas extra para a folha. Prazo recomendado: 25/10.">
              <ul className="space-y-5">
                {[
                  { site: establishments[0], done: 100 },
                  { site: establishments[1], done: 92 },
                  { site: establishments[2], done: 78 },
                ].map((item) => (
                  <li key={item.site}>
                    <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <HugeiconsIcon icon={UserGroupIcon} className="size-4 text-muted-foreground" aria-hidden />
                        {item.site}
                      </span>
                      <span className="tabular text-muted-foreground">{item.done}% consolidado</span>
                    </div>
                    <ProgressBar value={item.done} tone={item.done === 100 ? "success" : "warning"} label={`Consolidação de ${item.site}`} />
                  </li>
                ))}
              </ul>
            </SectionCard>
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
