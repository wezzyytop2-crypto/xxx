import Link from "next/link";
import { memo } from "react";
import { ChevronRightIcon, ClockIcon, DeckIcon } from "@/components/icons";
import type { SetStats, StudySet } from "@/lib/types";
import { cn, formatPercent, toneStyles } from "@/lib/utils";

export const SetListCard = memo(function SetListCard({ set, stats }: { set: StudySet; stats: SetStats }) {
  const tone = toneStyles[set.color];
  const masteredRate = stats.total === 0 ? 0 : (stats.mastered / stats.total) * 100;

  return (
    <Link href={`/sets/${set.id}`} className="block">
      <article
        className={cn(
          "glass-panel relative overflow-hidden rounded-[28px] p-5 transition duration-300 hover:-translate-y-0.5",
          "bg-gradient-to-br",
          tone.hero
        )}
      >
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-2">
            <span className={cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium", tone.pill)}>
              <span className={cn("h-2 w-2 rounded-full", tone.dot)} />
              {stats.total} карточек
            </span>
            <div>
              <h3 className="text-lg font-semibold text-text">{set.title}</h3>
              <p className="line-clamp-2 text-sm leading-6 text-muted">{set.description || "Без описания."}</p>
            </div>
          </div>
          <ChevronRightIcon className="mt-1 h-5 w-5 text-muted" />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-3xl border border-line bg-black/10 p-3">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8">
              <DeckIcon className="h-4 w-4 text-text" />
            </div>
            <p className="text-xs text-muted">Выучено</p>
            <p className="mt-1 text-lg font-semibold">{formatPercent(masteredRate)}</p>
          </div>
          <div className="rounded-3xl border border-line bg-black/10 p-3">
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8">
              <ClockIcon className="h-4 w-4 text-text" />
            </div>
            <p className="text-xs text-muted">На повтор</p>
            <p className="mt-1 text-lg font-semibold">{stats.due}</p>
          </div>
          <div className="rounded-3xl border border-line bg-black/10 p-3">
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