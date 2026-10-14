import { BookOpen01Icon, Call02Icon, CustomerSupportIcon, Mail01Icon, Message01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { IconTile, SectionCard } from "@/components/common/cards";
import { PageBody, PageHeader } from "@/components/common/page";
import { helpArticles } from "@/mocks/inbox";

import { ArticleSheet } from "./_components/article-sheet";

export const metadata: Metadata = { title: "Central de ajuda" };

export default function HelpPage() {
  const categories = [...new Set(helpArticles.map((article) => article.category))];

  return (
    <>
      <PageHeader title="Central de ajuda" icon={CustomerSupportIcon} description="Artigos, guias e contacto com o suporte" />
      <PageBody className="max-w-5xl">
        <div className="rounded-xl border bg-card px-6 py-8 text-center shadow-card">
          <h2 className="text-2xl font-semibold tracking-tight">Como podemos ajudar?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Use a pesquisa (⌘K ou /) para encontrar páginas e guias, ou fale connosco.</p>
          <ul className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { icon: Message01Icon, title: "Chat", detail: "Seg–Sex, 08:00–18:00", href: "/messages" },
              { icon: Call02Icon, title: "+244 222 000 000", detail: "Linha de apoio", href: "tel:+244222000000" },
              { icon: Mail01Icon, title: "suporte@pagador.ao", detail: "Resposta em 4 h úteis", href: "mailto:suporte@pagador.ao" },
            ].map((item) => (
              <li key={item.title}>
                <a href={item.href} className="flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent">
                  <IconTile icon={item.icon} tone="info" />
                  <span>
                    <span className="block text-sm font-medium">{item.title}</span>
                    <span className="block text-xs text-muted-foreground">{item.detail}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <SectionCard key={category} title={category} contentClassName="px-2 pb-2">
              <ul>
                {helpArticles
                  .filter((article) => article.category === category)
                  .map((article) => (
                    <li key={article.title}>
                      <ArticleSheet title={article.title} category={article.category} minutes={article.minutes} />
                    </li>
                  ))}
              </ul>
            </SectionCard>
          ))}
        </div>
      </PageBody>
    </>
  );
}
