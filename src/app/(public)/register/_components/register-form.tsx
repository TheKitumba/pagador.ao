"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/app";
import { useRegister } from "@/queries/auth/mutation";
import { type RegisterFormValues, registerSchema } from "@/schemas/auth";
import { toastService } from "@/services/toast.service";

export function RegisterForm() {
  const router = useRouter();
  const register = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: RegisterFormValues) =>
    register.mutate(values, {
      onSuccess: () => router.replace(ROUTES.home),
      onError: toastService.apiError,
    });

  return (
    <Card className="w-full max-w-sm shadow-2xl py-8">
      <CardHeader>
        <CardTitle>Seja bem-vindo</CardTitle>
        <CardDescription>Crie a sua conta e gerencie RH da sua empresa de forma simples</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardContent className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="m@example.com" autoComplete="email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending ? "A criar conta..." : "Criar conta"}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={ROUTES.login}>Entrar</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
