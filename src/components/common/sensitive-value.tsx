"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";

/**
 * Sensitive fields (salary, bank data) stay hidden until the user asks to see them.
 * The API still decides whether the user may read them at all; this only avoids shoulder-surfing.
 */
export function SensitiveValue({ value, label }: { value: string; label: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="inline-flex items-center gap-2">
      <span className="tabular">{visible ? value : "••••••••"}</span>
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
        aria-pressed={visible}
      >
        <HugeiconsIcon icon={visible ? ViewOffSlashIcon : ViewIcon} className="size-4" />
      </button>
    </span>
  );
}
