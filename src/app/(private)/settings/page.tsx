import { Settings02Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { DescriptionList, ProgressBar, SectionCard } from "@/components/common/cards";
import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { company, currentUser, establishments } from "@/mocks/people";

import { FormDialog } from "@/components/common/form-dialog";
import { forms } from "@/config/forms";

import { AccessDialog, roles } from "./_components/access-dialog";
import { SaveForm, ToggleRow, WorkflowSheet } from "./_components/settings-controls";

export const metadata: Metadata = { title: "Configurações" };

const payItems = [
  { code: "R001", name: "Vencimento base", kind: "Remuneração", irt: "Sim", ss: "Sim" },
  { code: "R010", name: "Subsídio de alimentação", kind: "Remuneração", irt: "Acima de 30 000 Kz", ss: "Sim" },
  { code: "R011", name: "Subsídio de transporte", kind: "Remuneração", irt: "Acima de 30 000 Kz", ss: "Sim" },
  { code: "R040", name: "Horas extra — dia útil", kind: "Remuneração", irt: "Sim", ss: "Sim" },
  { code: "R070", name: "Retroactivos", kind: "Remuneração", irt: "Sim", ss: "Sim" },
  { code: "D001", name: "Segurança Social (3%)", kind: "Desconto", irt: "—", ss: "—" },
  { code: "D002", name: "IRT", kind: "Desconto", irt: "—", ss: "—" },
  { code: "D010", name: "Falta injustificada", kind: "Desconto", irt: "Reduz", ss: "Reduz" },
];

const legalTables = [
  { name: "Tabela de IRT — Grupo A", version: "2026 v2", from: "01/10/2026", status: "Em vigor" },
  { name: "Taxas de Segurança Social (3% + 8%)", version: "2024 v1", from: "01/01/2024", status: "Em vigor" },
  { name: "Feriados nacionais", version: "2026 v1", from: "01/01/2026", status: "Em vigor" },
  { name: "Tabela de IRT — Grupo A", version: "2026 v1", from: "01/01/2026", status: "Substituída" },
];

const workflows = [
  { request: "Férias", flow: "Chefia directa → Técnico de RH" },
  { request: "Horas extra", flow: "Chefia directa (prévia) → confirmação" },
  { request: "Adiantamento salarial", flow: "Chefia → Gestor de RH → Aprovador financeiro" },
  { request: "Reembolso de despesas", flow: "Chefia → Finanças" },
  { request: "Folha de pagamento", flow: "Processador → Aprovador financeiro" },
  { request: "Cessação de contrato", flow: "Gestor de RH → Direcção" },
];

function Field({ id, label, defaultValue, type = "text", hint }: { id: string; label: string; defaultValue: string; type?: string; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} defaultValue={defaultValue} aria-describedby={hint ? `${id}-hint` : undefined} />
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Configurações" icon={Settings02Icon} description="Empresa, rubricas, parâmetros legais, utilizadores e subscrição" />
      <PageTabs
        tabs={[
          { value: "company", label: "Empresa" },
          { value: "profile", label: "O meu perfil" },
          { value: "users", label: "Utilizadores e acessos" },
          { value: "pay-items", label: "Rubricas" },
          { value: "legal", label: "Parâmetros legais" },
          { value: "workflows", label: "Fluxos de aprovação" },
          { value: "notifications", label: "Notificações" },
          { value: "billing", label: "Subscrição" },
        ]}
      >
        <PageBody className="max-w-5xl">
          <PageTabPanel value="company" className="space-y-6">
            <SectionCard title="Dados da entidade empregadora" description="Aparecem nos recibos, contratos e mapas fiscais">
              <SaveForm successTitle="Dados da empresa guardados" className="grid gap-4 sm:grid-cols-2">
                <Field id="company-name" label="Denominação social" defaultValue={company.name} />
                <Field id="company-nif" label="NIF" defaultValue={company.nif} />
                <Field id="company-inss" label="N.º de contribuinte do INSS" defaultValue="0012 4478 90" />
                <Field id="company-cae" label="CAE (actividade)" defaultValue="52100 — Armazenagem" />
                <div className="sm:col-span-2">
                  <Field id="company-address" label="Sede" defaultValue="Rua do Talatona, Edifício Kianda, Luanda" />
                </div>
                <div className="flex justify-end sm:col-span-2">
                  <Button type="submit">Guardar alterações</Button>
                </div>
              </SaveForm>
            </SectionCard>
            <SectionCard title="Estabelecimentos" description="Usados na assiduidade, nos centros de custo e nos relatórios" contentClassName="px-2 pb-2">
              <ul className="divide-y">
                {establishments.map((site) => (
                  <li key={site} className="flex items-center justify-between px-3 py-3 text-sm">
                    <span className="font-medium">{site}</span>
                    <FormDialog
                      {...forms.establishment}
                      fields={forms.establishment.fields.map((field) => (field.name === "name" ? { ...field, defaultValue: site } : field))}
                      trigger={
                        <Button variant="ghost" size="sm">
                          Editar<span className="sr-only"> {site}</span>
                        </Button>
                      }
                    />
                  </li>
                ))}
              </ul>
            </SectionCard>
          </PageTabPanel>

          <PageTabPanel value="profile" className="space-y-6">
            <SectionCard title="Dados pessoais">
              <SaveForm successTitle="Perfil guardado" className="grid gap-4 sm:grid-cols-2">
                <Field id="me-name" label="Nome" defaultValue={currentUser.name} />
                <Field id="me-email" label="E-mail" type="email" defaultValue={currentUser.email} />
                <div className="flex justify-end sm:col-span-2">
                  <Button type="submit">Guardar</Button>
                </div>
              </SaveForm>
            </SectionCard>
            <SectionCard title="Segurança">
              <div className="divide-y">
                <ToggleRow id="2fa" label="Autenticação de dois factores" description="Obrigatória para quem acede a salários, pagamentos e configurações." defaultChecked />
                <ToggleRow id="sessions" label="Terminar sessão após 30 minutos de inactividade" description="Recomendado em computadores partilhados." defaultChecked />
              </div>
            </SectionCard>
          </PageTabPanel>

          <PageTabPanel value="users" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Quem gere a conta e com que papel. Cada acção fica registada na auditoria.</p>
              <AccessDialog />
            </div>
            <DataTable
              caption="Utilizadores com acesso"
              getRowKey={(row) => row.email}
              rows={[
                { name: "Isabel Neto", email: "isabel.neto@kianda.co.ao", role: roles[0], twoFactor: true },
                { name: "Ana Mateus", email: "ana.mateus@kianda.co.ao", role: roles[3], twoFactor: true },
                { name: "Graça Mbemba", email: "graca.mbemba@kianda.co.ao", role: roles[4], twoFactor: true },
                { name: "Feliciano Lukamba", email: "feliciano.lukamba@kianda.co.ao", role: roles[5], twoFactor: false },
              ]}
              columns={[
                { key: "user", header: "Utilizador", cell: (row) => <PersonCell name={row.name} detail={row.email} /> },
                { key: "role", header: "Papel", cell: (row) => row.role },
                { key: "2fa", header: "2FA", cell: (row) => <StatusBadge tone={row.twoFactor ? "success" : "warning"}>{row.twoFactor ? "Activo" : "Por activar"}</StatusBadge> },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="pay-items">
            <DataTable
              caption="Rubricas da folha"
              rows={payItems}
              getRowKey={(row) => row.code}
              columns={[
                { key: "code", header: "Código", className: "w-20", cell: (row) => <span className="tabular text-muted-foreground">{row.code}</span> },
                { key: "name", header: "Rubrica", cell: (row) => <span className="font-medium">{row.name}</span> },
                { key: "kind", header: "Tipo", hideBelow: "sm", cell: (row) => <StatusBadge tone={row.kind === "Desconto" ? "danger" : "success"} dot={false}>{row.kind}</StatusBadge> },
                { key: "irt", header: "Incide IRT", hideBelow: "md", cell: (row) => row.irt },
                { key: "ss", header: "Incide SS", hideBelow: "md", cell: (row) => row.ss },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="legal" className="space-y-4">
            <p className="rounded-xl border border-info/20 bg-info/5 p-4 text-sm">
              As tabelas legais são publicadas pela equipa pagador.ao com data de vigência. Cada processamento guarda a versão usada, para que possa ser reproduzido.
            </p>
            <DataTable
              caption="Tabelas legais"
              rows={legalTables}
              getRowKey={(row) => `${row.name}-${row.version}`}
              columns={[
                { key: "name", header: "Tabela", cell: (row) => <span className="font-medium">{row.name}</span> },
                { key: "version", header: "Versão", cell: (row) => row.version },
                { key: "from", header: "Em vigor desde", hideBelow: "sm", cell: (row) => <span className="tabular">{row.from}</span> },
                { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={row.status === "Em vigor" ? "success" : "neutral"}>{row.status}</StatusBadge> },
              ]}
            />
          </PageTabPanel>

          <PageTabPanel value="workflows">
            <SectionCard title="Fluxos de aprovação" description="Quem aprova cada tipo de pedido" contentClassName="px-2 pb-2">
              <ul className="divide-y">
                {workflows.map((workflow) => (
                  <li key={workflow.request} className="flex items-center gap-4 px-3 py-3">
                    <span className="w-48 shrink-0 text-sm font-medium">{workflow.request}</span>
                    <span className="flex-1 text-sm text-muted-foreground">{workflow.flow}</span>
                    <WorkflowSheet request={workflow.request} flow={workflow.flow} />
                  </li>
                ))}
              </ul>
            </SectionCard>
          </PageTabPanel>

          <PageTabPanel value="notifications">
            <SectionCard title="Notificações por e-mail e SMS">
              <div className="divide-y">
                <ToggleRow id="n-deadlines" label="Prazos legais (AGT e INSS)" description="10 e 3 dias antes de cada prazo." defaultChecked />
                <ToggleRow id="n-approvals" label="Pedidos à espera de aprovação" description="Resumo diário às 08:00." defaultChecked />
                <ToggleRow id="n-contracts" label="Contratos a terminar" description="30 dias antes do termo." defaultChecked />
                <ToggleRow id="n-sms" label="Recibos por SMS" description="Para trabalhadores sem e-mail." />
              </div>
            </SectionCard>
          </PageTabPanel>

          <PageTabPanel value="billing">
            <SectionCard title={`Plano ${company.plan}`} description="Facturação mensal por trabalhador activo">
              <DescriptionList
                columns={3}
                items={[
                  { label: "Trabalhadores activos", value: "248 de 300" },
                  { label: "Próxima factura", value: "10/11/2026" },
                  { label: "Valor estimado", value: "372 000,00 Kz" },
                ]}
              />
              <div className="mt-5">
                <ProgressBar value={(248 / 300) * 100} label="Utilização do plano" />
              </div>
            </SectionCard>
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
