import { Alert02Icon, PlusSignIcon, Shield01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { StatCard, StatGrid } from "@/components/common/cards";
import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { accidents, medicalExams, ppe } from "@/mocks/management";
import { FormDialog } from "@/components/common/form-dialog";
import { HeaderButton } from "@/components/common/header-button";
import { forms } from "@/config/forms";

export const metadata: Metadata = { title: "Saúde e segurança" };

const examStatus = {
  scheduled: { label: "Agendado", tone: "info" as const },
  overdue: { label: "Em atraso", tone: "danger" as const },
  done: { label: "Realizado", tone: "success" as const },
};

export default function SafetyPage() {
  return (
    <>
      <PageHeader
        title="Saúde e segurança"
        icon={Shield01Icon}
        description="Exames médicos, acidentes e EPI"
        actions={
          <FormDialog {...forms.accident} trigger={<HeaderButton icon={PlusSignIcon} label="Registar acidente" />} />
        }
      />
      <PageTabs
        tabs={[
          { value: "exams", label: "Exames médicos", count: medicalExams.length },
          { value: "accidents", label: "Acidentes", count: accidents.length },
          { value: "ppe", label: "Equipamento (EPI)", count: ppe.length },
        ]}
      >
        <PageBody>
          <PageTabPanel value="exams" className="space-y-6">
            <StatGrid>
              <StatCard label="Dias sem acidentes" value="17" icon={Shield01Icon} tone="success" />
              <StatCard label="Exames em atraso" value="1" icon={Alert02Icon} tone="danger" />
              <StatCard label="Exames este mês" value="4" icon={Shield01Icon} tone="info" />
              <StatCard label="EPI a substituir" value="60" icon={Alert02Icon} tone="warning" />
            </StatGrid>
            <DataTable
              caption="Exames médicos"
              rows={medicalExams}
              getRowKey={(row) => `${row.employee}-${row.exam}`}
              columns={[
                { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.exam} /> },
                { key: "due", header: "Data", cell: (row) => <span className="tabular">{formatDate(row.due)}</span> },
                { key: "status", header: "Estado", cell: (row) => <StatusBadge tone={examStatus[row.status].tone}>{examStatus[row.status].label}</StatusBadge> },
              ]}
            />
          </PageTabPanel>
          <PageTabPanel value="accidents">
            <DataTable
              caption="Acidentes de trabalho"
              rows={accidents}
              getRowKey={(row) => `${row.employee}-${row.date}`}
              columns={[
                { key: "employee", header: "Trabalhador", cell: (row) => <PersonCell name={row.employee} detail={row.location} /> },
                { key: "date", header: "Data", cell: (row) => <span className="tabular">{formatDate(row.date)}</span> },
                { key: "severity", header: "Gravidade", cell: (row) => <StatusBadge tone={row.severity === "Ligeiro" ? "warning" : "danger"}>{row.severity}</StatusBadge> },
                { key: "days", header: "Dias perdidos", align: "right", cell: (row) => <span className="tabular">{row.daysLost}</span> },
                { key: "reported", header: "Participado", hideBelow: "sm", cell: (row) => (row.reported ? "Sim" : "Não") },
              ]}
            />
          </PageTabPanel>
          <PageTabPanel value="ppe">
            <DataTable
              caption="Equipamentos de protecção individual"
              rows={ppe}
              getRowKey={(row) => row.item}
              columns={[
                { key: "item", header: "Equipamento", cell: (row) => <span className="font-medium">{row.item}</span> },
                { key: "stock", header: "Em stock", align: "right", cell: (row) => <span className="tabular">{row.stock}</span> },
                { key: "assigned", header: "Atribuídos", align: "right", hideBelow: "sm", cell: (row) => <span className="tabular">{row.assigned}</span> },
                { key: "expiring", header: "A substituir", align: "right", cell: (row) => <span className={row.expiring > 20 ? "tabular font-medium text-warning-strong" : "tabular"}>{row.expiring}</span> },
              ]}
            />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
