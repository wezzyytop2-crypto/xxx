"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { ArrowLeftIcon, BookIcon, BrainIcon, ClockIcon, PenIcon } from "@/components/icons";
import { SwipeStack } from "@/components/cards/swipe-stack";
import { WriteSession } from "@/components/cards/write-session";
import { useApp } from "@/components/providers/app-provider";
import { buildStudyQueue, repeatCardLater } from "@/lib/study";
import type { CardRecord, ReviewResult, StudyMode } from "@/lib/types";
import { cn, formatPercent } from "@/lib/utils";

const modeLabels: Record<StudyMode, { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  flashcards: { label: "Flashcards", icon: BookIcon },
  learn: { label: "Learn", icon: BrainIcon },
  write: { label: "Write", icon: PenIcon }
};

export function StudyScreen({ setId, initialMode }: { setId: string; initialMode: StudyMode }) {
  const router = useRouter();
  const { ready, getSet, progressByCard, recordCardReview, getSetStatsById } = useApp();
  const set = getSet(setId);
  const stats = set ? getSetStatsById(set.id) : null;
  const [mode, setMode] = useState<StudyMode>(initialMode);
  const [queue, setQueue] = useState<CardRecord[]>([]);
  const [busy, setBusy] = useState(false);
  const [sessionKnown, setSessionKnown] = useState(0);
  const [sessionAgain, setSessionAgain] = useState(0);

  function rebuildSession(nextMode: StudyMode) {
    if (!set) {
      return;
    }

    const nextQueue = buildStudyQueue(set.cards, progressByCard, nextMode);

    setQueue(nextQueue);
    setSessionKnown(0);
    setSessionAgain(0);
  }

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!ready || !set) {
      return;
    }

    rebuildSession(mode);
  }, [mode, ready, set?.id]);

  async function handleReview(result: ReviewResult) {
    const current = queue[0];

    if (!current || busy || !set) {
      return;
    }

    setBusy(true);
    await recordCardReview({
      setId: set.id,
      cardId: current.id,
      mode,
      result
    });
    setQueue((previous) => repeatCardLater(previous, current, result, mode));

    if (result === "known" || result === "write-correct") {
      setSessionKnown((value) => value + 1);
    } else {
      setSessionAgain((value) => value + 1);
    }

    setBusy(false);
  }

  function switchMode(nextMode: StudyMode) {
    setMode(nextMode);
    rebuildSession(nextMode);
    router.replace(`/sets/${setId}/study?mode=${nextMode}`);
  }

  if (!ready) {
    return <div className="screen-pad glass-panel mt-6 h-72 animate-pulse rounded-[32px]" />;
  }

  if (!set || !stats) {
    return (
      <div className="screen-pad flex min-h-[70dvh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-text">Набор не найден</h1>
        <Link href="/" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950">
          На главный экран
        </Link>
      </div>
    );
  }

  const current = queue[0];
  const studied = sessionKnown + sessionAgain;
  const completion = studied === 0 ? 0 : (sessionKnown / studied) * 100;

  return (
    <div className="screen-pad flex flex-col gap-5 pb-6">
      <header className="top-safe flex items-center justify-between gap-3">
        <Link href={`/sets/${set.id}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel text-text">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Study</p>
          <h1 className="mt-1 text-xl font-semibold text-text">{set.title}</h1>
        </div>
      </header>

      <section className="glass-panel rounded-[32px] p-4">
        <div className="grid grid-cols-3 gap-3">
          {(["flashcards", "learn", "write"] as StudyMode[]).map((item) => {
            const config = modeLabels[item];
            const Icon = config.icon;

            return (
              <button
                key={item}
                type="button"
                onClick={() => switchMode(item)}
                className={cn(
                  "rounded-[24px] px-3 py-4 text-center transition",
                  mode === item ? "bg-accent text-slate-950 shadow-glow" : "border border-line bg-black/10 text-text"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-semibold">{config.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <div className="glass-panel rounded-[24px] p-3">
          <p className="text-xs text-muted">В очереди</p>
          <p className="mt-2 text-xl font-semibold text-text">{queue.length}</p>
        </div>
        <div className="glass-panel rounded-[24px] p-3">
          <p className="text-xs text-muted">Точность</p>
          <p className="mt-2 text-xl font-semibold text-text">{formatPercent(completion)}</p>
        </div>
        <div className="glass-panel rounded-[24px] p-3">
          <p className="text-xs text-muted">К повтору</p>
          <p className="mt-2 text-xl font-semibold text-text">{stats.due}</p>
        </div>
      </section>

      {current ? (
        mode === "write" ? (
          <WriteSession cards={queue} busy={busy} onAdvance={handleReview} />
        ) : (
          <SwipeStack
            cards={queue}
            busy={busy}
            onResult={async (result) => {
              await handleReview(result);
            }}
          />
        )
      ) : (
        <section className="glass-panel rounded-[32px] p-6 text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full border border-line bg-white/5">
            <ClockIcon className="h-8 w-8 text-accent" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-text">Сессия завершена</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Сегодня ты отметил как известные {sessionKnown} карточек и отправил на повтор {sessionAgain}.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href={`/sets/${set.id}`}
              className="inline-flex items-center justify-center rounded-[24px] border border-line bg-panel px-4 py-4 text-sm font-medium text-text"
            >
              К набору
            </Link>
            <button
              type="button"
              onClick={() => rebuildSession(mode)}
              className="inline-flex items-center justify-center rounded-[24px] bg-accent px-4 py-4 text-sm font-semibold text-slate-950 shadow-glow"
            >
              Пройти ещё раз
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
