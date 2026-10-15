"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { ROUTES } from "@/config/app";
import { cn } from "@/lib/utils";

import { glossyButton } from "./primitives";

/** Starts sign-up from the landing page: the e-mail is carried to the registration form. */
export function StartForm({ className }: { className?: string }) {
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
      <input
        id={inputId}
        type="email"
        autoComplete="email"
        placeholder="nome@empresa.co.ao"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="h-11 w-full rounded-xl sm:flex-1 border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-neutral-500 focus-visible:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 sm:text-sm"
      />
      <button type="submit" className={glossyButton}>
        Criar conta grátis
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" aria-hidden />
      </button>
    </form>
  );
}
