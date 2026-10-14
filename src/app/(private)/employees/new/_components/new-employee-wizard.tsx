"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { type ComponentProps, useRef, useState } from "react";
import { type Control, type FieldPath, useForm } from "react-hook-form";

import { DescriptionList } from "@/components/common/cards";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatKz } from "@/lib/format";
import { cn } from "@/lib/utils";
import { departments, establishments, positions } from "@/mocks/people";
import { type EmployeeFormValues, employeeFormSteps, employeeSchema } from "@/schemas/employee";
import { toastService } from "@/services/toast.service";

const banks = ["BAI", "BFA", "BIC", "Standard Bank", "Banco Sol", "Millennium Atlântico", "BPC", "Banco Keve"];
const contractTypes = ["Por tempo indeterminado", "Por tempo determinado", "Período experimental", "Estágio profissional"];

function TextField({
  control,
  name,
  label,
  description,
  ...props
}: {
  control: Control<EmployeeFormValues>;
  name: FieldPath<EmployeeFormValues>;
  label: string;
  description?: string;
} & ComponentProps<typeof Input>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...props} {...field} value={field.value ?? ""} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SelectField({
  control,
  name,
  label,
  options,
  placeholder = "Escolher…",
}: {
  control: Control<EmployeeFormValues>;
  name: FieldPath<EmployeeFormValues>;
  label: string;
  options: string[];
  placeholder?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={String(field.value ?? "")}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function NewEmployeeWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      birthDate: "",
      bi: "",
      nif: "",
      phone: "+244 ",
      email: "",
      position: "",
      department: "",
      establishment: "",
      hireDate: "",
      contractType: "",
      baseSalary: undefined,
      bank: "",
      iban: "AO06 ",
    },
  });

  const current = employeeFormSteps[step];
  const isLast = step === employeeFormSteps.length - 1;
  const values = form.watch();

  const goTo = (next: number) => {
    setStep(next);
    // Move focus to the new step heading so keyboard and screen reader users keep their place.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const next = async () => {
    const valid = await form.trigger(current.fields);
    if (valid) goTo(step + 1);
  };

  const submit = form.handleSubmit((data) => {
    toastService.success("Trabalhador admitido", `${data.fullName} foi adicionado e o contrato está pronto a assinar.`);
    router.push("/employees");
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Passos da admissão" className="min-w-0">
        <ol className="flex gap-2 overflow-x-auto lg:flex-col">
          {employeeFormSteps.map((item, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <li key={item.id} className="min-w-40 lg:min-w-0">
                <button
                  type="button"
                  disabled={index > step}
                  onClick={() => goTo(index)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left disabled:cursor-not-allowed",
                    active && "bg-card shadow-card ring-1 ring-border",
                    !active && "hover:bg-accent",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      done && "bg-success text-success-foreground",
                      active && "bg-primary text-primary-foreground",
                      !done && !active && "border bg-card text-muted-foreground",
                    )}
                  >
                    {done ? <HugeiconsIcon icon={Tick02Icon} className="size-3.5" strokeWidth={2.5} aria-hidden /> : index + 1}
                  </span>
                  <span>
                    <span className={cn("block text-sm font-medium", !done && !active && "text-muted-foreground")}>{item.title}</span>
                    <span className="block text-xs text-muted-foreground">{item.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <Form {...form}>
        <form onSubmit={submit} noValidate className="min-w-0 rounded-xl border bg-card shadow-card">
          <div className="border-b px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Passo {step + 1} de {employeeFormSteps.length}
            </p>
            <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold tracking-tight outline-none">
              {current.title}
            </h2>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {current.id === "personal" && (
              <>
                <div className="sm:col-span-2">
                  <TextField control={form.control} name="fullName" label="Nome completo" autoComplete="name" />
                </div>
                <TextField control={form.control} name="birthDate" label="Data de nascimento" type="date" />
                <TextField control={form.control} name="bi" label="N.º do Bilhete de Identidade" placeholder="006512378LA041" />
                <TextField control={form.control} name="nif" label="NIF" placeholder="006512378LA041" description="Para pessoas singulares é igual ao n.º do BI." />
                <TextField control={form.control} name="phone" label="Telemóvel" type="tel" autoComplete="tel" />
                <div className="sm:col-span-2">
                  <TextField control={form.control} name="email" label="E-mail (opcional)" type="email" autoComplete="email" description="Sem e-mail, o trabalhador entra no portal com o telemóvel e um código SMS." />
                </div>
              </>
            )}

            {current.id === "job" && (
              <>
                <SelectField control={form.control} name="position" label="Cargo" options={positions.map((item) => item.title)} />
                <SelectField control={form.control} name="department" label="Departamento" options={departments.map((item) => item.name)} />
                <SelectField control={form.control} name="establishment" label="Estabelecimento" options={establishments} />
                <TextField control={form.control} name="hireDate" label="Data de admissão" type="date" />
              </>
            )}

            {current.id === "contract" && (
              <>
                <SelectField control={form.control} name="contractType" label="Tipo de contrato" options={contractTypes} />
                <TextField
                  control={form.control}
                  name="baseSalary"
                  label="Vencimento base (Kz)"
                  inputMode="decimal"
                  placeholder="300000"
                  description="Recebe um alerta se ficar abaixo do salário mínimo nacional em vigor."
                />
              </>
            )}

            {current.id === "payment" && (
              <>
                <SelectField control={form.control} name="bank" label="Banco" options={banks} />
                <TextField control={form.control} name="iban" label="IBAN" placeholder="AO06 0040 0000 1234 5678 1019 7" autoComplete="off" />
              </>
            )}

            {current.id === "review" && (
              <div className="sm:col-span-2">
                <DescriptionList
                  items={[
                    { label: "Nome", value: values.fullName },
                    { label: "BI / NIF", value: values.bi },
                    { label: "Telemóvel", value: values.phone },
                    { label: "E-mail", value: values.email || "—" },
                    { label: "Cargo", value: `${values.position} · ${values.department}` },
                    { label: "Estabelecimento", value: values.establishment },
                    { label: "Admissão", value: values.hireDate ? formatDate(values.hireDate) : "—" },
                    { label: "Contrato", value: values.contractType },
                    { label: "Vencimento base", value: values.baseSalary ? formatKz(Number(values.baseSalary)) : "—" },
                    { label: "Pagamento", value: `${values.bank} · ${values.iban}` },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => (step === 0 ? router.push("/employees") : goTo(step - 1))}>
              <HugeiconsIcon icon={ArrowLeft01Icon} aria-hidden />
              {step === 0 ? "Cancelar" : "Anterior"}
            </Button>
            {isLast ? (
              <Button type="submit">
                <HugeiconsIcon icon={Tick02Icon} aria-hidden />
                Admitir trabalhador
              </Button>
            ) : (
              <Button type="button" onClick={next}>
                Seguinte
                <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
