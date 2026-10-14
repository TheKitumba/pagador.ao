import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Mail01Icon, MoneyBag02Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DescriptionList, SectionCard } from "@/components/common/cards";
import { PageBody, PageHeader } from "@/components/common/page";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Button } from "@/components/ui/button";
import { formatKz, formatMonth } from "@/lib/format";
import { cn } from "@/lib/utils";
import { findPayrollRun, findPayslip, payslipLines } from "@/mocks/payroll";
import { PrintButton } from "@/components/common/action-buttons";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { HeaderButton } from "@/components/common/header-button";

type Params = { params: Promise<{ runId: string; id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const payslip = findPayslip((await params).id);
  return { title: payslip ? `Recibo de ${payslip.employee.name}` : "Recibo" };
}

export default async function PayslipPage({ params }: Params) {
  const { runId, id } = await params;
  const run = findPayrollRun(runId);
  const payslip = findPayslip(id);
  if (!run || !payslip) notFound();

  const lines = payslipLines(payslip);
  const earnings = lines.filter((line) => line.kind === "earning");
  const deductions = lines.filter((line) => line.kind === "deduction");
  const employer = lines.filter((line) => line.kind === "employer");

  const LineTable = ({ title, rows }: { title: string; rows: typeof lines }) => (
    <table className="w-full text-sm">
      <caption className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Código</th>
          <th scope="col">Rubrica e cálculo</th>
          <th scope="col">Quantidade</th>
          <th scope="col">Valor</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((line) => (
          <tr key={line.code} className="border-t align-top">
            <td className="w-16 py-3 pr-2 text-xs tabular text-muted-foreground">{line.code}</td>
            <th scope="row" className="py-3 pr-4 text-left font-normal">
              <span className="block font-medium">{line.description}</span>
              <span className="mt-0.5 block font-mono text-xs text-muted-foreground">{line.trace}</span>
            </th>
            <td className="hidden py-3 pr-4 text-right text-xs text-muted-foreground sm:table-cell">{line.quantity ?? ""}</td>
            <td className={cn("whitespace-nowrap py-3 text-right font-medium tabular", line.amount < 0 && "text-destructive")}>
              {formatKz(line.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <PageHeader
        title={`Recibo — ${payslip.employee.name}`}
        icon={MoneyBag02Icon}
        leading={
          <Button asChild variant="ghost" size="icon-sm">
            <Link href={`/payroll/${run.id}?tab=payslips`} aria-label={`Voltar a ${run.name}`}>
              <HugeiconsIcon icon={ArrowLeft01Icon} />
            </Link>
          </Button>
        }
        actions={
          <>
            <ConfirmDialog
              title="Enviar recibo ao trabalhador?"
              description={<p>O recibo de {formatMonth(run.period)} é enviado para {payslip.employee.email} e fica disponível no portal do trabalhador.</p>}
              confirmLabel="Enviar"
              successTitle="Recibo enviado"
              successDescription={payslip.employee.email}
              trigger={<HeaderButton variant="outline" icon={Mail01Icon} label="Enviar ao trabalhador" className="hidden md:inline-flex" collapse={false} />}
            />
            <PrintButton />
          </>
        }
      />
      <PageBody className="max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <SectionCard title="Remunerações e descontos" description={`Período: ${formatMonth(run.period)} · cada linha mostra o rasto de cálculo`}>
              <div className="space-y-6">
                <LineTable title="Remunerações" rows={earnings} />
                <LineTable title="Descontos" rows={deductions} />
                <LineTable title="Encargos da entidade empregadora" rows={employer} />
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <section aria-label="Totais" className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <PersonAvatar name={payslip.employee.name} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{payslip.employee.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{payslip.employee.position}</p>
                </div>
              </div>
              <dl className="mt-5 space-y-2.5 text-sm">
                {[
                  ["Total ilíquido", payslip.gross],
                  ["Segurança Social", -payslip.socialSecurity],
                  ["IRT", -payslip.irt],
                  ...(payslip.otherDeductions ? [["Outros descontos", -payslip.otherDeductions] as const] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="tabular">{formatKz(Number(value))}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 border-t pt-3">
                  <dt className="font-semibold">Líquido a receber</dt>
                  <dd className="text-lg font-semibold tabular">{formatKz(payslip.net)}</dd>
                </div>
              </dl>
            </section>
            <SectionCard title="Dados do recibo">
              <DescriptionList
                columns={1}
                items={[
                  { label: "N.º do trabalhador", value: payslip.employee.number },
                  { label: "NIF", value: payslip.employee.nif },
                  { label: "N.º de Segurança Social", value: payslip.employee.socialSecurity },
                  { label: "Pagamento", value: `${payslip.employee.bank} · transferência` },
                  { label: "Tabela de IRT aplicada", value: "Grupo A — 2026 v2" },
                ]}
              />
            </SectionCard>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
