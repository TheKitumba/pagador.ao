"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";

import { IconTile } from "@/components/common/cards";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function NoticeSheet({ title, detail, body }: { title: string; detail: string; body: string }) {
  return (
    <Sheet>
      <SheetTrigger className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-accent">
        <IconTile icon={Megaphone01Icon} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{title}</span>
          <span className="block text-xs text-muted-foreground">{detail}</span>
        </span>
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 text-muted-foreground" aria-hidden />
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl sm:mx-auto sm:max-w-lg">
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{detail}</SheetDescription>
        </SheetHeader>
        <p className="mt-4 pb-4 text-sm leading-relaxed">{body}</p>
      </SheetContent>
    </Sheet>
  );
}
