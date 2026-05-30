"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ClientSwitcher() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("all");
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients)
      .catch(() => setClients([]));
  }, []);

  const label =
    selected === "all"
      ? "All clients"
      : clients.find((c) => c.id === selected)?.name ?? "All clients";

  return (
    <div className="relative min-w-0 flex-1 sm:flex-none sm:max-w-[180px]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium active:bg-muted sm:w-auto"
      >
        {selected !== "all" && (
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{
              backgroundColor:
                clients.find((c) => c.id === selected)?.color ?? "#6366f1",
            }}
          />
        )}
        <span className="min-w-0 flex-1 truncate text-left sm:max-w-[120px]">
          {label}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full z-50 mt-1 max-h-[70vh] w-[min(100vw-1.5rem,16rem)] overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-lg sm:w-56">
            <button
              type="button"
              className={cn(
                "flex min-h-[44px] w-full items-center px-4 py-3 text-left text-sm active:bg-muted sm:py-2",
                selected === "all" && "bg-muted font-medium"
              )}
              onClick={() => {
                setSelected("all");
                setOpen(false);
              }}
            >
              All clients
            </button>
            {clients.map((client) => (
              <button
                key={client.id}
                type="button"
                className={cn(
                  "flex min-h-[44px] w-full items-center gap-2 px-4 py-3 text-left text-sm active:bg-muted sm:py-2",
                  selected === client.id && "bg-muted font-medium"
                )}
                onClick={() => {
                  setSelected(client.id);
                  setOpen(false);
                }}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: client.color }}
                />
                <span className="truncate">{client.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
