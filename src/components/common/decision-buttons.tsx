"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { StatusBadge } from "./status-badge";

/** Approve / reject a pending request inline, with an undo in the confirmation toast. */
export function DecisionButtons({ subject }: { subject: string }) {
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);

  const decide = (value: "approved" | "rejected") => {
    setDecision(value);
    toast.success(value === "approved" ? "Pedido aprovado" : "Pedido rejeitado", {
      description: subject,
      action: { label: "Anular", onClick: () => setDecision(null) },
    });
  };

  if (decision) {
    return (
      <StatusBadge tone={decision === "approved" ? "success" : "danger"}>
        {decision === "approved" ? "Aprovado" : "Rejeitado"}
      </StatusBadge>
    );
  }

  return (
    <div className="flex justify-end gap-1.5">
      <Button variant="outline" size="icon-sm" onClick={() => decide("rejected")} aria-label={`Rejeitar: ${subject}`}>
        <HugeiconsIcon icon={Cancel01Icon} />
      </Button>
      <Button size="icon-sm" onClick={() => decide("approved")} aria-label={`Aprovar: ${subject}`}>
        <HugeiconsIcon icon={Tick02Icon} />
      </Button>
    </div>
  );
}
