import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import type React from "react";

import { APP_DESCRIPTION, APP_NAME } from "@/config/app";
import { AppProvider } from "@/providers/app-provider";

import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: `${APP_NAME} - Sistema de RH e Folha de Pagamento`,
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={nunito.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
