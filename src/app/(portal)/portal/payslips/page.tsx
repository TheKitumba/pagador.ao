import type { Metadata } from "next";

import { DownloadButton } from "@/components/common/action-buttons";
import { formatKz, formatMonth } from "@/lib/format";

export const metadata: Metadata = { title: "Os meus recibos" };

const myPayslips = [
  { period: "2026-09-01", net: 302_115.4, gross: 360_000 },
  { period: "2026-08-01", net: 302_115.4, gross: 360_000 },
  { period: "2026-07-01", net: 452_983.1, gross: 540_000, note: "Inclui subsídio de férias" },
  { period: "2026-06-01", net: 302_115.4, gross: 360_000 },
  { period: "2026-05-01", net: 296_480.0, gross: 352_000 },
];

export default function PortalPayslipsPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Recibos</h1>
      <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-card">
        {myPayslips.map((payslip) => (
          <li key={payslip.period} className="flex items-center gap-4 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="font-medium first-letter:uppercase">{formatMonth(payslip.period)}</p>
              <p className="text-xs text-muted-foreground">
                Ilíquido {formatKz(payslip.gross)}
                {payslip.note ? ` · ${payslip.note}` : ""}
              </p>
            </div>
            <p className="text-right font-semibold tabular">{formatKz(payslip.net)}</p>
            <DownloadButton
              iconOnly
              label={`Descarregar recibo de ${formatMonth(payslip.period)}`}
              filename={`recibo-${payslip.period.slice(0, 7)}.txt`}
              content={[
                "Kianda Logística, Lda. — NIF 5417089621",
                `Recibo de vencimento — ${formatMonth(payslip.period)}`,
                "Trabalhador: Ana Mateus (n.º 0001)",
                `Total ilíquido: ${formatKz(payslip.gross)}`,
                `Líquido a receber: ${formatKz(payslip.net)}`,
              ].join("\n")}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
