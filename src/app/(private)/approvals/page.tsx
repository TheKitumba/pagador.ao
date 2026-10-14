import { CheckListIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { PageBody, PageHeader, PageTabPanel, PageTabs } from "@/components/common/page";
import { FilterMenu } from "@/components/common/toolbar";
import { approvalKindLabel, approvals } from "@/mocks/inbox";

import { ApprovalList } from "./_components/approval-list";

export const metadata: Metadata = { title: "Aprovações" };

export default function ApprovalsPage() {
  const urgent = approvals.filter((approval) => approval.urgent);

  return (
    <>
      <PageHeader title="Aprovações" icon={CheckListIcon} description="Pedidos à espera da sua decisão" />
      <PageTabs
        tabs={[
          { value: "pending", label: "Pendentes", count: approvals.length },
          { value: "urgent", label: "Urgentes", count: urgent.length },
          { value: "history", label: "Histórico" },
        ]}
        toolbar={
          <FilterMenu
            label="Tipo"
            param="kind"
            options={Object.entries(approvalKindLabel).map(([value, label]) => ({ value, label }))}
          />
        }
      >
        <PageBody className="max-w-4xl">
          <PageTabPanel value="pending">
            <ApprovalList items={approvals} />
          </PageTabPanel>
          <PageTabPanel value="urgent">
            <ApprovalList items={urgent} />
          </PageTabPanel>
          <PageTabPanel value="history">
            <ApprovalList items={[]} />
          </PageTabPanel>
        </PageBody>
      </PageTabs>
    </>
  );
}
