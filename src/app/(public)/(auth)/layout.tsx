import type React from "react";

import { AuthLayout } from "@/layouts/auth-layout";

export default function AuthRoutesLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
