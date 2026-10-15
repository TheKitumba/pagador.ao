import type React from "react";

import { PortalShell } from "@/layouts/portal-shell";
import { SessionGate } from "@/providers/session-provider";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate>
      <PortalShell>{children}</PortalShell>
    </SessionGate>
  );
}
