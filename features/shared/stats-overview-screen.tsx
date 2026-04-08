"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { useApp } from "@/components/providers/app-provider";
import { ExportImport } from "@/features/shared/export-import";
import { ProgressBar, StatCard } from "@/features/shared/progress-components";
import { formatPercent } from "@/lib/utils";

export function StatsOverviewScreen() {
  const { sets, reviews, appStats, getSetStatsById } = useApp();

  const totalCards = sets.reduce((sum, set) => sum + set.cards.length, 0);
  const masteredCards = appStats.masteredCards;
  const dueCards = appStats.dueCards;
  const masteryRate = totalCards === 0 ? 0 : (masteredCards / totalCards) * 100;
  const correctReviews = reviews.filter((item) => item.result === "known" || item.result === "write-correct").length;
  const accuracyValue = reviews.length === 0 ? 0 : Math.round((correctReviews / reviews.length) * 100);
  const focusSet = sets
    .map((set) => ({
      set,
      stats: getSetStatsById(set.id)
    }))
    .sort((left, right) => (right.stats?.due ?? 0) - (left.stats?.due ?? 0))[0];
  const activeSets = sets.filter((set) => (getSetStatsById(set.id)?.due ?? 0) > 0).length;

  return (
    <div className="space-y-6 pb-20">
      <section className="glass-panel rounded-[36px] p-6">
        <p className="section-kicker">Overview</p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="max-w-[15rem]">
            <h2 className="text-[2rem] font-semibold leading-tight text-text">{formatPercent(masteryRate)} освоения базы</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {masteredCards} из {totalCards} карточек уже закреплены. Очередь на повтор сейчас составляет {dueCards}.
            </p>
          </div>

          <div className="accent-ring flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-[28px] border border-accent/25 bg-accentSoft text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-950/70">Точность</span>
            <span className="mt-2 text-3xl font-semibold leading-none text-slate-950">{accuracyValue}%</span>
          </div>
        </div>

        <div className="mt-5">
          <ProgressBar value={masteredCards} max={Math.max(totalCards, 1)} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Всего</p>
            <p className="mt-2 text-2xl font-semibold text-text">{totalCards}</p>
          </div>
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Выучено</p>
            <p className="mt-2 text-2xl font-semibold text-success">{masteredCards}</p>
          </div>
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">На повтор</p>
            <p className="mt-2 text-2xl font-semibold text-warning">{dueCards}</p>
          </div>
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">XP</p>
            <p className="mt-2 text-2xl font-semibold text-text">{appStats.xp}</p>
          </div>
        </div>

        {focusSet?.stats ? (
          <Link
            href={`/sets/${focusSet.set.id}`}
            className="surface-card mt-5 flex items-center justify-between gap-4 rounded-[28px] p-4 transition hover:bg-white/5"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Сейчас требует внимания</p>
              <p className="mt-2 text-lg font-semibold text-text">{focusSet.set.title}</p>
              <p className="mt-1 text-sm text-muted">{focusSet.stats.due} карточек ждут повторения</p>
            </div>
            <span className="icon-chip h-11 w-11 text-muted">
              <ChevronRightIcon className="h-5 w-5" />
            </span>
          </Link>
        ) : null}
      </section>

      <section className="space-y-3">
        <div>
          <p className="section-kicker">Activity</p>
          <h2 className="mt-2 text-2xl font-semibold text-text">Активность</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Проверок сегодня" value={appStats.reviewsToday} trend={appStats.reviewsToday > 10 ? "up" : "neutral"} />
          <StatCard
            label="Точность ответов"
            value={accuracyValue}
            unit="%"
            trend={accuracyValue > 80 ? "up" : accuracyValue > 60 ? "neutral" : "down"}
          />
          <StatCard label="Уровень" value={appStats.level} />
          <StatCard label="Активные наборы" value={activeSets} trend={activeSets > 0 ? "up" : "neutral"} />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="section-kicker">Sets</p>
          <h2 className="mt-2 text-2xl font-semibold text-text">По наборам</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Всего наборов" value={appStats.totalSets} />
          <StatCard label="Осталось выучить" value={Math.max(totalCards - masteredCards, 0)} />
          <StatCard label="Средний темп" value={formatPercent(masteryRate)} />
          <StatCard label="Повторов в журнале" value={reviews.length} />
        </div>
      </section>

      <section className="glass-panel rounded-[32px] p-5">
        <p className="section-kicker">Backup</p>
        <h2 className="mt-3 text-2xl font-semibold text-text">Резервная копия</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Сохрани снимок прогресса, чтобы перенести наборы и историю повторений на другое устройство или просто иметь запасную копию.
        </p>
        <div className="mt-5">
          <ExportImport />
        </div>
      </section>
    </div>
  );
}
