'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useThemeToggle } from '@/hooks/use-theme-toggle';
import { HugeiconsIcon } from '@hugeicons/react';
import { Download04Icon, Moon02Icon, PencilEdit02Icon, Search01Icon, SidebarLeftIcon, Sun03Icon } from '@hugeicons/core-free-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showExport?: boolean;
  showEdit?: boolean;
}

export function Header({ title, subtitle, showSearch = true, showExport = true, showEdit = false }: HeaderProps) {
  const { theme, toggleTheme } = useThemeToggle();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex h-10 w-10"
          title="Toggle sidebar">
          <HugeiconsIcon icon={SidebarLeftIcon} className="h-4 w-4" />
        </Button>
        <SidebarTrigger className="md:hidden h-10 w-10" />
        <div>
          <h1 className="text-base font-semibold">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative hidden md:block">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Pesquisar..." className="w-64 pl-9 bg-muted/50" />
          </div>
        )}

        <Button variant="outline" size="icon" onClick={toggleTheme} className="h-10 w-10">
          {theme === 'light' ? <HugeiconsIcon icon={Moon02Icon} className="h-4 w-4" /> : <HugeiconsIcon icon={Sun03Icon} className="h-4 w-4" />}
        </Button>

        {showExport && (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <HugeiconsIcon icon={Download04Icon} className="h-4 w-4" />
            Exportar
          </Button>
        )}

        {showEdit && (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <HugeiconsIcon icon={PencilEdit02Icon} className="h-4 w-4" />
            Editar
          </Button>
        )}

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage />
              <AvatarFallback className="text-xs">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
