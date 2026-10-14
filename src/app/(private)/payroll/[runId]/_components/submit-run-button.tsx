"use client";

import { SentIcon } from "@hugeicons/core-free-icons";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { HeaderButton } from "@/components/common/header-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toastService } from "@/services/toast.service";

/** Submit for approval; blocked (with the reason) while there are blocking alerts, otherwise asks for confirmation. */
export function SubmitRunButton({ blocking }: { blocking: number }) {
  const label = "Submeter para aprovação";

  if (blocking > 0) {
    const reason = `Resolva ${blocking} ${blocking === 1 ? "alerta bloqueante" : "alertas bloqueantes"} antes de submeter.`;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <HeaderButton
            icon={SentIcon}
            label={label}
            aria-disabled
            aria-describedby="submit-blocked-reason"
            className="cursor-not-allowed opacity-60"
            onClick={() => toastService.error("Não é possível submeter", reason)}
          />
        </TooltipTrigger>
        <TooltipContent id="submit-blocked-reason">{reason}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <ConfirmDialog
      title="Submeter a folha para aprovação?"
      description={
        <>
          <p>Depois de submetida, a folha deixa de poder ser editada até ser aprovada ou devolvida.</p>
          <p>Quem calculou a folha não a pode aprovar: o pedido segue para o aprovador financeiro.</p>
        </>
      }
      confirmLabel="Submeter"
      successTitle="Folha submetida para aprovação"
      successDescription="O aprovador financeiro foi notificado."
      trigger={<HeaderButton icon={SentIcon} label={label} />}
    />
  );
}
