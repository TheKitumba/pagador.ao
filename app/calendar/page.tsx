"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Calendário" subtitle="Agenda e cronograma de eventos" />
      <main className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Calendário Integrado</h3>
            <p className="text-muted-foreground text-center">
              Visualização de calendário em desenvolvimento. Gerencie eventos, reuniões e prazos importantes.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
