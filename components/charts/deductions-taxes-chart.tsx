"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", taxes: 180000, deductions: 120000 },
  { month: "Fev", taxes: 190000, deductions: 130000 },
  { month: "Mar", taxes: 200000, deductions: 140000 },
  { month: "Abr", taxes: 210000, deductions: 150000 },
]

export function DeductionsTaxesChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barCategoryGap="20%">
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis hide />
        <Bar dataKey="taxes" fill="#3b82f6" radius={[2, 2, 0, 0]} />
        <Bar dataKey="deductions" fill="#ef4444" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
