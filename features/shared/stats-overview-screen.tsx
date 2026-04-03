"use client";

import { useApp } from "@/components/providers/app-provider";
import { StatCard, ProgressBar } from "@/features/shared/progress-components";
import { ExportImport } from "@/features/shared/export-import";
import { formatPercent } from "@/lib/utils";

export function StatsOverviewScreen() {
  const { sets, progressByCard, reviews, appStats } = useApp();

  const totalCards = sets.reduce((sum, set) => sum + set.cards.length, 0);
  const masteredCards = appStats.masteredCards;
  const dueCards = appStats.dueCards;
  const masteryRate = totalCards === 0 ? 0 : (masteredCards / totalCards) * 100;

  // Вычисление средней точности
  const correctReviews = reviews.filter(r => r.result === "known" || r.result === "write-correct").length;
  const accuracyValue = reviews.length === 0 ? 0 : Math.round((correctReviews / reviews.length) * 100);
  const accuracy = `${accuracyValue}`;

  return (
    <div className="space-y-6 pb-20">
      {/* Главный прогресс */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-text">Общий прогресс</h2>
        <ProgressBar value={masteredCards} max={totalCards} showLabel={false} />
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-xs text-muted">Всего</p>
            <p className="text-lg font-semibold text-text">{totalCards}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-xs text-muted">Выучено</p>
            <p className="text-lg font-semibold text-emerald-400">{masteredCards}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-xs text-muted">На повтор</p>
            <p className="text-lg font-semibold text-amber-400">{dueCards}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <p className="text-xs text-muted">Темп</p>
            <p className="text-lg font-semibold text-teal-400">{formatPercent(masteryRate)}%</p>
          </div>
        </div>
      </div>

      {/* Статистика по сессиям */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-text">Активность</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Проверок сегодня"
            value={appStats.reviewsToday}
            trend={appStats.reviewsToday > 10 ? "up" : "neutral"}
          />
          <StatCard
            label="Точность ответов"
            value={accuracy}
            unit="%"
            trend={accuracyValue > 80 ? "up" : accuracyValue > 60 ? "neutral" : "down"}
          />
          <StatCard label="Уровень" value={appStats.level} unit="🌟" />
          <StatCard label="Опыт (XP)" value={appStats.xp} />
        </div>
      </div>

      {/* Детали по наборам */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-text">По наборам</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Всего наборов" value={appStats.totalSets} />
          <StatCard label="В активной работе" value={dueCards > 0 ? Math.ceil(dueCards / 10) : 0} />
          <StatCard label="Завершённых" value={masteredCards} />
          <StatCard label="Осталось выучить" value={totalCards - masteredCards} />
        </div>
      </div>

      {/* Опции */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-text">Опции</h2>
        <ExportImport />
      </div>
    </div>
  );
}