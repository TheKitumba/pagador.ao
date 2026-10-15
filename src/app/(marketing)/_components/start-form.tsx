"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/config/app";
import { cn } from "@/lib/utils";

/** Starts sign-up from the landing page: the e-mail is carried to the registration form. */
export function StartForm({ className, tone = "default" }: { className?: string; tone?: "default" | "inverted" }) {
  const router = useRouter();
  const inputId = useId();
  const [email, setEmail] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    router.push(value ? `${ROUTES.register}?email=${encodeURIComponent(value)}` : ROUTES.register);
  };

  return (
    <form onSubmit={onSubmit} className={cn("flex w-full max-w-md flex-col gap-2 sm:flex-row", className)}>
      <label htmlFor={inputId} className="sr-only">
        E-mail profissional
      </label>
      <Input
        id={inputId}
        type="email"
        autoComplete="email"
        placeholder="nome@empresa.co.ao"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={cn(
          "h-11 flex-1",
          tone === "inverted" ? "border-neutral-700 bg-neutral-900 text-neutral-100 placeholder:text-neutral-500 dark:bg-background" : "bg-card",
        )}
      />
      <Button type="submit" size="lg" className={cn("h-11 px-5", tone === "inverted" && "bg-white text-neutral-950 hover:bg-neutral-200")}>
        Criar conta grátis
        <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden />
      </Button>
    </form>
  );
}
