import type React from "react";

import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";

/**
 * The landing page is dark-only (design after raycast.com). The `dark` class switches the design
 * tokens for this subtree, so shared UI components (Input, Slider, Accordion) render dark too.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark flex min-h-dvh flex-col bg-[#07080a] text-neutral-200 [color-scheme:dark]">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-neutral-900 focus:px-3 focus:py-2 focus:text-sm"
      >
        Saltar para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
