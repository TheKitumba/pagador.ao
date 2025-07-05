"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Clock, AlertCircle, Info, CheckCircle } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "payroll",
    title: "Folha de pagamento processada",
    message: "A folha de pagamento de Janeiro foi processada com sucesso para 45 funcionários.",
    time: "há 2 horas",
    read: false,
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "alert",
    title: "Ação necessária: Documentos pendentes",
    message: "3 funcionários têm documentos pendentes que precisam ser revisados.",
    time: "há 4 horas",
    read: false,
    icon: AlertCircle,
    color: "text-yellow-600",
  },
  {
    id: 3,
    type: "info",
    title: "Novo funcionário adicionado",
    message: "Maria Silva foi adicionada ao sistema e precisa de configuração inicial.",
    time: "há 1 dia",
    read: true,
    icon: Info,
    color: "text-blue-600",
  },
  {
    id: 4,
    type: "reminder",
    title: "Lembrete: Revisão de performance",
    message: "As avaliações de performance do Q1 vencem em 3 dias.",
    time: "há 2 dias",
    read: true,
    icon: Clock,
    color: "text-purple-600",
  },
]

export default function NotificationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Notificações" subtitle="Central de notificações e alertas" />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Todas as Notificações</h2>
            <Badge variant="secondary">{notifications.filter((n) => !n.read).length} não lidas</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
            <Button variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Limpar todas
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`transition-colors ${!notification.read ? "bg-muted/30" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full bg-muted ${notification.color}`}>
                    <notification.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                        <span className="text-sm text-muted-foreground">{notification.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
