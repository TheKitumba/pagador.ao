import { FileSearchIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader } from "@/components/common/page";
import { PersonCell } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { DownloadButton } from "@/components/common/action-buttons";
import { formatDate, formatTime } from "@/lib/format";
import { auditLog } from "@/mocks/management";

export const metadata: Metadata = { title: "Auditoria" };

export default function AuditPage() {
  return (
    <>
      <PageHeader title="Auditoria" icon={FileSearchIcon} description="Registo de todas as alterações" actions={<DownloadButton filename="auditoria-kianda.csv" label="Exportar CSV" rows={auditLog.map((row) => ({ data: row.at, utilizador: row.user, accao: row.action, entidade: row.entity, ip: row.ip, sensivel: row.sensitive ? "sim" : "não" }))} />} />
      <PageBody>
        <DataTable
          caption="Registo de auditoria"
          rows={auditLog}
          getRowKey={(row) => row.at}
          columns={[
            {
              key: "at",
              header: "Data e hora",
              cell: (row) => (
                <time dateTime={row.at} className="tabular whitespace-nowrap">
                  {formatDate(row.at)} <span className="text-muted-foreground">{formatTime(row.at)}</span>
                </time>
              ),
            },
            { key: "user", header: "Utilizador", cell: (row) => <PersonCell name={row.user} /> },
            {
              key: "action",
              header: "Acção",
              cell: (row) => (
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{row.action}</span>
                    {row.sensitive && <StatusBadge tone="warning">Dado sensível</StatusBadge>}
                  </div>
                  <div className="text-xs text-muted-foreground">{row.entity}</div>
                </div>
              ),
            },
            { key: "ip", header: "Endereço IP", hideBelow: "lg", cell: (row) => <span className="font-mono text-xs text-muted-foreground">{row.ip}</span> },
          ]}
        />
      </PageBody>
    </>
  );
}
