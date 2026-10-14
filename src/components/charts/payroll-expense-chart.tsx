"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", value: 220000 },
  { month: "Fev", value: 240000 },
  { month: "Mar", value: 260000 },
  { month: "Abr", value: 250000 },
  { month: "Mai", value: 280000 },
]

export function PayrollExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#0ea5e9", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
