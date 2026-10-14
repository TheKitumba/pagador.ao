"use client";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { FormDialog } from "@/components/common/form-dialog";
import { Button } from "@/components/ui/button";
import { forms } from "@/config/forms";
import type { ContractAlert } from "@/mocks/people";

export function ContractActions({ type, employee, endDate }: { type: ContractAlert; employee: string; endDate: string }) {
  if (type === "probation") {
    return (
      <div className="flex justify-end gap-2">
        <FormDialog
          variant="sheet"
          title={`Avaliar período experimental — ${employee}`}
          description={`Termina a ${endDate}. A avaliação fica no processo individual.`}
          submitLabel="Guardar avaliação"
          successTitle="Avaliação guardada"
          fields={[
            { name: "rating", label: "Avaliação global", type: "select", required: true, full: true, options: ["Excede as expectativas", "Cumpre as expectativas", "Cumpre parcialmente", "Não cumpre"] },
            { name: "recommendation", label: "Recomendação", type: "select", required: true, full: true, options: ["Confirmar admissão", "Prolongar acompanhamento", "Não confirmar"] },
            { name: "strengths", label: "Pontos fortes", type: "textarea" },
            { name: "improve", label: "A melhorar", type: "textarea" },
          ]}
          trigger={
            <Button variant="outline" size="sm">
              Avaliar<span className="sr-only"> {employee}</span>
            </Button>
          }
        />
        <ConfirmDialog
          title="Confirmar admissão definitiva?"
          description={<p>{employee} passa a contrato sem período experimental a partir de {endDate}. O trabalhador é notificado.</p>}
          confirmLabel="Confirmar admissão"
          successTitle="Admissão confirmada"
          successDescription={employee}
          trigger={
            <Button size="sm">
              Confirmar<span className="sr-only"> {employee}</span>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <ConfirmDialog
        tone="danger"
        title={`Não renovar o contrato de ${employee}?`}
        description={
          <>
            <p>O contrato caduca a {endDate}. É gerada a comunicação de caducidade com a antecedência legal e iniciado o acerto final de contas.</p>
            <p>Esta decisão fica registada na auditoria.</p>
          </>
        }
        reason={{ label: "Motivo da não renovação", required: true }}
        confirmLabel="Não renovar"
        successTitle="Caducidade comunicada"
        successDescription={employee}
        trigger={
          <Button variant="outline" size="sm">
            Não renovar<span className="sr-only"> {employee}</span>
          </Button>
        }
      />
      <FormDialog
        {...forms.renewContract}
        title={`Renovar contrato — ${employee}`}
        trigger={
          <Button size="sm">
            Renovar<span className="sr-only"> {employee}</span>
          </Button>
        }
      />
    </div>
  );
}
