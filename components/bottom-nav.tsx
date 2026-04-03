"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainIcon, HomeIcon, PlusIcon } from "@/components/icons";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { sets, getSetStatsById } = useApp();
  const reviewTarget = sets
    .map((set) => ({
      set,
      stats: getSetStatsById(set.id)
    }))
    .sort((left, right) => (right.stats?.due ?? 0) - (left.stats?.due ?? 0))[0];

  const items = [
    {
      href: "/",
      label: "Главная",
      icon: HomeIcon,
      active: pathname === "/"
    },
    {
      href: reviewTarget ? `/sets/${reviewTarget.set.id}/study?mode=learn` : "/",
      label: "Повтор",
      icon: BrainIcon,
      active: pathname.includes("/study")
    },
    {
      href: "/sets/new",
      label: "Новый",
      icon: PlusIcon,
      active: pathname === "/sets/new"
    }
  ];

  return (
    <nav className="bottom-safe fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-4">
      <div className="glass-panel grid grid-cols-3 rounded-[28px] p-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-3xl px-3 py-3 text-[11px] font-medium transition",
                item.active ? "bg-accent text-slate-950" : "text-muted hover:bg-white/5 hover:text-text"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
