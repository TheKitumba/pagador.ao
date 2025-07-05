"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"

const employees = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@zenus.com",
    phone: "+55 11 99999-9999",
    position: "Desenvolvedor Senior",
    department: "Tecnologia",
    salary: 12000,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JS",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@zenus.com",
    phone: "+55 11 88888-8888",
    position: "Gerente de Produto",
    department: "Produto",
    salary: 15000,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MS",
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex.johnson@zenus.com",
    phone: "+55 11 77777-7777",
    position: "Designer UX/UI",
    department: "Design",
    salary: 9000,
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@zenus.com",
    phone: "+55 11 66666-6666",
    position: "Analista de Marketing",
    department: "Marketing",
    salary: 7500,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ED",
  },
]

export default function EmployeesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Funcionários" subtitle="Gerencie sua equipe e informações dos funcionários" />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">91% da equipe</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Novos este mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+3 desde a semana passada</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Departamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Across all divisions</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Pesquisar funcionários..." className="w-64 pl-9" />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Funcionário
          </Button>
        </div>

        {/* Employee Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{employee.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{employee.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{employee.department}</Badge>
                  <StatusBadge status={employee.status === "active" ? "received" : "pending"}>
                    {employee.status === "active" ? "Ativo" : "Inativo"}
                  </StatusBadge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
