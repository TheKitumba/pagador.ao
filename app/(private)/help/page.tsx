"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Central de Ajuda" subtitle="Documentação e suporte técnico" />
      <main className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Central de Ajuda</h3>
            <p className="text-muted-foreground text-center">
              Documentação e tutoriais em desenvolvimento. Encontre respostas para suas dúvidas.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
