"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROUTES } from "@/config/app";
import { useRegisterMutation } from "@/queries/auth/mutation";
import { companySizes, provinces, type RegisterFormValues, registerSchema } from "@/schemas/auth";
import { toastService } from "@/services/toast.service";

export function RegisterForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const router = useRouter();
  const register = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: defaultEmail, password: "", companyName: "", companyNif: "" },
  });

  const onSubmit = ({ companyName, companyNif, companySize, province, acceptTerms: _accepted, ...owner }: RegisterFormValues) =>
    register.mutate(
      { ...owner, company: { name: companyName, nif: companyNif, size: companySize, province } },
      { onSuccess: () => router.replace("/onboarding"), onError: toastService.apiError },
    );

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold tracking-tight text-white">Criar a conta da empresa</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">30 dias grátis, sem cartão. A seguir, configuramos a empresa consigo.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6">
          <fieldset className="space-y-4">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">O responsável</legend>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail profissional</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="nome@empresa.co.ao" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palavra-passe</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Pelo menos 8 caracteres, com letras e números.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">A empresa</legend>
            <FormField
              control={form.control}
              name="companyName"
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
              name="companyNif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIF da empresa</FormLabel>
                  <FormControl>
                    <Input inputMode="numeric" placeholder="5417089621" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensão</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolher…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
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
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Província</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
            </div>
          </fieldset>

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox checked={field.value === true} onCheckedChange={(checked) => field.onChange(checked === true)} className="mt-0.5" />
                  </FormControl>
                  <FormLabel className="text-sm font-normal leading-snug">
                    Aceito os <a href="https://pagador.ao/termos" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">termos de utilização<span className="sr-only"> (abre num novo separador)</span></a> e a{" "}
                    <a href="https://pagador.ao/privacidade" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">política de privacidade<span className="sr-only"> (abre num novo separador)</span></a> (Lei n.º 22/11).
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="btn-glossy h-10 w-full" disabled={register.isPending}>
            {register.isPending ? "A criar conta…" : "Criar conta"}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </div>
  );
}
