import type React from "react";

import { AuthLayout } from "@/layouts/auth-layout";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
