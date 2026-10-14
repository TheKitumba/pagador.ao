import { cookies } from "next/headers";
import type React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";
import { CommandMenu } from "./command-menu";

export async function AppShell({ children }: { children: React.ReactNode }) {
  // Remember whether the sidebar was collapsed (cookie written by SidebarProvider).
  const defaultOpen = (await cookies()).get("sidebar:state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar para o conteúdo
      </a>
      <AppSidebar />
      <SidebarInset id="main-content" tabIndex={-1} className="min-w-0 outline-none">
        {children}
      </SidebarInset>
      <CommandMenu />
    </SidebarProvider>
  );
}
