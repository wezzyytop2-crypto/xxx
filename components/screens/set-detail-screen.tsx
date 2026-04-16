"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  BookIcon,
  BrainIcon,
  ClockIcon,
  EditIcon,
  PenIcon,
  RefreshIcon,
  StarIcon,
  TrashIcon,
  VolumeIcon
} from "@/components/icons";
import { useApp } from "@/components/providers/app-provider";
import { speakRomanian } from "@/lib/speech";
import { formatDateTime, formatPercent, labelForReviewResult, partOfSpeechLabel, toneStyles } from "@/lib/utils";
import { useState } from "react";

export function SetDetailScreen({ setId }: { setId: string }) {
  const router = useRouter();
  const { ready, getSet, getSetStatsById, deleteSetItem, resetProgressForSet, reviews, progressByCard } = useApp();
  const set = getSet(setId);
  const stats = set ? getSetStatsById(set.id) : null;
  const tone = set ? toneStyles[set.color] : toneStyles.teal;
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  async function removeSet() {
    const confirmed = window.confirm("Удалить набор и весь прогресс по нему?");

    if (!confirmed) {
      return;
    }

    await deleteSetItem(setId);
    router.replace("/");
  }

  async function resetProgress() {
    const confirmed = window.confirm("Сбросить прогресс повторений для этого набора?");

    if (!confirmed) {
      return;
    }

    await resetProgressForSet(setId);
  }

  async function shareSet() {
    if (!set) return;
    const json = JSON.stringify(set, null, 2);
    const file = new File([json], `${set.title || "set"}.json`, { type: "application/json" });
    if (navigator.share) {
      try {
        await navigator.share({
          title: set.title,
          text: `Набор LIMBI: ${set.title}`,
          files: [file]
        });
        setShareStatus("Набор успешно отправлен!");
      } catch {
        setShareStatus("Не удалось поделиться набором.");
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(json);
        setShareStatus("JSON набора скопирован в буфер обмена!");
      } catch {
        setShareStatus("Не удалось скопировать JSON.");
      }
    } else {
      setShareStatus("Ваш браузер не поддерживает обмен файлами или буфер обмена.");
    }
    setTimeout(() => setShareStatus(null), 3000);
  }

  if (!ready) {
    return <div className="screen-pad glass-panel mt-6 h-56 animate-pulse rounded-[32px]" />;
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

  const recentReviews = reviews.filter((item) => item.setId === set.id).slice(0, 8);

  return (
    <div className="screen-pad flex flex-col gap-5 pb-8">
      <header className="top-safe flex items-center justify-between gap-3">
        <Link href="/" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel text-text">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <Link
          href={`/sets/${set.id}/edit`}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium text-text"
        >
          <EditIcon className="h-4 w-4" />
          Изменить
        </Link>
      </header>

      <section className={`glass-panel overflow-hidden rounded-[32px] bg-gradient-to-br ${tone.hero} p-5`}>
        <p className="text-xs uppercase tracking-[0.24em] text-accent">Набор</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">{set.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted">{set.description || "Без описания."}</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-[24px] border border-line bg-black/10 p-3">
            <p className="text-xs text-muted">Карточек</p>
            <p className="mt-2 text-xl font-semibold">{stats.total}</p>
          </div>
          <div className="rounded-[24px] border border-line bg-black/10 p-3">
            <p className="text-xs text-muted">Выучено</p>
            <p className="mt-2 text-xl font-semibold">
              {formatPercent(stats.total === 0 ? 0 : (stats.mastered / stats.total) * 100)}
            </p>
          </div>
          <div className="rounded-[24px] border border-line bg-black/10 p-3">
            <p className="text-xs text-muted">Точность</p>
            <p className="mt-2 text-xl font-semibold">{formatPercent(stats.accuracy)}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link
          href={`/sets/${set.id}/study?mode=focus`}
          className="glass-panel flex min-h-28 flex-col items-center justify-center gap-2 rounded-[28px] p-4 text-center"
        >
          <StarIcon className="h-6 w-6 text-spot" />
          <span className="text-sm font-semibold text-text">Фокус</span>
        </Link>
        <Link
          href={`/sets/${set.id}/study?mode=flashcards`}
          className="glass-panel flex min-h-28 flex-col items-center justify-center gap-2 rounded-[28px] p-4 text-center"
        >
          <BookIcon className="h-6 w-6 text-accent" />
          <span className="text-sm font-semibold text-text">Карточки</span>
        </Link>
        <Link
          href={`/sets/${set.id}/study?mode=learn`}
          className="glass-panel flex min-h-28 flex-col items-center justify-center gap-2 rounded-[28px] p-4 text-center"
        >
          <BrainIcon className="h-6 w-6 text-accent" />
          <span className="text-sm font-semibold text-text">Учить</span>
        </Link>
        <Link
          href={`/sets/${set.id}/study?mode=write`}
          className="glass-panel flex min-h-28 flex-col items-center justify-center gap-2 rounded-[28px] p-4 text-center"
        >
          <PenIcon className="h-6 w-6 text-accent" />
          <span className="text-sm font-semibold text-text">Письмо</span>
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => void resetProgress()}
          className="inline-flex items-center justify-center gap-2 rounded-[24px] border border-line bg-panel px-4 py-4 text-sm font-medium text-text"
        >
          <RefreshIcon className="h-4 w-4" />
          Сбросить прогресс
        </button>
        <button
          type="button"
          onClick={() => void removeSet()}
          className="inline-flex items-center justify-center gap-2 rounded-[24px] border border-danger/30 bg-danger/10 px-4 py-4 text-sm font-medium text-danger"
        >
          <TrashIcon className="h-4 w-4" />
          Удалить
        </button>
        <button
          type="button"
          onClick={shareSet}
          className="inline-flex items-center justify-center gap-2 rounded-[24px] border border-accent/40 bg-accent/10 px-4 py-4 text-sm font-medium text-accent"
        >
          <StarIcon className="h-4 w-4" />
          Поделиться
        </button>
      </section>
      {shareStatus && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-accent px-6 py-3 text-center text-slate-950 shadow-xl">
          {shareStatus}
        </div>
      )}

      <section className="glass-panel rounded-[32px] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">История повторений</h2>
          <span className="text-xs text-muted">{stats.reviewsToday} сегодня</span>
        </div>

        {recentReviews.length === 0 ? (
          <p className="text-sm leading-6 text-muted">Ещё нет повторений. Начни с любого режима обучения.</p>
        ) : (
          <div className="space-y-3">
            {recentReviews.map((item) => {
              const card = set.cards.find((cardItem) => cardItem.id === item.cardId);

              return (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-[24px] border border-line bg-black/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-text">{card?.term ?? "Карточка"}</p>
                    <p className="text-xs text-muted">{formatDateTime(item.reviewedAt)}</p>
                  </div>
                  <span className="rounded-full border border-line bg-panel px-3 py-1 text-xs text-text">
                    {labelForReviewResult(item.result)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Карточки набора</h2>
          <span className="text-xs text-muted">{set.cards.length} шт.</span>
        </div>

        {set.cards.map((card) => {
          const progress = progressByCard[card.id];

          return (
            <article key={card.id} className="glass-panel rounded-[28px] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-text">{card.term}</p>
                  <p className="mt-1 text-sm text-muted">{card.translation}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speakRomanian(card.term)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-black/10 text-text"
                >
                  <VolumeIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-line bg-black/10 px-3 py-1 text-muted">
                  {partOfSpeechLabel(card.partOfSpeech)}
                </span>
                <span className="rounded-full border border-line bg-black/10 px-3 py-1 text-muted">
                  {progress?.mastered ? "Выучено" : "В процессе"}
                </span>
                <span className="rounded-full border border-line bg-black/10 px-3 py-1 text-muted">
                  {progress ? `Интервал ${progress.intervalDays || 0} дн.` : "Ещё не повторялось"}
                </span>
              </div>
              {card.example ? <p className="mt-3 text-sm leading-6 text-muted">{card.example}</p> : null}
              {card.note ? <p className="mt-2 text-sm leading-6 text-muted">{card.note}</p> : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
