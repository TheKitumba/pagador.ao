"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Mensagens" subtitle="Central de mensagens e comunicação interna" />
      <main className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sistema de Mensagens</h3>
            <p className="text-muted-foreground text-center">
              Interface de mensagens em desenvolvimento. Em breve você poderá se comunicar com sua equipe diretamente
              aqui.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
