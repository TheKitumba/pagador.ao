"use client"

import { Header } from "@/components/layout/header"
import { MetricCard } from "@/components/ui/metric-card"
import { PayrollExpenseChart } from "@/components/charts/payroll-expense-chart"
import { DeductionsTaxesChart } from "@/components/charts/deductions-taxes-chart"
import { PayrollTable } from "@/components/payroll/payroll-table"
import { TimePeriodSelector } from "@/components/payroll/time-period-selector"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Folha de Pagamento" subtitle="Últimos 30 dias" />

      <main className="flex-1 p-6 space-y-6">
        {/* Time Period Selector */}
        <div className="flex items-center justify-between">
          <TimePeriodSelector />
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <MetricCard
            title="Visão Geral das Despesas da Folha"
            value={formatCurrency(250000)}
            change={12.5}
            period="Últimos 30 Dias"
            trend="down"
          >
            <PayrollExpenseChart />
          </MetricCard>

          <MetricCard
            title="Deduções e Impostos"
            value={formatCurrency(750000)}
            change={10.3}
            period="Últimos 30 Dias"
            trend="up"
          >
            <DeductionsTaxesChart />
          </MetricCard>
        </div>

        {/* Payroll Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Registros da Folha de Pagamento</h2>
          <PayrollTable />
        </div>
      </main>
    </div>
  )
}
