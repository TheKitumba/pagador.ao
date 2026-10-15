import type { Metadata } from "next";
import { RegisterForm } from "./_components/register-form";

export const metadata: Metadata = { title: "Criar conta" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ email?: string | string[] }> }) {
  // The landing page starts sign-up with the e-mail already typed.
  const { email } = await searchParams;
  return <RegisterForm defaultEmail={typeof email === "string" ? email : ""} />;
}
