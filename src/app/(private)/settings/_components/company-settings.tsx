"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError } from "@api/lib/api-error";
import type { Company, Establishment } from "@api/types/organization";
import { SectionCard } from "@/components/common/cards";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useCan } from "@/providers/session-provider";
import {
  useArchiveEstablishmentMutation,
  useCreateEstablishmentMutation,
  useUpdateCompanyMutation,
  useUpdateEstablishmentMutation,
} from "@/queries/organization/mutation";
import { useCompanyQuery, useEstablishmentsQuery } from "@/queries/organization/query";
import { provinces } from "@/schemas/auth";
import { toastService } from "@/services/toast.service";

const SIZE_LABEL: Record<Company["sizeClass"], string> = {
  MICRO: "Micro (1–10 trabalhadores)",
  SMALL: "Pequena (11–50)",
  MEDIUM: "Média (51–250)",
  LARGE: "Grande (mais de 250)",
};

/** Same rules as PATCH /company. */
const companySchema = z.object({
  legalName: z.string().trim().min(2, "Indique a denominação social"),
  tradeName: z.string().trim().min(2, "Indique o nome comercial"),
  nif: z.string().trim().regex(/^\d{10}$/, "O NIF da empresa tem 10 dígitos"),
  socialSecurityNumber: z.string().trim(),
  activityCode: z.string().trim(),
  province: z.string(),
  address: z.string().trim(),
  careersSlug: z
    .string()
    .trim()
    .refine((value) => value === "" || /^[a-z0-9-]{3,60}$/.test(value), "Só letras minúsculas, números e hífenes (3 a 60)"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

const toForm = (company: Company): CompanyFormValues => ({
  legalName: company.legalName,
  tradeName: company.tradeName,
  nif: company.nif,
  socialSecurityNumber: company.socialSecurityNumber ?? "",
  activityCode: company.activityCode ?? "",
  province: company.province ?? "",
  address: company.address ?? "",
  careersSlug: company.careersSlug ?? "",
});

// Radix Select reports "" when its value is set programmatically (form.reset after loading); there is
// no "none" option, so an empty value is never a choice and is ignored instead of wiping the field.

/** Optional fields travel as null when cleared. */
const orNull = (value: string) => (value === "" ? null : value);

/** Applies field errors from the API (ValidationError → `errors`) to the form, or toasts the message. */
function reportApiError<T extends string>(error: unknown, setError: (field: T, error: { message: string }) => void, fields: readonly T[]) {
  const apiError = ApiError.from(error);
  const fieldErrors = Object.entries(apiError.fieldErrors).filter(([field]) => fields.includes(field as T));
  if (fieldErrors.length === 0) return toastService.apiError(apiError);
  for (const [field, messages] of fieldErrors) setError(field as T, { message: messages.join(". ") });
}

export function CompanySettings() {
  return (
    <>
      <CompanyProfile />
      <Establishments />
    </>
  );
}

function CompanyProfile() {
  const canEdit = useCan("settings.write");
  const company = useCompanyQuery();
  const update = useUpdateCompanyMutation();
  const form = useForm<CompanyFormValues>({ resolver: zodResolver(companySchema), defaultValues: company.data ? toForm(company.data) : undefined });

  // Load the company into the form, and again after a save or a company switch.
  useEffect(() => {
    if (company.data) form.reset(toForm(company.data));
  }, [company.data, form]);

  const onSubmit = (values: CompanyFormValues) =>
    update.mutate(
      {
        legalName: values.legalName,
        tradeName: values.tradeName,
        nif: values.nif,
        socialSecurityNumber: orNull(values.socialSecurityNumber),
        activityCode: orNull(values.activityCode),
        province: orNull(values.province),
        address: orNull(values.address),
        careersSlug: orNull(values.careersSlug),
      },
      {
        onSuccess: () => toastService.success("Dados da empresa guardados"),
        onError: (error) => reportApiError(error, form.setError, Object.keys(companySchema.shape) as (keyof CompanyFormValues)[]),
      },
    );

  return (
    <SectionCard title="Dados da entidade empregadora" description="Aparecem nos recibos, contratos e mapas fiscais">
      {company.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="A carregar">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : company.isError ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-destructive">{ApiError.from(company.error).message}</p>
          <Button variant="outline" size="sm" onClick={() => company.refetch()}>
            Tentar de novo
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
            <fieldset disabled={!canEdit || update.isPending} className="contents">
              <FormField
                control={form.control}
                name="legalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Denominação social</FormLabel>
                    <FormControl>
                      <Input autoComplete="organization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tradeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome comercial</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>O nome curto, usado na aplicação e no portal.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIF</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="socialSecurityNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N.º de contribuinte do INSS</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CAE (actividade)</FormLabel>
                    <FormControl>
                      <Input placeholder="52100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Província da sede</FormLabel>
                    <Select onValueChange={(value) => value && field.onChange(value)} value={field.value || undefined} disabled={!canEdit}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolher…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Morada da sede</FormLabel>
                    <FormControl>
                      <Input autoComplete="street-address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="careersSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Página de carreiras</FormLabel>
                    <FormControl>
                      <Input placeholder="kianda-logistica" {...field} />
                    </FormControl>
                    <FormDescription>{field.value ? `Endereço: /careers/${field.value}` : "Sem página pública de vagas."}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <p className="text-sm font-medium">Dimensão</p>
                <p className="flex h-9 items-center text-sm text-muted-foreground">{company.data ? SIZE_LABEL[company.data.sizeClass] : "—"}</p>
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center justify-end gap-3 sm:col-span-2">
              {canEdit ? (
                <>
                  <Button type="button" variant="ghost" disabled={!form.formState.isDirty || update.isPending} onClick={() => company.data && form.reset(toForm(company.data))}>
                    Repor
                  </Button>
                  <Button type="submit" disabled={!form.formState.isDirty || update.isPending}>
                    {update.isPending ? "A guardar…" : "Guardar alterações"}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Só quem gere as configurações pode alterar estes dados.</p>
              )}
            </div>
          </form>
        </Form>
      )}
    </SectionCard>
  );
}

const establishmentSchema = z.object({
  name: z.string().trim().min(2, "Indique o nome do estabelecimento"),
  province: z.string(),
  address: z.string().trim(),
  geoPunch: z.boolean(),
});

type EstablishmentFormValues = z.infer<typeof establishmentSchema>;

function Establishments() {
  const canEdit = useCan("organization.write");
  const establishments = useEstablishmentsQuery();
  const archive = useArchiveEstablishmentMutation();
  const [editing, setEditing] = useState<Establishment | "new" | null>(null);
  const [archiving, setArchiving] = useState<Establishment | null>(null);

  return (
    <SectionCard
      title="Estabelecimentos"
      description="Usados na assiduidade, nos centros de custo e nos relatórios"
      contentClassName="px-2 pb-2"
      action={
        canEdit ? (
          <Button variant="outline" size="sm" onClick={() => setEditing("new")}>
            Adicionar
          </Button>
        ) : undefined
      }
    >
      {establishments.isPending ? (
        <div className="space-y-2 p-2" role="status" aria-label="A carregar">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : establishments.isError ? (
        <p className="px-3 py-3 text-sm text-destructive">{ApiError.from(establishments.error).message}</p>
      ) : establishments.data.length === 0 ? (
        <p className="px-3 py-3 text-sm text-muted-foreground">Ainda não há estabelecimentos.</p>
      ) : (
        <ul className="divide-y">
          {establishments.data.map((site) => (
            <li key={site.id} className="flex items-center justify-between gap-3 px-3 py-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium">{site.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{[site.province, site.address].filter(Boolean).join(" · ") || "Sem morada"}</span>
              </span>
              {canEdit && (
                <span className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(site)}>
                    Editar<span className="sr-only"> {site.name}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setArchiving(site)}>
                    Arquivar<span className="sr-only"> {site.name}</span>
                  </Button>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <EstablishmentDialog establishment={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={archiving !== null}
        onOpenChange={(open) => !open && setArchiving(null)}
        title={`Arquivar ${archiving?.name ?? "estabelecimento"}?`}
        description={<p>Deixa de aparecer nas listas e no ponto. O histórico de assiduidade mantém-se.</p>}
        confirmLabel="Arquivar"
        tone="danger"
        onConfirm={() =>
          archiving &&
          archive.mutate(archiving.id, {
            onSuccess: () => toastService.success("Estabelecimento arquivado", archiving.name),
            onError: toastService.apiError,
            onSettled: () => setArchiving(null),
          })
        }
      />
    </SectionCard>
  );
}

function EstablishmentDialog({ establishment, onClose }: { establishment: Establishment | "new" | null; onClose: () => void }) {
  const create = useCreateEstablishmentMutation();
  const update = useUpdateEstablishmentMutation();
  const isNew = establishment === "new";
  const pending = create.isPending || update.isPending;

  const form = useForm<EstablishmentFormValues>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: { name: "", province: "", address: "", geoPunch: true },
  });

  useEffect(() => {
    if (!establishment) return;
    form.reset(
      establishment === "new"
        ? { name: "", province: "", address: "", geoPunch: true }
        : { name: establishment.name, province: establishment.province ?? "", address: establishment.address ?? "", geoPunch: establishment.geoPunch },
    );
  }, [establishment, form]);

  const onSubmit = (values: EstablishmentFormValues) => {
    const payload = { name: values.name, geoPunch: values.geoPunch, province: values.province || undefined, address: values.address || undefined };
    const options = {
      onSuccess: () => {
        toastService.success(isNew ? "Estabelecimento criado" : "Estabelecimento guardado", values.name);
        onClose();
      },
      onError: (error: unknown) => reportApiError(error, form.setError, ["name", "province", "address"] as const),
    };
    if (establishment === "new") create.mutate(payload, options);
    else if (establishment) update.mutate({ id: establishment.id, ...payload }, options);
  };

  return (
    <Dialog open={establishment !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? "Novo estabelecimento" : "Editar estabelecimento"}</DialogTitle>
          <DialogDescription>Sede, armazéns, lojas ou obras onde os trabalhadores marcam o ponto.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="establishment-form" onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Armazém do Lobito" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Província</FormLabel>
                  <Select onValueChange={(value) => value && field.onChange(value)} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolher…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Morada</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="geoPunch"
              render={({ field }) => (
                <FormItem className="flex items-start justify-between gap-4 space-y-0">
                  <div>
                    <FormLabel>Exigir localização no ponto</FormLabel>
                    <FormDescription>A marcação só é aceite perto do estabelecimento.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="establishment-form" disabled={pending}>
            {pending ? "A guardar…" : isNew ? "Criar" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
