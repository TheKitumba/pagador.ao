import { HugeiconsIcon } from "@hugeicons/react";
import { GiftIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { DataTable } from "@/components/common/data-table";
import { PageBody, PageHeader } from "@/components/common/page";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { benefits } from "@/mocks/finance";

export const metadata: Metadata = { title: "Benefícios" };

export default function BenefitsPage() {
  return (
    <>
      <PageHeader
        title="Benefícios"
        icon={GiftIcon}
        description="Subsídios, seguros e outros benefícios"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Novo benefício</span>
            <span className="sr-only sm:hidden">Novo benefício</span>
          </Button>
        }
      />
      <PageBody>
        <DataTable
          caption="Benefícios e subsídios"
          rows={benefits}
          getRowKey={(row) => row.name}
          columns={[
            {
              key: "name",
              header: "Benefício",
              cell: (row) => (
                <div>
                  <div className="font-medium">{row.name}</div>
                  <div className="text-xs text-muted-foreground">{row.value}</div>
                </div>
              ),
            },
            { key: "type", header: "Tipo", hideBelow: "sm", cell: (row) => <StatusBadge tone="neutral" dot={false}>{row.type}</StatusBadge> },
            { key: "tax", header: "Incidência fiscal", hideBelow: "md", cell: (row) => <span className="text-muted-foreground">{row.taxable}</span> },
            { key: "employees", header: "Abrangidos", align: "right", cell: (row) => <span className="tabular">{row.employees}</span> },
          ]}
        />
      </PageBody>
    </>
  );
}
