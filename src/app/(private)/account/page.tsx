import { UserCircleIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { PageBody, PageHeader } from "@/components/common/page";

import { AccountSecurity } from "./_components/account-security";

export const metadata: Metadata = { title: "A minha conta" };

/** The signed-in user's own account. Open to everyone, unlike the company settings. */
export default function AccountPage() {
  return (
    <>
      <PageHeader title="A minha conta" icon={UserCircleIcon} description="Os seus dados e a segurança da sua entrada" />
      <PageBody className="max-w-3xl space-y-6">
        <AccountSecurity />
      </PageBody>
    </>
  );
}
