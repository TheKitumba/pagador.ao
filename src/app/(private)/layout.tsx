import type React from "react";

import { AppShell } from "@/layouts/app-shell";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
