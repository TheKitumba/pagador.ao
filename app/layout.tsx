import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import type React from 'react';
import './globals.css';

const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

export const metadata: Metadata = {
  title: 'Pagador.ao - Sistema de RH e Folha de Pagamento',
  description: 'Sistema completo de gestão de recursos humanos e folha de pagamento',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={ubuntu.className}>
        <ThemeProvider defaultTheme="light">
          <div>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
