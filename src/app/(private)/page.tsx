import { HugeiconsIcon } from "@hugeicons/react";
import {
  Agreement01Icon,
  Alert02Icon,
  ArrowRight01Icon,
  BeachIcon,
  BirthdayCakeIcon,
  Clock01Icon,
  DocumentValidationIcon,
  Home01Icon,
  MoneyBag02Icon,
  UserAdd01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { BreakdownChart } from "@/components/charts/breakdown-chart";
import { TrendChart } from "@/components/charts/trend-chart";
import { QuickActionCard, QuickActions, SectionCard, StatCard, StatGrid } from "@/components/common/cards";
import { PageBody, PageHeader } from "@/components/common/page";
import { PersonAvatar } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { payrollStatusTone } from "@/components/common/status-maps";
import { PayrollStepper } from "@/components/payroll/payroll-stepper";
import { Button } from "@/components/ui/button";
import { CreateMenu } from "@/layouts/create-menu";
import { formatDate, formatDateLong, formatKz, formatKzCompact } from "@/lib/format";
import { fiscalDeadlines } from "@/mocks/compliance";
import { approvalKindLabel, approvals } from "@/mocks/inbox";
import { currentUser, contractAlerts, employees } from "@/mocks/people";
import { deductionsBreakdown, payrollRunStatusLabel, payrollRuns, payrollTrend } from "@/mocks/payroll";

export const metadata: Metadata = { title: "Início" };

const TODAY = "2026-10-14";

export default function DashboardPage() {
  const run = payrollRuns[0];
  const firstName = currentUser.name.split(" ")[0];
  const birthdays = employees.filter((employee) => employee.birthDate.slice(5, 7) === "10" && employee.status !== "terminated");

  return (
    <>
      <PageHeader title="Início" icon={Home01Icon} actions={<CreateMenu />} />
      <PageBody>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Bom dia, {firstName}</h2>
          <p className="text-sm text-muted-foreground">
            {formatDateLong(TODAY)} · Faltam 16 dias para o pagamento de salários.
          </p>
        </div>

        <QuickActions>
          <QuickActionCard href={`/payroll/${run.id}`} icon={MoneyBag02Icon} title="Processar folha" description="Continuar a folha de outubro" />
          <QuickActionCard href="/employees/new" icon={UserAdd01Icon} title="Admitir trabalhador" description="Dados, contrato e documentos" />
          <QuickActionCard href="/leave?new=1" icon={BeachIcon} title="Registar ausência" description="Férias, faltas e licenças" />
          <QuickActionCard href="/tax-filings" icon={DocumentValidationIcon} title="Mapas fiscais" description="IRT para a AGT e folha do INSS" />
        </QuickActions>

        <SectionCard
          title={run.name}
          description={`Pagamento previsto para ${formatDate(run.paymentDate)} · ${run.employees} trabalhadores`}
          action={
            <div className="flex items-center gap-2">
              <StatusBadge tone={payrollStatusTone[run.status]}>{payrollRunStatusLabel[run.status]}</StatusBadge>
              <Button asChild size="sm">
                <Link href={`/payroll/${run.id}`}>
                  Continuar
                  <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden />
                </Link>
              </Button>
            </div>
          }
        >
          <PayrollStepper status={run.status} />
          {run.blocking > 0 && (
            <Link
              href={`/payroll/${run.id}?tab=alerts`}
              className="mt-4 flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm hover:bg-destructive/10"
            >
              <HugeiconsIcon icon={Alert02Icon} className="size-4 shrink-0 text-destructive" aria-hidden />
              <span className="flex-1">
                <span className="font-medium text-destructive-strong">{run.blocking} bloqueios</span> e {run.warnings} avisos impedem a
                submissão para aprovação.
              </span>
              <span className="hidden font-medium text-destructive-strong sm:inline">Resolver</span>
            </Link>
          )}
        </SectionCard>

        <StatGrid>
          <StatCard label="Efectivo" value="248" icon={UserGroupIcon} tone="info" delta={{ value: "+3", positive: true, direction: "up" }} hint="admissões em outubro" href="/employees" />
          <StatCard label="Custo da folha (out.)" value={formatKzCompact(run.employerCost)} icon={MoneyBag02Icon} tone="violet" delta={{ value: "+1,2%", positive: false, direction: "up" }} hint="vs. setembro" href={`/payroll/${run.id}`} />
          <StatCard label="IRT e INSS a entregar" value={formatKzCompact(14_602_330.9 + 12_984_031.4)} icon={DocumentValidationIcon} tone="warning" hint="Próximo prazo: 31/10 (AGT)" href="/tax-filings" />
          <StatCard label="Absentismo (mês)" value="2,5%" icon={Clock01Icon} tone="success" delta={{ value: "−0,4 p.p.", positive: true, direction: "down" }} hint="vs. setembro" href="/attendance" />
        </StatGrid>

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Evolução da folha" description="Ilíquido e líquido, em milhões de Kz" className="lg:col-span-2">
            <TrendChart
              data={payrollTrend}
              xKey="month"
              unit=" M"
              summary="Entre maio e outubro de 2026 o ilíquido subiu de 110,2 para 118,4 milhões de Kz e o líquido de 93,4 para 100 milhões de Kz."
              series={[
                { key: "gross", label: "Ilíquido", color: "hsl(var(--chart-1))" },
                { key: "net", label: "Líquido", color: "hsl(var(--chart-2))" },
              ]}
            />
          </SectionCard>
          <SectionCard title="Descontos e encargos" description="Folha de outubro 2026">
            <BreakdownChart
              data={deductionsBreakdown}
              totalLabel="Total"
              totalValue={formatKzCompact(deductionsBreakdown.reduce((sum, item) => sum + item.value, 0))}
            />
          </SectionCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="À espera da sua decisão" description={`${approvals.length} pedidos pendentes`} href="/approvals" contentClassName="px-2 pb-2">
            <ul className="divide-y">
              {approvals.slice(0, 4).map((approval) => (
                <li key={approval.id}>
                  <Link href={approval.href} className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-accent/60">
                    <PersonAvatar name={approval.requester} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{approval.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {approval.requester} · {approvalKindLabel[approval.kind]}
                      </span>
                    </span>
                    {approval.urgent && <StatusBadge tone="danger">Urgente</StatusBadge>}
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Prazos legais" description="AGT e INSS" href="/tax-filings" contentClassName="px-2 pb-2">
            <ul className="divide-y">
              {fiscalDeadlines.map((deadline) => (
                <li key={deadline.title} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="flex w-11 shrink-0 flex-col items-center rounded-lg border bg-muted/40 py-1">
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {new Date(deadline.date).toLocaleDateString("pt-AO", { month: "short" })}
                    </span>
                    <span className="text-sm font-semibold tabular">{deadline.date.slice(8)}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{deadline.title}</span>
                    <span className="block text-xs text-muted-foreground">{deadline.authority}</span>
                  </span>
                  <StatusBadge tone={deadline.daysLeft <= 20 ? "warning" : "neutral"}>{deadline.daysLeft} dias</StatusBadge>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Pessoas" description="Contratos e aniversários" href="/contracts" contentClassName="px-2 pb-2">
            <ul className="divide-y">
              {contractAlerts.slice(0, 3).map((alert) => {
                const employee = employees.find((item) => item.id === alert.employeeId)!;
                return (
                  <li key={alert.employeeId} className="flex items-center gap-3 px-3 py-2.5">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-warning/10 text-warning">
                      <HugeiconsIcon icon={Agreement01Icon} className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <Link href={`/employees/${employee.id}`} className="block truncate text-sm font-medium hover:underline">
                        {employee.name}
                      </Link>
                      <span className="block truncate text-xs text-muted-foreground">
                        {alert.type === "probation" ? "Fim do período experimental" : "Contrato termina"} a {formatDate(alert.endDate)}
                      </span>
                    </span>
                    <span className="text-xs tabular text-muted-foreground">{alert.daysLeft} d</span>
                  </li>
                );
              })}
              {birthdays.slice(0, 2).map((employee) => (
                <li key={employee.id} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300">
                    <HugeiconsIcon icon={BirthdayCakeIcon} className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{employee.name}</span>
                    <span className="block text-xs text-muted-foreground">Aniversário a {formatDate(`2026${employee.birthDate.slice(4)}`).slice(0, 5)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <p className="text-xs text-muted-foreground">
          Custo total da folha de outubro: <span className="tabular">{formatKz(run.employerCost)}</span> (inclui encargos patronais).
        </p>
      </PageBody>
    </>
  );
}
