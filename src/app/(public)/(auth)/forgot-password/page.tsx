import type { Metadata } from "next";

import { ForgotPasswordForm } from "./_components/forgot-password-form";

export const metadata: Metadata = { title: "Recuperar acesso" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
