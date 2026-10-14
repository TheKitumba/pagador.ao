"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsString, useQueryState } from "nuqs";
import { type ReactNode, Suspense, useId, useMemo, useState } from "react";
import { type ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { employees } from "@/mocks/people";
import { toastService } from "@/services/toast.service";

export type FieldType = "text" | "email" | "tel" | "number" | "money" | "date" | "select" | "employee" | "textarea" | "file" | "switch";

/** Serializable field description, so server components can declare forms. */
export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
  /** Takes the full row in the two-column layout. */
  full?: boolean;
  defaultValue?: string | number | boolean;
  min?: number;
  accept?: string;
}

const REQUIRED = "Campo obrigatório";

function fieldSchema(field: FieldConfig) {
  switch (field.type) {
    case "number":
    case "money": {
      const number = z.coerce.number({ invalid_type_error: "Indique um número" }).min(field.min ?? 0, `Valor mínimo: ${field.min ?? 0}`);
      return field.required
        ? z.preprocess((value) => (value === "" ? undefined : value), number.refine((value) => value !== undefined, REQUIRED))
        : z.preprocess((value) => (value === "" ? undefined : value), number.optional());
    }
    case "switch":
      return z.boolean();
    case "file":
      return field.required
        ? z.custom<FileList>((value) => value instanceof FileList && value.length > 0, REQUIRED)
        : z.custom<FileList | undefined>(() => true);
    case "email": {
      const email = z.string().trim();
      return field.required ? email.min(1, REQUIRED).email("E-mail inválido") : email.email("E-mail inválido").or(z.literal(""));
    }
    case "tel": {
      const tel = z.string().trim().regex(/^(\+244\s?)?9\d{2}\s?\d{3}\s?\d{3}$/, "Formato: +244 9XX XXX XXX");
      return field.required ? tel : tel.or(z.literal(""));
    }
    default: {
      const text = z.string().trim();
      return field.required ? text.min(1, REQUIRED) : text;
    }
  }
}

function defaultFor(field: FieldConfig) {
  if (field.defaultValue !== undefined) return field.defaultValue;
  if (field.type === "switch") return false;
  if (field.type === "file") return undefined;
  return "";
}

interface FormDialogProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  fields: FieldConfig[];
  submitLabel?: string;
  successTitle: string;
  successDescription?: string;
  /** "sheet" for longer forms or editing records next to the page content. */
  variant?: "dialog" | "sheet";
  /** Opens automatically when the URL has `?<openParam>=<openValue>` (used by the global "Criar" menu). */
  openParam?: string;
  openValue?: string;
  onSubmitted?: (values: Record<string, unknown>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Reads the query string (`openParam`), so it renders inside Suspense to keep static pages pre-renderable. */
export function FormDialog(props: FormDialogProps) {
  return (
    <Suspense fallback={props.trigger ?? null}>
      <FormDialogInner {...props} />
    </Suspense>
  );
}

function FormDialogInner({
  trigger,
  title,
  description,
  fields,
  submitLabel = "Guardar",
  successTitle,
  successDescription,
  variant = "dialog",
  openParam,
  openValue = "1",
  onSubmitted,
  open: controlledOpen,
  onOpenChange,
}: FormDialogProps) {
  const [param, setParam] = useQueryState(openParam ?? "__none", parseAsString);
  const [localOpen, setLocalOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formId = useId();

  const open = controlledOpen ?? (localOpen || (Boolean(openParam) && param === openValue));
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    setLocalOpen(next);
    if (!next && openParam && param) setParam(null);
    if (!next) form.reset();
  };

  const schema = useMemo(() => z.object(Object.fromEntries(fields.map((field) => [field.name, fieldSchema(field)]))), [fields]);
  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(fields.map((field) => [field.name, defaultFor(field)])),
  });

  const submit = form.handleSubmit(async (values) => {
    setPending(true);
    // Stand-in for the API call: keeps the pending state visible and the flow realistic.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPending(false);
    onSubmitted?.(values);
    toastService.success(successTitle, successDescription);
    setOpen(false);
  });

  const renderControl = (config: FieldConfig, field: ControllerRenderProps<Record<string, unknown>, string>) => {
    switch (config.type) {
      case "textarea":
        return <Textarea rows={4} placeholder={config.placeholder} {...field} value={String(field.value ?? "")} />;
      case "select":
      case "employee": {
        const options = config.type === "employee" ? employees.filter((e) => e.status !== "terminated").map((e) => e.name) : (config.options ?? []);
        return (
          <Select value={String(field.value ?? "")} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
                <SelectValue placeholder={config.placeholder ?? "Escolher…"} />
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
        );
      }
      case "switch":
        return <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} ref={field.ref} />;
      case "file":
        return (
          <Input
            type="file"
            accept={config.accept}
            className="h-auto py-1.5"
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.files ?? undefined)}
          />
        );
      default:
        return (
          <Input
            type={config.type === "money" ? "text" : (config.type ?? "text")}
            inputMode={config.type === "money" || config.type === "number" ? "decimal" : undefined}
            placeholder={config.placeholder ?? (config.type === "money" ? "0,00" : undefined)}
            {...field}
            value={String(field.value ?? "")}
          />
        );
    }
  };

  const body = (
    <Form {...form}>
      <form id={formId} onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        {fields.map((config) => (
          <FormField
            key={config.name}
            control={form.control}
            name={config.name}
            render={({ field }) => (
              <FormItem className={cn((config.full || config.type === "textarea" || config.type === "file") && "sm:col-span-2", config.type === "switch" && "flex items-center justify-between gap-4 space-y-0 rounded-lg border p-3 sm:col-span-2")}>
                <div className={config.type === "switch" ? "space-y-0.5" : "contents"}>
                  <FormLabel>
                    {config.label}
                    {config.required && <span aria-hidden className="text-destructive"> *</span>}
                  </FormLabel>
                  {config.description && config.type === "switch" && <FormDescription>{config.description}</FormDescription>}
                </div>
                {config.type === "select" || config.type === "employee" ? (
                  renderControl(config, field)
                ) : (
                  <FormControl>{renderControl(config, field)}</FormControl>
                )}
                {config.description && config.type !== "switch" && <FormDescription>{config.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );

  const actions = (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <Button type="submit" form={formId} disabled={pending}>
        {pending ? "A guardar…" : submitLabel}
      </Button>
    </>
  );

  if (variant === "sheet") {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
          <SheetHeader className="border-b px-6 py-4 text-left">
            <SheetTitle>{title}</SheetTitle>
            {description ? <SheetDescription>{description}</SheetDescription> : <SheetDescription className="sr-only">{title}</SheetDescription>}
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">{body}</div>
          <SheetFooter className="gap-2 border-t px-6 py-4">{actions}</SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[90dvh] gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-6 py-4 text-left">
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : <DialogDescription className="sr-only">{title}</DialogDescription>}
        </DialogHeader>
        <div className="max-h-[65dvh] overflow-y-auto px-6 py-5">{body}</div>
        <DialogFooter className="gap-2 border-t bg-muted/30 px-6 py-3">{actions}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
