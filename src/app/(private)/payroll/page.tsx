import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, MoneyBag02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { TrendChart } from "@/components/charts/trend-chart";
import { SectionCard, StatCard, StatGrid } from "@/components/common/cards";
import { DataTable, Money } from "@/components/common/data-table";
import { PageBody, PageHeader } from "@/components/common/page";
import { StatusBadge } from "@/components/common/status-badge";
import { payrollStatusTone } from "@/components/common/status-maps";
import { PayrollStepper } from "@/components/payroll/payroll-stepper";
import { Button } from "@/components/ui/button";
import { formatDate, formatKz, formatKzCompact } from "@/lib/format";
import { payrollRunStatusLabel, payrollRuns, payrollTrend } from "@/mocks/payroll";

export const metadata: Metadata = { title: "Folha de pagamento" };

export default function PayrollPage() {
  const current = payrollRuns[0];
  const previous = payrollRuns[1];

  return (
    <>
      <PageHeader
        title="Folha de pagamento"
        icon={MoneyBag02Icon}
        description="Processamentos mensais, recibos e aprovação"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Novo processamento</span>
            <span className="sr-only sm:hidden">Novo processamento</span>
          </Button>
        }
      />
      <PageBody>
        <SectionCard
          title={current.name}
          description={`${current.employees} trabalhadores · pagamento a ${formatDate(current.paymentDate)}`}
          action={
            <div className="flex items-center gap-2">
              <StatusBadge tone={payrollStatusTone[current.status]}>{payrollRunStatusLabel[current.status]}</StatusBadge>
              <Button asChild size="sm">
                <Link href={`/payroll/${current.id}`}>
                  Abrir processamento
                  <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden />
                </Link>
              </Button>
            </div>
          }
        >
          <PayrollStepper status={current.status} />
        </SectionCard>

        <StatGrid>
          <StatCard label="Ilíquido" value={formatKzCompact(current.gross)} delta={{ value: "+1,2%", positive: false, direction: "up" }} hint="vs. setembro" />
          <StatCard label="IRT retido" value={formatKzCompact(current.irt)} hint="Entrega à AGT até 30/11" />
          <StatCard label="Segurança Social" value={formatKzCompact(current.socialSecurity + current.gross * 0.08)} hint="3% trabalhador + 8% empresa" />
          <StatCard label="Líquido a pagar" value={formatKzCompact(current.net)} delta={{ value: "+1,1%", positive: false, direction: "up" }} hint={`setembro: ${formatKzCompact(previous.net)}`} />
        </StatGrid>

        <SectionCard title="Evolução" description="Ilíquido e líquido dos últimos 6 meses, em milhões de Kz">
          <TrendChart
            data={payrollTrend}
            xKey="month"
            unit=" M"
            height={200}
            summary="O ilíquido subiu de 110,2 para 118,4 milhões de Kz entre maio e outubro de 2026."
            series={[
              { key: "gross", label: "Ilíquido", color: "hsl(var(--chart-1))" },
              { key: "net", label: "Líquido", color: "hsl(var(--chart-2))" },
            ]}
          />
        </SectionCard>

        <section aria-labelledby="runs-title" className="space-y-3">
          <h2 id="runs-title" className="text-sm font-medium text-muted-foreground">
            Processamentos
          </h2>
          <DataTable
            caption="Processamentos da folha"
            rows={payrollRuns}
            getRowKey={(row) => row.id}
            columns={[
              {
                key: "name",
                header: "Processamento",
                cell: (row) => (
                  <div>
                    <Link href={`/payroll/${row.id}`} className="font-medium hover:underline underline-offset-4">
                      {row.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{row.type}</div>
                  </div>
                ),
              },
              { key: "employees", header: "Trabalhadores", align: "right", hideBelow: "md", cell: (row) => <span className="tabular">{row.employees}</span> },
              { key: "gross", header: "Ilíquido", align: "right", hideBelow: "lg", cell: (row) => <Money value={formatKz(row.gross)} muted /> },
              { key: "net", header: "Líquido", align: "right", cell: (row) => <Money value={formatKz(row.net)} className="font-medium" /> },
              { key: "date", header: "Pagamento", hideBelow: "sm", cell: (row) => <span className="tabular">{formatDate(row.paymentDate)}</span> },
              { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={payrollStatusTone[row.status]}>{payrollRunStatusLabel[row.status]}</StatusBadge> },
            ]}
          />
        </section>
      </PageBody>
    </>
  );
}
