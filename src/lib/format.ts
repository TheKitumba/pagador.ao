import { LOCALE, TIMEZONE } from "@/config/app";

const kzFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat(LOCALE, {
  notation: "compact",
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat(LOCALE);

/** `1 250 000,00 Kz` — the documented display format for Kwanza. */
export function formatKz(amount: number) {
  // Non-breaking space: the currency never wraps away from the amount.
  return `${kzFormatter.format(amount)} Kz`;
}

/** `1,3 M Kz` — for charts and tight spaces only. */
export function formatKzCompact(amount: number) {
  return `${compactFormatter.format(amount)} Kz`;
}

export function formatNumber(value: number) {
  return integerFormatter.format(value);
}

export function formatPercent(value: number, fractionDigits = 1) {
  return `${value.toLocaleString(LOCALE, { maximumFractionDigits: fractionDigits })}%`;
}

function toDate(value: Date | string) {
  return typeof value === "string" ? new Date(value) : value;
}

/** `14/10/2026` */
export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TIMEZONE,
  }).format(toDate(value));
}

/** `14 out. 2026` */
export function formatDateShort(value: Date | string) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIMEZONE,
  }).format(toDate(value));
}

/** `14 de outubro de 2026` */
export function formatDateLong(value: Date | string) {
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "long", timeZone: TIMEZONE }).format(toDate(value));
}

/** `08:42` */
export function formatTime(value: Date | string) {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  }).format(toDate(value));
}

/** `outubro de 2026` */
export function formatMonth(value: Date | string) {
  return new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric", timeZone: TIMEZONE }).format(
    toDate(value),
  );
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
