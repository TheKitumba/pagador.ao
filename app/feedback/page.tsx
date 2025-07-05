"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export default function FeedbackPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Feedback" subtitle="Envie sugestões e comentários" />
      <main className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Centro de Feedback</h3>
            <p className="text-muted-foreground text-center">
              Sistema de feedback em desenvolvimento. Compartilhe suas ideias para melhorar o sistema.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
