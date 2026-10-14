import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Call02Icon,
  File02Icon,
  Location01Icon,
  Mail01Icon,
  PencilEdit02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DescriptionList, EmptyState, ProgressBar, SectionCard } from "@/components/common/cards";
import { DataTable, Money } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonAvatar } from "@/components/common/person-avatar";
import { SensitiveValue } from "@/components/common/sensitive-value";
import { StatusBadge } from "@/components/common/status-badge";
import { employeeStatusTone, requestStatusTone } from "@/components/common/status-maps";
import { Button } from "@/components/ui/button";
import { formatDate, formatKz } from "@/lib/format";
import { auditLog } from "@/mocks/management";
import { employeeStatusLabel, findEmployee } from "@/mocks/people";
import { payrollRuns, payslips } from "@/mocks/payroll";
import { leaveBalances, leaveRequests, requestStatusLabel } from "@/mocks/time";
import { goals, trainings } from "@/mocks/growth";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const employee = findEmployee((await params).id);
  return { title: employee?.name ?? "Trabalhador" };
}

export default async function EmployeePage({ params }: Params) {
  const employee = findEmployee((await params).id);
  if (!employee) notFound();

  const payslip = payslips.find((item) => item.employee.id === employee.id);
  const balance = leaveBalances.find((item) => item.employee === employee.name);
  const leave = leaveRequests.filter((item) => item.employee === employee.name);
  const ownGoals = goals.filter((goal) => goal.owner === employee.name);
  const history = auditLog.filter((entry) => entry.entity.includes(employee.name));

  return (
    <>
      <PageHeader
        title={employee.name}
        icon={UserGroupIcon}
        leading={
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/employees" aria-label="Voltar a Trabalhadores">
              <HugeiconsIcon icon={ArrowLeft01Icon} />
            </Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline" className="hidden md:inline-flex">
              <HugeiconsIcon icon={File02Icon} aria-hidden />
              Emitir declaração
            </Button>
            <Button>
              <HugeiconsIcon icon={PencilEdit02Icon} aria-hidden />
              Editar
            </Button>
          </>
        }
      />

      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-5 md:flex-row md:items-center md:px-6">
          <PersonAvatar name={employee.name} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">{employee.name}</h2>
              <StatusBadge tone={employeeStatusTone[employee.status]}>{employeeStatusLabel[employee.status]}</StatusBadge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {employee.position} · {employee.department} · N.º {employee.number}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Mail01Icon} className="size-4" aria-hidden />
                <a href={`mailto:${employee.email}`} className="hover:text-foreground hover:underline">
                  {employee.email}
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Call02Icon} className="size-4" aria-hidden />
                <a href={`tel:${employee.phone.replace(/\s/g, "")}`} className="hover:text-foreground hover:underline">
                  {employee.phone}
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Location01Icon} className="size-4" aria-hidden />
                {employee.establishment}
              </li>
            </ul>
          </div>
          <dl className="grid grid-cols-3 gap-6 text-sm md:text-right">
            <div>
              <dt className="text-xs text-muted-foreground">Admissão</dt>
              <dd className="font-medium tabular">{formatDate(employee.hireDate)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Chefia</dt>
              <dd className="font-medium">{employee.manager ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Férias</dt>
              <dd className="font-medium tabular">{balance ? `${balance.entitled + balance.carried - balance.taken} dias` : "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <PageTabs
        tabs={[
          { value: "personal", label: "Dados pessoais" },
          { value: "job", label: "Profissional" },
          { value: "contracts", label: "Contratos" },
          { value: "pay", label: "Remuneração" },
          { value: "leave", label: "Férias e faltas" },
          { value: "documents", label: "Documentos" },
          { value: "performance", label: "Desempenho" },
          { value: "training", label: "Formação" },
          { value: "history", label: "Histórico" },
        ]}
      >
        <PageBody>
          <PageTabPanel value="personal" className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Identificação">
              <DescriptionList
                items={[
                  { label: "Nome completo", value: employee.name },
                  { label: "Data de nascimento", value: formatDate(employee.birthDate) },
                  { label: "Bilhete de Identidade", value: "006512378LA041" },
                  { label: "Validade do BI", value: "12/03/2030" },
                  { label: "NIF", value: employee.nif },
                  { label: "N.º de Segurança Social", value: employee.socialSecurity },
                  { label: "Nacionalidade", value: "Angolana" },
                  { label: "Estado civil", value: "Casado(a)" },
                ]}
              />
            </SectionCard>
            <SectionCard title="Contactos e morada">
              <DescriptionList
                items={[
                  { label: "E-mail", value: employee.email },
                  { label: "Telemóvel", value: employee.phone },
                  { label: "Província", value: employee.establishment.includes("Luanda") ? "Luanda" : employee.establishment.includes("Benguela") ? "Benguela" : "Huambo" },
                  { label: "Município", value: employee.establishment.includes("Luanda") ? "Talatona" : "Lobito" },
                  { label: "Bairro", value: "Benfica" },
                  { label: "Contacto de emergência", value: "+244 923 000 111 (cônjuge)" },
                ]}
              />
            </SectionCard>
          </PageTabPanel>

          <PageTabPanel value="job" className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Posição">
              <DescriptionList
                items={[
                  { label: "Cargo", value: employee.position },
                  { label: "Departamento", value: employee.department },
                  { label: "Estabelecimento", value: employee.establishment },
                  { label: "Chefia directa", value: employee.manager ?? "—" },
                  { label: "Horário", value: "Administrativo · 44 h/semana" },
                  { label: "Centro de custo", value: "CC-300" },
                ]}
              />
            </SectionCard>
            <SectionCard title="Dados bancários" description="Alterações feitas pelo trabalhador ficam pendentes de validação">
              <DescriptionList
                items={[
                  { label: "Banco", value: employee.bank },
                  { label: "IBAN", value: <SensitiveValue value={employee.iban} label="IBAN" /> },
                  { label: "Forma de pagamento", value: "Transferência bancária" },
                  { label: "Última validação", value: "02/09/2026" },
                ]}
              />
            </SectionCard>
          </PageTabPanel>

          <PageTabPanel value="contracts">
            <DataTable
              caption="Contratos do trabalhador"
              getRowKey={(row) => row.id}
              rows={[
                { id: "c2", type: employee.contractType, start: employee.hireDate, end: employee.contractType.includes("determinado") ? "2026-11-02" : null, status: "Vigente" },
                { id: "c1", type: "Período experimental", start: employee.hireDate, end: employee.hireDate, status: "Concluído" },
              ]}
              columns={[
                { key: "type", header: "Tipo de contrato", cell: (row) => <span className="font-medium">{row.type}</span> },
                { key: "start", header: "Início", cell: (row) => formatDate(row.start) },
                { key: "end", header: "Fim", cell: (row) => (row.end ? formatDate(row.end) : "Sem termo") },
                { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={row.status === "Vigente" ? "success" : "neutral"}>{row.status}</StatusBadge> },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="pay" className="space-y-6">
            <SectionCard title="Remuneração fixa">
              <DescriptionList
                columns={3}
                items={[
                  { label: "Vencimento base", value: <SensitiveValue value={formatKz(employee.baseSalary)} label="vencimento base" /> },
                  { label: "Subsídio de alimentação", value: formatKz(40_000) },
                  { label: "Subsídio de transporte", value: formatKz(30_000) },
                ]}
              />
            </SectionCard>
            <DataTable
              caption="Recibos do trabalhador"
              getRowKey={(row) => row.id}
              rows={payrollRuns.filter((run) => run.type === "Mensal").map((run) => ({ id: run.id, run, net: payslip?.net ?? employee.baseSalary * 0.85 }))}
              columns={[
                { key: "period", header: "Processamento", cell: (row) => <span className="font-medium">{row.run.name}</span> },
                { key: "date", header: "Pagamento", hideBelow: "sm", cell: (row) => formatDate(row.run.paymentDate) },
                { key: "net", header: "Líquido", align: "right", cell: (row) => <Money value={formatKz(row.net)} /> },
                {
                  key: "open",
                  header: "Recibo",
                  align: "right",
                  cell: (row) =>
                    payslip ? (
                      <Link href={`/payroll/${row.run.id}/payslips/${payslip.id}`} className="text-sm font-medium text-primary hover:underline">
                        Ver recibo<span className="sr-only"> de {row.run.name}</span>
                      </Link>
                    ) : (
                      "—"
                    ),
                },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="leave" className="space-y-6">
            {balance && (
              <SectionCard title={`Saldo de férias ${2026}`}>
                <div className="grid gap-4 sm:grid-cols-4">
                  {[
                    ["Direito", balance.entitled],
                    ["Transitados", balance.carried],
                    ["Gozados", balance.taken],
                    ["Marcados", balance.scheduled],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-lg font-semibold tabular">{value} dias</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
            <DataTable
              caption="Pedidos de férias e faltas"
              getRowKey={(row) => row.id}
              rows={leave}
              empty={<p className="px-4 py-10 text-center text-sm text-muted-foreground">Sem pedidos registados.</p>}
              columns={[
                { key: "type", header: "Tipo", cell: (row) => <span className="font-medium">{row.type}</span> },
                { key: "period", header: "Período", cell: (row) => `${formatDate(row.start)} – ${formatDate(row.end)}` },
                { key: "days", header: "Dias", align: "right", cell: (row) => row.days },
                { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={requestStatusTone[row.status]}>{requestStatusLabel[row.status]}</StatusBadge> },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="documents">
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {["Bilhete de Identidade.pdf", "Contrato de trabalho.pdf", "Declaração de NIF.pdf", "Certificado de habilitações.pdf", "Atestado médico de admissão.pdf"].map((name) => (
                <li key={name} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-card">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-xs font-semibold text-destructive">PDF</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{name}</span>
                    <span className="block text-xs text-muted-foreground">Carregado a 03/08/2026</span>
                  </span>
                </li>
              ))}
            </ul>
          </PageTabPanel>

          <PageTabPanel value="performance">
            {ownGoals.length ? (
              <SectionCard title="Objectivos 2026">
                <ul className="space-y-4">
                  {ownGoals.map((goal) => (
                    <li key={goal.title}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="font-medium">{goal.title}</span>
                        <span className="tabular text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <ProgressBar value={goal.progress} label={goal.title} tone={goal.status === "at-risk" ? "warning" : "success"} />
                    </li>
                  ))}
                </ul>
              </SectionCard>
            ) : (
              <EmptyState icon={UserGroupIcon} title="Sem objectivos definidos" description="Os objectivos são definidos pela chefia no início de cada ciclo de avaliação." />
            )}
          </PageTabPanel>

          <PageTabPanel value="training">
            <DataTable
              caption="Formações"
              getRowKey={(row) => row.title}
              rows={trainings.slice(0, 2)}
              columns={[
                { key: "title", header: "Acção", cell: (row) => <span className="font-medium">{row.title}</span> },
                { key: "date", header: "Data", cell: (row) => formatDate(row.date) },
                { key: "hours", header: "Horas", align: "right", cell: (row) => `${row.hours} h` },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="history">
            <SectionCard title="Histórico de alterações">
              {history.length ? (
                <ol className="relative space-y-5 border-l pl-5">
                  {history.map((entry) => (
                    <li key={entry.at} className="relative">
                      <span aria-hidden className="absolute -left-[25px] top-1 size-2.5 rounded-full border-2 border-card bg-primary" />
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.user} · {formatDate(entry.at)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">Admitido a {formatDate(employee.hireDate)}. Sem alterações registadas desde então.</p>
              )}
            </SectionCard>
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
