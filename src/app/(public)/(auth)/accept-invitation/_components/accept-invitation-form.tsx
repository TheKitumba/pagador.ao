"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ApiError } from "@api/lib/api-error";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAfterSignIn } from "@/hooks/use-after-sign-in";
import { useAcceptInvitationMutation } from "@/queries/auth/mutation";
import { type AcceptInvitationFormValues, acceptInvitationSchema } from "@/schemas/auth";
import { toastService } from "@/services/toast.service";

import { InvalidLink } from "../../_components/invalid-link";

export function AcceptInvitationForm({ token }: { token: string }) {
  const accept = useAcceptInvitationMutation();
  const afterSignIn = useAfterSignIn();
  const [expired, setExpired] = useState(false);

  const form = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: { name: "", password: "", confirmPassword: "" },
  });

  const onSubmit = ({ name, password }: AcceptInvitationFormValues) =>
    accept.mutate(
      { token, name: name.trim(), password },
      {
        onSuccess: ({ user }) => {
          if (!user) return;
          toastService.success(`Bem-vindo(a), ${user.name.split(" ")[0]}`);
          afterSignIn(user);
        },
        onError: (error) => {
          const apiError = ApiError.from(error);
          if (apiError.code === "invalid_invitation") setExpired(true);
          else if (apiError.fieldErrors.password) form.setError("password", { message: apiError.fieldErrors.password.join(". ") });
          else toastService.apiError(apiError);
        },
      },
    );

  if (expired) {
    return (
      <InvalidLink
        title="Convite expirado"
        description="Este convite já foi aceite ou passou dos 7 dias de validade. Peça a quem o convidou que envie um novo."
        action="login"
      />
    );
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold tracking-tight text-white">Aceitar convite</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">Crie o seu acesso à conta da empresa no Pagador.ao.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input autoComplete="name" className="h-10" {...field} />
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
                  <Input type="password" autoComplete="new-password" className="h-10" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">Pelo menos 8 caracteres, com letras e números.</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetir palavra-passe</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="btn-glossy h-10 w-full" disabled={accept.isPending}>
            {accept.isPending ? "A entrar…" : "Aceitar e entrar"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Já tem conta no Pagador.ao com este e-mail? Mantém a palavra-passe actual: o convite apenas lhe dá acesso a esta empresa.
          </p>
        </form>
      </Form>
    </div>
  );
}
