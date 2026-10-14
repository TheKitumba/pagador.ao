import type React from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40 p-4">{children}</main>
  );
}
