"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Download04Icon, PrinterIcon } from "@hugeicons/core-free-icons";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { downloadFile, toCsv } from "@/lib/download";
import { toastService } from "@/services/toast.service";

type ButtonProps = Omit<ComponentProps<typeof Button>, "onClick">;

/** Downloads generated content (CSV, bank files, declarations). */
export function DownloadButton({
  filename,
  content,
  rows,
  label = "Descarregar",
  icon = Download04Icon,
  iconOnly = false,
  mime,
  ...props
}: {
  filename: string;
  content?: string;
  rows?: Record<string, string | number | boolean | null | undefined>[];
  label?: string;
  icon?: IconSvgElement;
  iconOnly?: boolean;
  mime?: string;
} & ButtonProps) {
  const download = () => {
    const data = rows ? toCsv(rows) : (content ?? "");
    downloadFile(filename, data, mime ?? (rows ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8"));
    toastService.success("Ficheiro descarregado", filename);
  };

  return (
    <Button variant="outline" size={iconOnly ? "icon-sm" : "sm"} onClick={download} aria-label={iconOnly ? label : undefined} {...props}>
      <HugeiconsIcon icon={icon} aria-hidden />
      {!iconOnly && label}
    </Button>
  );
}

/** Opens the browser print dialog; "Guardar como PDF" produces the document. */
export function PrintButton({ label = "Descarregar PDF", ...props }: { label?: string } & ButtonProps) {
  return (
    <Button onClick={() => window.print()} {...props}>
      <HugeiconsIcon icon={PrinterIcon} aria-hidden />
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </Button>
  );
}
