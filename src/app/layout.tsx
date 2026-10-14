import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";

import { APP_DESCRIPTION, APP_NAME } from "@/config/app";
import { AppProvider } from "@/providers/app-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${APP_NAME} — RH e folha de pagamento`, template: `%s · ${APP_NAME}` },
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
