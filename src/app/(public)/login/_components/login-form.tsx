"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/app";
import { useLogin } from "@/queries/auth/mutation";
import { type LoginFormValues, loginSchema } from "@/schemas/auth";
import { toastService } from "@/services/toast.service";

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
    <Card className="w-full max-w-sm shadow-2xl py-8">
      <CardHeader>
        <CardTitle>Entra na sua conta</CardTitle>
        <CardDescription>Digite o seu email abaixo para fazer login na sua conta</CardDescription>
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
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "A entrar..." : "Entrar"}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={ROUTES.register}>Criar conta</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
