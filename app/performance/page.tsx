"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Target, Award } from "lucide-react"

const performanceData = [
  {
    employee: "João Silva",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JS",
    score: 92,
    goals: 8,
    completed: 7,
    department: "Tecnologia",
  },
  {
    employee: "Maria Santos",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "MS",
    score: 88,
    goals: 6,
    completed: 5,
    department: "Produto",
  },
  {
    employee: "Alex Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "AJ",
    score: 85,
    goals: 5,
    completed: 4,
    department: "Design",
  },
]

export default function PerformancePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Performance" subtitle="Avaliações e métricas de desempenho" />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Score Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88.5</div>
              <p className="text-xs text-muted-foreground">+5.2% desde o último trimestre</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Metas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-muted-foreground">234 de 308 metas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Score acima de 90</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avaliações Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Vencem esta semana</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((employee, index) => (
                  <div key={employee.employee} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{employee.initials}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-medium">{employee.employee}</p>
                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{employee.score}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Progresso das Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((employee) => (
                  <div key={employee.employee} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{employee.employee}</span>
                      <span className="text-sm text-muted-foreground">
                        {employee.completed}/{employee.goals} metas
                      </span>
                    </div>
                    <Progress value={(employee.completed / employee.goals) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
