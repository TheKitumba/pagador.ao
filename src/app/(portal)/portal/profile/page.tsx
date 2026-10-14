import type { Metadata } from "next";

import { DescriptionList, SectionCard } from "@/components/common/cards";
import { PersonAvatar } from "@/components/common/person-avatar";
import { SensitiveValue } from "@/components/common/sensitive-value";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { findEmployee } from "@/mocks/people";

export const metadata: Metadata = { title: "O meu perfil" };

export default function PortalProfilePage() {
  const me = findEmployee("emp-001")!;

  return (
    <>
      <div className="flex items-center gap-4">
        <PersonAvatar name={me.name} size="lg" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{me.name}</h1>
          <p className="text-sm text-muted-foreground">
            {me.position} · N.º {me.number}
          </p>
        </div>
      </div>
      <SectionCard title="Dados pessoais" action={<Button variant="outline" size="sm">Pedir alteração</Button>}>
        <DescriptionList
          items={[
            { label: "Data de nascimento", value: formatDate(me.birthDate) },
            { label: "NIF", value: me.nif },
            { label: "Telemóvel", value: me.phone },
            { label: "E-mail", value: me.email },
          ]}
        />
      </SectionCard>
      <SectionCard title="Conta bancária" description="As alterações são validadas pelos Recursos Humanos antes do próximo pagamento">
        <DescriptionList
          items={[
            { label: "Banco", value: me.bank },
            { label: "IBAN", value: <SensitiveValue value={me.iban} label="IBAN" /> },
          ]}
        />
      </SectionCard>
    </>
  );
}
