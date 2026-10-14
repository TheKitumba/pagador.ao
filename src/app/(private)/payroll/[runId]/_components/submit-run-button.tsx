"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toastService } from "@/services/toast.service";

/** Submit for approval; blocked while there are blocking alerts, and says why. */
export function SubmitRunButton({ blocking }: { blocking: number }) {
  const disabled = blocking > 0;
  const reason = `Resolva ${blocking} ${blocking === 1 ? "alerta bloqueante" : "alertas bloqueantes"} antes de submeter.`;

  const button = (
    <Button
      aria-disabled={disabled}
      aria-describedby={disabled ? "submit-blocked-reason" : undefined}
      className={disabled ? "cursor-not-allowed opacity-60" : undefined}
      onClick={() =>
        disabled
          ? toastService.error("Não é possível submeter", reason)
          : toastService.success("Folha submetida para aprovação", "O aprovador financeiro foi notificado.")
      }
    >
      <HugeiconsIcon icon={SentIcon} aria-hidden />
      <span className="hidden sm:inline">Submeter para aprovação</span>
      <span className="sr-only sm:hidden">Submeter para aprovação</span>
    </Button>
  );

  if (!disabled) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent id="submit-blocked-reason">{reason}</TooltipContent>
    </Tooltip>
  );
}
