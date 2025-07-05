"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function TimesheetsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Planilhas de Horas" subtitle="Controle de horas trabalhadas" />
      <main className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Planilhas de Horas</h3>
            <p className="text-muted-foreground text-center">
              Sistema de controle de horas em desenvolvimento. Registre e gerencie o tempo trabalhado.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
