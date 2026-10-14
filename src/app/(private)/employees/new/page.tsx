import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { PageBody, PageHeader } from "@/components/common/page";
import { Button } from "@/components/ui/button";

import { NewEmployeeWizard } from "./_components/new-employee-wizard";

export const metadata: Metadata = { title: "Admitir trabalhador" };

export default function NewEmployeePage() {
  return (
    <>
      <PageHeader
        title="Admitir trabalhador"
        icon={UserAdd01Icon}
        leading={
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/employees" aria-label="Voltar a Trabalhadores">
              <HugeiconsIcon icon={ArrowLeft01Icon} />
            </Link>
          </Button>
        }
      />
      <PageBody className="max-w-5xl">
        <NewEmployeeWizard />
      </PageBody>
    </>
  );
}
