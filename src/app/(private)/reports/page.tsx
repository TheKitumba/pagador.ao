import { HugeiconsIcon } from "@hugeicons/react";
import { Analytics01Icon, ArrowRight01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { SectionCard, StatCard, StatGrid } from "@/components/common/cards";
import { PageBody, PageHeader } from "@/components/common/page";
import { Button } from "@/components/ui/button";
import { headcountByDepartment, reportCategories } from "@/mocks/management";

export const metadata: Metadata = { title: "Relatórios" };

export default function ReportsPage() {
  const max = Math.max(...headcountByDepartment.map((item) => item.headcount));

  return (
    <>
      <PageHeader
        title="Relatórios"
        icon={Analytics01Icon}
        description="Indicadores de RH e construtor de relatórios"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Novo relatório</span>
            <span className="sr-only sm:hidden">Novo relatório</span>
          </Button>
        }
      />
      <PageBody>
        <StatGrid>
          <StatCard label="Rotatividade (12 meses)" value="8,4%" delta={{ value: "−1,1 p.p.", positive: true, direction: "down" }} />
          <StatCard label="Antiguidade média" value="5,2 anos" />
          <StatCard label="Mulheres em chefia" value="38%" delta={{ value: "+4 p.p.", positive: true, direction: "up" }} />
          <StatCard label="Custo médio por trabalhador" value="515 701 Kz" hint="Com encargos, por mês" />
        </StatGrid>

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Efectivo por departamento" className="lg:col-span-1">
            <table className="w-full text-sm">
              <caption className="sr-only">Número de trabalhadores por departamento</caption>
              <tbody>
                {headcountByDepartment.map((item) => (
                  <tr key={item.department}>
                    <th scope="row" className="w-24 py-1.5 pr-3 text-left font-normal text-muted-foreground">
                      {item.department}
                    </th>
                    <td className="py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${(item.headcount / max) * 100}%` }} aria-hidden />
                        <span className="tabular font-medium">{item.headcount}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:col-span-2">
            {reportCategories.map((category) => (
              <SectionCard key={category.title} title={category.title} contentClassName="px-2 pb-2">
                <ul>
                  {category.reports.map((report) => (
                    <li key={report.name}>
                      <Link href={`/reports?report=${encodeURIComponent(report.name)}`} className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{report.name}</span>
                          <span className="block text-xs text-muted-foreground">Actualizado: {report.updated}</span>
                        </span>
                        <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-muted-foreground group-hover:text-foreground" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            ))}
          </div>
        </div>
      </PageBody>
    </>
  );
}
