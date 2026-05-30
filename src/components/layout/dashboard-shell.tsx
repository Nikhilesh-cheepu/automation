"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[100dvh] bg-background">
      <Sidebar />
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full shadow-2xl">
            <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={title}
          description={description}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main
          className={cn(
            "flex-1 overflow-x-hidden overflow-y-auto",
            "px-3 py-4 pb-[calc(5rem+env(safe-area-inset-bottom))]",
            "sm:px-4 md:px-6 md:py-6 md:pb-6"
          )}
        >
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}

export function PageSection({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={cn("space-y-4", className)}>{children}</section>;
}
