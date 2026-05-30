"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Calendar,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/google-seo", icon: Building2, label: "SEO" },
  { href: "/ai-studio", icon: Sparkles, label: "AI" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-card/95 backdrop-blur-md md:hidden",
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium active:bg-muted/50",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
