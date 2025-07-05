"use client"

import { useState } from "react"
import { MoreHorizontal, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatCurrency, formatDateRange } from "@/lib/utils"

const payrollData = [
  {
    id: "PR-202401",
    amount: 120000,
    employee: { name: "João Silva", avatar: "/placeholder.svg?height=32&width=32", initials: "JS" },
    period: { start: new Date(2024, 1, 1), end: new Date(2024, 1, 15) },
    method: "Transferência Bancária",
    processedDate: new Date(2024, 1, 15),
    status: "received" as const,
  },
  {
    id: "PR-202402",
    amount: 115000,
    employee: { name: "Maria Santos", avatar: "/placeholder.svg?height=32&width=32", initials: "MS" },
    period: { start: new Date(2024, 0, 16), end: new Date(2024, 0, 31) },
    method: "Transferência Bancária",
    processedDate: null,
    status: "pending" as const,
  },
  {
    id: "PR-202403",
    amount: 118500,
    employee: { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "AJ" },
    period: { start: new Date(2024, 0, 1), end: new Date(2024, 0, 15) },
    method: "Depósito Direto",
    processedDate: new Date(2024, 0, 15),
    status: "processed" as const,
  },
  {
    id: "PR-202404",
    amount: 110500,
    employee: { name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32", initials: "ED" },
    period: { start: new Date(2023, 11, 16), end: new Date(2023, 11, 31) },
    method: "Depósito Direto",
    processedDate: new Date(2023, 11, 31),
    status: "processed" as const,
  },
  {
    id: "PR-202405",
    amount: 120000,
    employee: { name: "Michael Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "MB" },
    period: { start: new Date(2024, 1, 1), end: new Date(2024, 1, 15) },
    method: "Transferência Bancária",
    processedDate: new Date(2024, 1, 15),
    status: "received" as const,
  },
  {
    id: "PR-202406",
    amount: 115000,
    employee: { name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "SW" },
    period: { start: new Date(2024, 0, 16), end: new Date(2024, 0, 31) },
    method: "Transferência por Fio",
    processedDate: new Date(2024, 0, 31),
    status: "failed" as const,
  },
  {
    id: "PR-202407",
    amount: 118500,
    employee: { name: "Daniel Lee", avatar: "/placeholder.svg?height=32&width=32", initials: "DL" },
    period: { start: new Date(2024, 0, 1), end: new Date(2024, 0, 15) },
    method: "Transferência por Fio",
    processedDate: null,
    status: "pending" as const,
  },
  {
    id: "PR-202408",
    amount: 110500,
    employee: { name: "Olivia Clark", avatar: "/placeholder.svg?height=32&width=32", initials: "OC" },
    period: { start: new Date(2023, 11, 16), end: new Date(2023, 11, 31) },
    method: "Transferência Bancária",
    processedDate: new Date(2023, 11, 31),
    status: "received" as const,
  },
]

const statusLabels = {
  received: "Recebido",
  pending: "Pendente",
  processed: "Processado",
  failed: "Falhou",
}

export function PayrollTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredData = payrollData.filter((item) => {
    const matchesSearch =
      item.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const toggleAllRows = () => {
    setSelectedRows(selectedRows.length === paginatedData.length ? [] : paginatedData.map((item) => item.id))
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar folha de pagamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Todos os Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="received">Recebido</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="processed">Processado</SelectItem>
            <SelectItem value="failed">Falhou</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2 bg-transparent">
          Mais
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead>ID da Folha</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Funcionários</TableHead>
              <TableHead>Período de Pagamento</TableHead>
              <TableHead>Método de Pagamento</TableHead>
              <TableHead>Data Processada</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(item.id)}
                    onCheckedChange={() => toggleRowSelection(item.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{formatCurrency(item.amount)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.employee.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{item.employee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{item.employee.name}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDateRange(item.period.start, item.period.end)}</TableCell>
                <TableCell className="text-muted-foreground">{item.method}</TableCell>
                <TableCell>
                  {item.processedDate ? formatDateRange(item.processedDate, item.processedDate) : "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status}>{statusLabels[item.status]}</StatusBadge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Reprocessar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de{" "}
          {filteredData.length} entradas
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )
            })}
            {totalPages > 5 && (
              <>
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} className="w-8 h-8 p-0">
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
