"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/app";
import { useLogin } from "@/queries/auth/mutation";
import { type LoginFormValues, loginSchema } from "@/schemas/auth";
import { toastService } from "@/services/toast.service";

import { SmsSignInDialog, SsoSignInDialog } from "./alternative-sign-in";

// Only same-site paths, so `?next=` cannot be used as an open redirect.
function safeRedirectPath(next: string | null) {
  return next?.startsWith("/") && !next.startsWith("//") ? next : ROUTES.home;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) =>
    login.mutate(values, {
      onSuccess: () => router.replace(safeRedirectPath(searchParams.get("next"))),
      onError: toastService.apiError,
    });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-1 text-sm text-muted-foreground">Bem-vindo de volta. Introduza os seus dados para continuar.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="nome@empresa.co.ao" autoComplete="email" className="h-10" {...field} />
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
                <div className="flex items-center justify-between">
                  <FormLabel>Palavra-passe</FormLabel>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                    Esqueceu-se?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" autoComplete="current-password" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="h-10 w-full" disabled={login.isPending}>
            {login.isPending ? "A entrar…" : "Entrar"}
          </Button>
        </form>
      </Form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        ou
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-2">
        <SmsSignInDialog />
        <SsoSignInDialog />
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href={ROUTES.register} className="font-medium text-primary hover:underline underline-offset-4">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
