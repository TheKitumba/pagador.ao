"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { formatKz, formatPercent } from "@/lib/format";

interface BreakdownChartProps {
  data: { name: string; value: number; color: string }[];
  totalLabel: string;
  totalValue: string;
}

/** Donut with an always-visible legend table, so the numbers do not depend on colour or hover. */
export function BreakdownChart({ data, totalLabel, totalValue }: BreakdownChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative size-40 shrink-0" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart accessibilityLayer={false}>
            <Pie rootTabIndex={-1} isAnimationActive={false} data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={2} strokeWidth={0}>
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] text-muted-foreground">{totalLabel}</span>
          <span className="text-sm font-semibold tabular">{totalValue}</span>
        </div>
      </div>
      <table className="w-full text-sm">
        <caption className="sr-only">{totalLabel}: repartição</caption>
        <tbody>
          {data.map((item) => (
            <tr key={item.name} className="border-b last:border-0">
              <th scope="row" className="py-2 pr-2 text-left text-[13px] font-normal">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-sm" style={{ background: item.color }} />
                  {item.name}
                </span>
              </th>
              <td className="py-2 text-right tabular text-muted-foreground">{formatPercent((item.value / total) * 100)}</td>
              <td className="whitespace-nowrap py-2 pl-3 text-right font-medium tabular">{formatKz(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
