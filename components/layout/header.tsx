"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/use-theme";
import { Download, Edit, Moon, PanelLeft, Search, Sun } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showExport?: boolean;
  showEdit?: boolean;
}

export function Header({
  title,
  subtitle,
  showSearch = true,
  showExport = true,
  showEdit = false,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex h-10 w-10"
          title="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <SidebarTrigger className="md:hidden h-10 w-10" />
        <div>
          <h1 className="text-base font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              className="w-64 pl-9 bg-muted/50"
            />
          </div>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        {showExport && (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        )}

        {showEdit && (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        )}

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage />
              <AvatarFallback className="text-xs">JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage />
              <AvatarFallback className="text-xs">JS</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage />
              <AvatarFallback className="text-xs">AJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
