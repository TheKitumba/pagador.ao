"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function OvertimePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Logs de Horas Extras" subtitle="Registro e controle de horas extras" />
      <main className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Controle de Horas Extras</h3>
            <p className="text-muted-foreground text-center">
              Sistema de horas extras em desenvolvimento. Monitore e aprove solicitações de horas extras.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
