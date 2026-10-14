import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, StarIcon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

import { PageBody, PageHeader } from "@/components/common/page";
import { PersonAvatar } from "@/components/common/person-avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/lib/format";
import { feedbackItems } from "@/mocks/growth";

export const metadata: Metadata = { title: "Feedback" };

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        title="Feedback"
        icon={StarIcon}
        description="Feedback contínuo e reconhecimento"
        actions={
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
            <span className="hidden sm:inline">Dar feedback</span>
            <span className="sr-only sm:hidden">Dar feedback</span>
          </Button>
        }
      />
      <PageBody className="max-w-3xl">
        <ul className="space-y-4" aria-label="Feedback recente">
          {feedbackItems.map((item) => (
            <li key={`${item.from}-${item.date}`} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <PersonAvatar name={item.from} />
                <p className="min-w-0 flex-1 text-sm">
                  <span className="font-semibold">{item.from}</span>
                  <span className="text-muted-foreground"> para </span>
                  <span className="font-semibold">{item.to}</span>
                </p>
                <time className="shrink-0 text-xs text-muted-foreground" dateTime={item.date}>
                  {formatDateShort(item.date)}
                </time>
              </div>
              <blockquote className="mt-3 text-[15px] leading-relaxed">“{item.message}”</blockquote>
              <div className="mt-3 flex gap-2">
                <StatusBadge tone={item.kind === "Reconhecimento" ? "success" : "info"}>{item.kind}</StatusBadge>
                <StatusBadge tone="neutral" dot={false}>
                  {item.value}
                </StatusBadge>
              </div>
            </li>
          ))}
        </ul>
      </PageBody>
    </>
  );
}
