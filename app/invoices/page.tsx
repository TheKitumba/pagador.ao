"use client";

import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, FileText, Plus } from "lucide-react";

const invoices = [
  {
    id: "INV-2024-001",
    client: "Empresa ABC Ltda",
    amount: 15000,
    status: "paid",
    dueDate: "2024-01-15",
    issueDate: "2024-01-01",
  },
  {
    id: "INV-2024-002",
    client: "Tech Solutions Inc",
    amount: 22500,
    status: "pending",
    dueDate: "2024-02-15",
    issueDate: "2024-02-01",
  },
  {
    id: "INV-2024-003",
    client: "Marketing Pro",
    amount: 8750,
    status: "overdue",
    dueDate: "2024-01-30",
    issueDate: "2024-01-15",
  },
];

export default function InvoicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Faturas" subtitle="Gerencie suas faturas e cobranças" />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Faturado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Kz 156.750</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pagas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Kz 89.250</div>
              <p className="text-xs text-muted-foreground">57% do total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Kz 45.000</div>
              <p className="text-xs text-muted-foreground">29% do total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Atraso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Kz 22.500</div>
              <p className="text-xs text-muted-foreground">14% do total</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Faturas Recentes</h2>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Fatura
          </Button>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{invoice.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {invoice.client}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        Kz {invoice.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vence em {invoice.dueDate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "default"
                          : invoice.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {invoice.status === "paid"
                        ? "Paga"
                        : invoice.status === "pending"
                        ? "Pendente"
                        : "Em Atraso"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
