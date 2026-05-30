"use client";

import { Moon, Sun, Menu, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ClientSwitcher } from "@/components/layout/client-switcher";

interface HeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="flex min-h-14 flex-col gap-2 px-3 py-2 safe-top sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 md:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              {title}
            </h1>
            {description && (
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <ClientSwitcher />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              N
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
