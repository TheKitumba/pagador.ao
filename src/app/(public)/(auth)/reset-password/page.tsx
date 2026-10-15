import type { Metadata } from "next";

import { InvalidLink } from "../_components/invalid-link";
import { ResetPasswordForm } from "./_components/reset-password-form";

export const metadata: Metadata = { title: "Nova palavra-passe" };

/** Opened from the e-mail sent by POST /auth/password/forgot (`/reset-password?token=…`). */
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const { token } = await searchParams;
  if (typeof token !== "string" || token.length < 10) {
    return <InvalidLink title="Ligação inválida" description="Esta ligação para redefinir a palavra-passe está incompleta. Peça uma nova." action="forgot" />;
  }
  return <ResetPasswordForm token={token} />;
}
