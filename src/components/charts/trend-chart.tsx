"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Series {
  key: string;
  label: string;
  color: string;
}

interface TrendChartProps<T extends Record<string, string | number>> {
  data: T[];
  xKey: keyof T & string;
  series: Series[];
  /** Short description for screen readers, e.g. "Custo da folha subiu de 110 para 118 milhões de Kz". */
  summary: string;
  unit?: string;
  height?: number;
}

export function TrendChart<T extends Record<string, string | number>>({
  data,
  xKey,
  series,
  summary,
  unit = "",
  height = 240,
}: TrendChartProps<T>) {
  return (
    <figure className="w-full">
      <figcaption className="sr-only">{summary}</figcaption>
      <div aria-hidden style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart accessibilityLayer={false} data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              {series.map((item) => (
                <linearGradient key={item.key} id={`fill-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={item.color} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={item.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={60}
              domain={["auto", "auto"]}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value: number) => `${value}${unit}`}
            />
            <Tooltip
              cursor={{ stroke: "hsl(var(--border))" }}
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 10,
                fontSize: 12,
                color: "hsl(var(--popover-foreground))",
              }}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString("pt-AO")}${unit}`,
                series.find((item) => item.key === name)?.label ?? name,
              ]}
            />
            {series.map((item) => (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={item.color}
                strokeWidth={2}
                fill={`url(#fill-${item.key})`}
                dot={false}
                isAnimationActive={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground" aria-hidden>
        {series.map((item) => (
          <li key={item.key} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: item.color }} />
            {item.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}
