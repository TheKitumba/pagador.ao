"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useId, useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toastService } from "@/services/toast.service";

interface ConfirmDialogProps {
  trigger?: ReactNode;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  /** "danger" for irreversible or destructive operations. */
  tone?: "danger" | "default";
  /** Ask for a justification (e.g. rejecting a request). */
  reason?: { label: string; required?: boolean; placeholder?: string };
  successTitle?: string;
  successDescription?: string;
  /** Navigate after confirming (serializable alternative to onConfirm). */
  redirectTo?: string;
  onConfirm?: (reason: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  tone = "default",
  reason,
  successTitle,
  successDescription,
  redirectTo,
  onConfirm,
  open: controlledOpen,
  onOpenChange,
}: ConfirmDialogProps) {
  const router = useRouter();
  const reasonId = useId();
  const [localOpen, setLocalOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const open = controlledOpen ?? localOpen;

  const setOpen = (next: boolean) => {
    setLocalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setText("");
      setError(false);
    }
  };

  const confirm = () => {
    if (reason?.required && !text.trim()) {
      setError(true);
      return;
    }
    onConfirm?.(text.trim());
    if (successTitle) toastService.success(successTitle, successDescription);
    setOpen(false);
    if (redirectTo) router.push(redirectTo);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm text-muted-foreground">{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {reason && (
          <div className="space-y-1.5">
            <Label htmlFor={reasonId}>
              {reason.label}
              {reason.required && <span aria-hidden className="text-destructive"> *</span>}
            </Label>
            <Textarea
              id={reasonId}
              rows={3}
              value={text}
              placeholder={reason.placeholder}
              onChange={(event) => {
                setText(event.target.value);
                setError(false);
              }}
              aria-invalid={error}
              aria-describedby={error ? `${reasonId}-error` : undefined}
            />
            {error && (
              <p id={`${reasonId}-error`} role="alert" className="text-sm text-destructive">
                Indique o motivo.
              </p>
            )}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button variant={tone === "danger" ? "destructive" : "default"} onClick={confirm}>
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
