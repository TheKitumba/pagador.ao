import type { Metadata } from "next";
import { Suspense } from "react";

import { InvalidLink } from "../_components/invalid-link";
import { AcceptInvitationForm } from "./_components/accept-invitation-form";

export const metadata: Metadata = { title: "Aceitar convite" };

/** Opened from the invitation e-mail (`/accept-invitation?token=…`, valid for 7 days). */
export default async function AcceptInvitationPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const { token } = await searchParams;
  if (typeof token !== "string" || token.length < 10) {
    return <InvalidLink title="Convite inválido" description="A ligação do convite está incompleta. Peça a quem o convidou que envie um novo." action="login" />;
  }
  return (
    <Suspense>
      <AcceptInvitationForm token={token} />
    </Suspense>
  );
}
