"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Calendar,
  CheckSquare,
  Inbox,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/inbox", label: "Inbox", icon: Inbox, badge: "Soon" },
  { href: "/ai-studio", label: "AI Studio", icon: Sparkles },
  { href: "/google-seo", label: "Google SEO", icon: Building2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
  mobile?: boolean;
}

export function Sidebar({ onNavigate, mobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-[min(100vw,280px)] shrink-0 flex-col border-r border-border bg-sidebar",
        mobile ? "h-full" : "hidden md:flex md:w-60"
      )}
    >
      <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4 md:h-16 md:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Social Media OS</p>
            <p className="text-xs text-muted-foreground">Dev dashboard</p>
          </div>
        </div>
        {mobile && onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2 md:p-3">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors active:scale-[0.98]",
                active
                  ? "bg-sidebar-active text-accent-foreground"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
