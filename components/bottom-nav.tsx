"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAlternativeUserId } from "@/lib/auth";
import { BookIcon, BrainIcon, HomeIcon, LogOutIcon, PlusIcon, SparklesIcon } from "@/components/icons";
import { useApp } from "@/components/providers/app-provider";
import { useAuthStore } from "@/lib/stores/authStore";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { sets, getSetStatsById } = useApp();
  const { user, logout } = useAuthStore();
  const reviewTarget = sets
    .map((set) => ({
      set,
      stats: getSetStatsById(set.id)
    }))
    .sort((left, right) => (right.stats?.due ?? 0) - (left.stats?.due ?? 0))[0];
  const reviewCount = reviewTarget?.stats?.due ?? 0;

  const items = [
    {
      key: "home",
      href: "/",
      label: "Главная",
      icon: HomeIcon,
      active: pathname === "/"
    },
    {
      key: "dictionary",
      href: "/translate",
      label: "Словарь",
      icon: BookIcon,
      active: pathname === "/translate"
    },
    {
      key: "grammar",
      href: "/grammar",
      label: "Грамматика",
      icon: SparklesIcon,
      active: pathname === "/grammar"
    },
    {
      key: "review",
      href: reviewTarget ? `/sets/${reviewTarget.set.id}/study?mode=focus` : "/",
      label: "Повтор",
      icon: BrainIcon,
      active: pathname.includes("/study")
    },
    {
      key: "new",
      href: "/sets/new",
      label: "Новый",
      icon: PlusIcon,
      active: pathname === "/sets/new"
    }
  ];

  return (
    <nav className="bottom-safe fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-4">
      <div className="glass-panel grid grid-cols-6 gap-1 rounded-[30px] p-2 shadow-shell">
        {items.map((item) => {
          const Icon = item.icon;
          const isReview = item.key === "review";

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-[24px] px-2 py-3 text-[11px] font-semibold transition duration-200",
                isReview
                  ? "primary-action text-slate-950"
                  : item.active
                    ? "secondary-action text-text"
                    : "text-muted hover:bg-white/5 hover:text-text"
              )}
            >
              {isReview && reviewCount > 0 ? (
                <span className="absolute right-2 top-2 rounded-full bg-slate-950/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-950">
                  {reviewCount}
                </span>
              ) : null}
              <Icon className={cn("h-5 w-5", item.active && !isReview && "text-accent")} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => {
            const nextUser = user ? getAlternativeUserId(user.id) : "user1";
            logout();
            router.replace(`/login?user=${nextUser}`);
          }}
          className="relative flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-[24px] px-2 py-3 text-[11px] font-semibold text-muted transition duration-200 hover:bg-white/5 hover:text-text"
          aria-label={user ? `Выйти (${user.username})` : "Выйти"}
        >
          {user ? (
            <span className="absolute right-1.5 top-1.5 rounded-full border border-line/80 bg-white/8 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-text">
              {user.username}
            </span>
          ) : null}
          <LogOutIcon className="h-5 w-5" />
          <span>Выйти</span>
        </button>
      </div>
    </nav>
  );
}
