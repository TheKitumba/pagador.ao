import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowLeft01Icon,
  CalculatorIcon,
  InformationCircleIcon,
  MoneyBag02Icon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionCard, StatCard, StatGrid } from "@/components/common/cards";
import { DataTable, Money } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { StatusBadge } from "@/components/common/status-badge";
import { payrollStatusTone } from "@/components/common/status-maps";
import { SearchField } from "@/components/common/toolbar";
import { PayrollStepper } from "@/components/payroll/payroll-stepper";
import { Button } from "@/components/ui/button";
import { formatDate, formatKz, formatKzCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { batchStatusLabel, paymentBatches } from "@/mocks/finance";
import { findPayrollRun, payrollAlerts, payrollRunStatusLabel, payrollRuns, payslips } from "@/mocks/payroll";

import { PayslipTable } from "./_components/payslip-table";
import { SubmitRunButton } from "./_components/submit-run-button";

type Params = { params: Promise<{ runId: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: findPayrollRun((await params).runId)?.name ?? "Processamento" };
}

const severityStyle = {
  blocking: { icon: Alert02Icon, label: "Bloqueante", tone: "danger" as const, box: "border-destructive/20 bg-destructive/5", iconClass: "text-destructive" },
  warning: { icon: Alert02Icon, label: "Aviso", tone: "warning" as const, box: "border-warning/25 bg-warning/5", iconClass: "text-warning" },
  info: { icon: InformationCircleIcon, label: "Informativo", tone: "info" as const, box: "border-info/20 bg-info/5", iconClass: "text-info" },
};

export default async function PayrollRunPage({ params }: Params) {
  const run = findPayrollRun((await params).runId);
  if (!run) notFound();

  const previous = payrollRuns.find((item) => item.type === run.type && item.period < run.period);
  const runPayslips = payslips.filter((payslip) => payslip.runId === run.id);
  const alerts = run.blocking + run.warnings > 0 ? payrollAlerts : [];
  const batches = paymentBatches.filter((batch) => batch.run === run.name);

  const comparison = [
    { label: "Ilíquido", current: run.gross, previous: previous?.gross },
    { label: "Segurança Social (3%)", current: run.socialSecurity, previous: previous?.socialSecurity },
    { label: "IRT", current: run.irt, previous: previous?.irt },
    { label: "Líquido", current: run.net, previous: previous?.net },
    { label: "Custo total para a empresa", current: run.employerCost, previous: previous?.employerCost },
  ];

  return (
    <>
      <PageHeader
        title={run.name}
        icon={MoneyBag02Icon}
        leading={
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/payroll" aria-label="Voltar à Folha de pagamento">
              <HugeiconsIcon icon={ArrowLeft01Icon} />
            </Link>
          </Button>
        }
        menu={<StatusBadge tone={payrollStatusTone[run.status]}>{payrollRunStatusLabel[run.status]}</StatusBadge>}
        actions={
          run.status === "closed" ? null : (
            <>
              <Button variant="outline" className="hidden md:inline-flex">
                <HugeiconsIcon icon={CalculatorIcon} aria-hidden />
                Recalcular
              </Button>
              <SubmitRunButton blocking={run.blocking} />
            </>
          )
        }
      />

      <div className="border-b bg-card px-4 py-4 md:px-6">
        <div className="mx-auto max-w-[1440px]">
          <PayrollStepper status={run.status} />
        </div>
      </div>

      <PageTabs
        tabs={[
          { value: "summary", label: "Resumo" },
          { value: "payslips", label: "Recibos", count: runPayslips.length },
          { value: "alerts", label: "Alertas", count: alerts.length },
          { value: "payment", label: "Pagamento", count: batches.length },
        ]}
        toolbar={<SearchField label="Pesquisar recibos" placeholder="Pesquisar trabalhador" />}
      >
        <PageBody>
          <PageTabPanel value="summary" className="space-y-6">
            <StatGrid>
              <StatCard label="Trabalhadores" value={String(run.employees)} hint={previous ? `${run.employees - previous.employees >= 0 ? "+" : ""}${run.employees - previous.employees} face ao anterior` : undefined} />
              <StatCard label="Ilíquido" value={formatKzCompact(run.gross)} />
              <StatCard label="Líquido a pagar" value={formatKzCompact(run.net)} />
              <StatCard label="Custo total" value={formatKzCompact(run.employerCost)} hint="Com encargos patronais" />
            </StatGrid>
            <SectionCard title="Comparação com o processamento anterior" description={previous ? previous.name : "Sem processamento anterior"}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <caption className="sr-only">Comparação de totais com o processamento anterior</caption>
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th scope="col" className="py-2 text-left font-medium">Rubrica</th>
                      <th scope="col" className="py-2 text-right font-medium">Anterior</th>
                      <th scope="col" className="py-2 text-right font-medium">Actual</th>
                      <th scope="col" className="py-2 text-right font-medium">Variação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row) => {
                      const delta = row.previous ? ((row.current - row.previous) / row.previous) * 100 : 0;
                      return (
                        <tr key={row.label} className="border-b last:border-0">
                          <th scope="row" className="py-2.5 text-left font-medium">{row.label}</th>
                          <td className="py-2.5 text-right tabular text-muted-foreground">{row.previous ? formatKz(row.previous) : "—"}</td>
                          <td className="py-2.5 text-right tabular">{formatKz(row.current)}</td>
                          <td className={cn("py-2.5 text-right tabular", Math.abs(delta) > 20 ? "font-medium text-destructive" : "text-muted-foreground")}>
                            {delta >= 0 ? "+" : ""}
                            {delta.toLocaleString("pt-AO", { maximumFractionDigits: 1 })}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </PageTabPanel>

          <PageTabPanel value="payslips">
            <PayslipTable runId={run.id} />
          </PageTabPanel>

          <PageTabPanel value="alerts" className="space-y-3">
            {alerts.length === 0 ? (
              <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-card">Sem alertas neste processamento.</p>
            ) : (
              <ul className="space-y-3">
                {alerts.map((alert) => {
                  const style = severityStyle[alert.severity];
                  return (
                    <li key={alert.title} className={cn("flex items-start gap-3 rounded-xl border p-4", style.box)}>
                      <HugeiconsIcon icon={style.icon} className={cn("mt-0.5 size-5 shrink-0", style.iconClass)} aria-hidden />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge tone={style.tone}>{style.label}</StatusBadge>
                          <h2 className="text-sm font-semibold">{alert.title}</h2>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{alert.detail}</p>
                      </div>
                      {"employeeId" in alert && alert.employeeId && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/employees/${alert.employeeId}`}>Corrigir</Link>
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </PageTabPanel>

          <PageTabPanel value="payment">
            <DataTable
              caption="Lotes de pagamento deste processamento"
              rows={batches}
              getRowKey={(row) => row.id}
              empty={<p className="px-4 py-10 text-center text-sm text-muted-foreground">Os lotes são gerados depois da aprovação da folha.</p>}
              columns={[
                { key: "bank", header: "Banco", cell: (row) => <span className="font-medium">{row.bank}</span> },
                { key: "format", header: "Formato", hideBelow: "md", cell: (row) => <span className="text-muted-foreground">{row.format}</span> },
                { key: "count", header: "Pagamentos", align: "right", cell: (row) => <span className="tabular">{row.instructions}</span> },
                { key: "amount", header: "Montante", align: "right", cell: (row) => <Money value={formatKz(row.amount)} /> },
                { key: "status", header: "Estado", cell: (row) => <StatusBadge tone="neutral">{batchStatusLabel[row.status]}</StatusBadge> },
              ]}
            />
            <p className="mt-3 text-xs text-muted-foreground">Pagamento previsto para {formatDate(run.paymentDate)}.</p>
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
