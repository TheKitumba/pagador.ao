import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Página não encontrada</h1>
      <p className="max-w-sm text-sm text-muted-foreground">A página que procura não existe ou foi movida. Verifique o endereço ou volte ao início.</p>
      <Button asChild className="mt-4">
        <Link href="/">Voltar ao início</Link>
      </Button>
    </main>
  );
}
