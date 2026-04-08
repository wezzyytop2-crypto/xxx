"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { LoadingSpinner } from "@/components/loading-spinner";

const StatsOverviewScreen = dynamic(
  () => import("@/features/shared/stats-overview-screen").then((mod) => ({ default: mod.StatsOverviewScreen })),
  { loading: () => <LoadingSpinner /> }
);

export default function StatsPage() {
  return (
    <div className="screen-pad flex flex-col gap-6 pb-8">
      <header className="top-safe flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Progress</p>
          <h1 className="mt-3 text-3xl font-semibold text-text">Статистика</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            Темп, точность и состояние наборов в одном месте. Всё считается локально и обновляется после каждой сессии.
          </p>
        </div>

        <Link
          href="/"
          className="secondary-action inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-text"
        >
          <ArrowLeftIcon className="h-4 w-4 text-accent" />
          Назад
        </Link>
      </header>

      <StatsOverviewScreen />
    </div>
  );
}
