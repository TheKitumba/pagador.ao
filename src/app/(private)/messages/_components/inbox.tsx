"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Attachment01Icon, Megaphone01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { type FormEvent, useRef, useState } from "react";

import { FormDialog } from "@/components/common/form-dialog";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forms } from "@/config/forms";
import { cn } from "@/lib/utils";
import { conversations, messages as initialMessages } from "@/mocks/inbox";
import { currentUser } from "@/mocks/people";

export function Inbox() {
  const [activeId, setActiveId] = useState<string | null>(conversations[0].id);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const active = conversations.find((conversation) => conversation.id === activeId);

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setMessages((current) => [...current, { author: currentUser.name, time: "Agora", text: draft.trim() }]);
    setDraft("");
  };

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden" style={{ height: "calc(100dvh - 3.5rem)" }}>
      <nav
        aria-label="Conversas"
        className={cn("w-full shrink-0 border-r bg-card md:w-80", activeId && "hidden md:block")}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Conversas</h2>
          <FormDialog
            {...forms.announcement}
            trigger={
              <Button variant="outline" size="sm">
                <HugeiconsIcon icon={Megaphone01Icon} aria-hidden />
                Comunicado
              </Button>
            }
          />
        </div>
        <ul className="overflow-y-auto p-2">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => setActiveId(conversation.id)}
                aria-current={conversation.id === activeId ? "true" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-accent",
                  conversation.id === activeId && "bg-accent",
                )}
              >
                <PersonAvatar name={conversation.name} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{conversation.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{conversation.time}</span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-[13px] text-muted-foreground">{conversation.preview}</span>
                    {conversation.unread > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                        {conversation.unread}
                        <span className="sr-only"> mensagens por ler</span>
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-label={active ? `Conversa com ${active.name}` : "Conversa"} className={cn("flex min-w-0 flex-1 flex-col", !activeId && "hidden md:flex")}>
        {active && (
          <>
            <div className="flex items-center gap-3 border-b bg-card px-4 py-3">
              <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setActiveId(null)} aria-label="Voltar às conversas">
                <HugeiconsIcon icon={ArrowLeft01Icon} />
              </Button>
              <PersonAvatar name={active.name} status="online" />
              <div>
                <h2 className="text-sm font-semibold">{active.name}</h2>
                <p className="text-xs text-muted-foreground">{active.group ? "5 participantes" : "Online"}</p>
              </div>
            </div>
            <ol className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6" aria-live="polite">
              {messages.map((message, index) => {
                const mine = message.author === currentUser.name;
                return (
                  <li key={`${message.time}-${index}`} className={cn("flex gap-3", mine && "flex-row-reverse")}>
                    <PersonAvatar name={message.author} />
                    <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm", mine ? "bg-primary text-primary-foreground" : "border bg-card shadow-xs")}>
                      {!mine && <p className="mb-0.5 text-xs font-medium">{message.author}</p>}
                      <p>{message.text}</p>
                      <p className={cn("mt-1 text-[11px]", mine ? "text-primary-foreground" : "text-muted-foreground")}>{message.time}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <form onSubmit={send} className="flex items-center gap-2 border-t bg-card p-3">
              <Button type="button" variant="ghost" size="icon" aria-label="Anexar ficheiro" onClick={() => fileRef.current?.click()}>
                <HugeiconsIcon icon={Attachment01Icon} />
              </Button>
              <input
                ref={fileRef}
                type="file"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setMessages((current) => [...current, { author: currentUser.name, time: "Agora", text: `Anexo: ${file.name}` }]);
                  event.target.value = "";
                }}
              />
              <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escreva uma mensagem…" aria-label="Mensagem" />
              <Button type="submit" disabled={!draft.trim()}>
                <HugeiconsIcon icon={SentIcon} aria-hidden />
                <span className="hidden sm:inline">Enviar</span>
              </Button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
