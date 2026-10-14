"use client";
import {
  Bell,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Update navigation with proper Portuguese labels
const navigation = [
  {
    title: "Principal",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
      {
        title: "Notificações",
        href: "/notifications",
        icon: Bell,
        badge: "12",
      },
      { title: "Funcionários", href: "/employees", icon: Users },
      { title: "Presença", href: "/attendance", icon: Clock },
      { title: "Folha de Pagamento", href: "/payroll", icon: CreditCard },
      { title: "Faturas", href: "/invoices", icon: FileText },
      { title: "Performance", href: "/performance", icon: TrendingUp },
    ],
  },
  {
    title: "Favoritos",
    items: [
      { title: "Reembolsos", href: "/reimbursements", icon: FolderOpen },
      { title: "Planilhas de Horas", href: "/timesheets", icon: Clock },
      { title: "Logs de Horas Extras", href: "/overtime", icon: Star },
    ],
  },
];

const bottomNavigation = [
  { title: "Mensagens", href: "/messages", icon: MessageSquare },
  { title: "Calendário", href: "/calendar", icon: Calendar },
  { title: "Feedback", href: "/feedback", icon: HelpCircle },
  { title: "Configurações", href: "/settings", icon: Settings },
  { title: "Central de Ajuda", href: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 rounded-full bg-slate-700">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback className="rounded-full dark:bg-slate-500">
                ZI
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Pagador.ao</span>
              <span className="truncate text-xs text-muted-foreground">
                Enterprise
              </span>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mt-4">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <SidebarInput placeholder="Pesquisar..." className="pl-8" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                      className="w-full justify-start gap-3 px-2 py-2"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="destructive"
                            className="ml-auto h-5 px-1.5 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        {/* Trial Banner */}
        <div className="mb-4 rounded-lg bg-muted/50 p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">5 Dias restantes!</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              ×
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Selecione o melhor plano agora e desbloqueie todos os recursos
            especiais
          </p>
          <Button size="sm" className="w-full text-xs">
            Selecionar plano →
          </Button>
        </div>

        <SidebarMenu>
          {bottomNavigation.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                className="w-full justify-start gap-3 px-2 py-2"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
