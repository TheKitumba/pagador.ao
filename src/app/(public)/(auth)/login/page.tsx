import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
