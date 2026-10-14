import { Message01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { PageHeader } from "@/components/common/page";

import { Inbox } from "./_components/inbox";

export const metadata: Metadata = { title: "Mensagens" };

export default function MessagesPage() {
  return (
    <>
      <PageHeader title="Mensagens" icon={Message01Icon} description="Conversas e comunicados internos" />
      <Inbox />
    </>
  );
}
