"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { AppShell } from "@/components/app-shell";
import { StatsOverviewScreen } from "@/features/shared/stats-overview-screen";

export default function StatsPage() {
  return (
    <AppShell>
      <div className="space-y-4 px-4 pt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition">
          <ArrowLeftIcon className="h-4 w-4" />
          Вернуться на главную
        </Link>
        <h1 className="text-3xl font-bold text-text">📊 Статистика</h1>
      </div>
      <div className="px-4">
        <StatsOverviewScreen />
      </div>
    </AppShell>
  );
}