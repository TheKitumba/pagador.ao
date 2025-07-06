"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { FolderOpen } from "lucide-react"

export default function ReimbursementsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Reembolsos" subtitle="Gestão de solicitações de reembolso" />
      <main className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sistema de Reembolsos</h3>
            <p className="text-muted-foreground text-center">
              Módulo de reembolsos em desenvolvimento. Gerencie solicitações e aprovações de despesas.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
