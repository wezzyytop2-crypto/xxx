import Link from "next/link";
import { memo } from "react";
import { ChevronRightIcon, ClockIcon, DeckIcon } from "@/components/icons";
import { ProgressBar } from "@/features/shared/progress-components";
import type { SetStats, StudySet } from "@/lib/types";
import { cn, formatPercent, toneStyles } from "@/lib/utils";

export const SetListCard = memo(function SetListCard({ set, stats }: { set: StudySet; stats: SetStats }) {
  const tone = toneStyles[set.color];
  const masteredRate = stats.total === 0 ? 0 : (stats.mastered / stats.total) * 100;

  return (
    <Link href={`/sets/${set.id}`} className="block">
      <article
        className={cn(
          "glass-panel relative overflow-hidden rounded-[32px] p-5 transition duration-300 hover:-translate-y-1",
          "bg-gradient-to-br",
          tone.hero
        )}
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/8 to-transparent" />
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/8 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className={cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium", tone.pill)}>
                <span className={cn("h-2 w-2 rounded-full", tone.dot)} />
                {stats.total} карточек
              </span>
              {stats.due > 0 ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-spot/30 bg-spot/10 px-2.5 py-1 text-[11px] font-medium text-spot">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {stats.due} на повтор
                </span>
              ) : null}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text">{set.title}</h3>
              <p className="line-clamp-2 text-sm leading-6 text-muted">{set.description || "Без описания."}</p>
            </div>
          </div>
          <span className="icon-chip h-11 w-11 text-muted">
            <ChevronRightIcon className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-5 rounded-[24px] border border-white/8 bg-black/10 p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>Прогресс набора</span>
            <span className="font-semibold text-text">{formatPercent(masteredRate)}</span>
          </div>
          <ProgressBar value={stats.mastered} max={Math.max(stats.total, 1)} showLabel={false} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="metric-tile">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8">
              <DeckIcon className="h-4 w-4 text-text" />
            </div>
            <p className="text-xs text-muted">Выучено</p>
            <p className="mt-1 text-lg font-semibold">{formatPercent(masteredRate)}</p>
          </div>
          <div className="metric-tile">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8">
              <ClockIcon className="h-4 w-4 text-text" />
            </div>
            <p className="text-xs text-muted">На повтор</p>
            <p className="mt-1 text-lg font-semibold">{stats.due}</p>
          </div>
          <div className="metric-tile">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8">
              <DeckIcon className="h-4 w-4 text-text" />
            </div>
            <p className="text-xs text-muted">Трудные</p>
            <p className="mt-1 text-lg font-semibold">{stats.difficult}</p>
          </div>
        </div>
      </article>
    </Link>
  );
});
