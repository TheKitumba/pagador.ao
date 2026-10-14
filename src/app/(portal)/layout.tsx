import type React from "react";

import { PortalShell } from "@/layouts/portal-shell";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
