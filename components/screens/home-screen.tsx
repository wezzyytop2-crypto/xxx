"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BrainIcon,
  ChartIcon,
  ChevronRightIcon,
  ClockIcon,
  DeckIcon,
  OfflineIcon,
  PlusIcon,
  SignalIcon,
  StarIcon
} from "@/components/icons";
import { InstallPrompt } from "@/components/install-prompt";
import { useApp } from "@/components/providers/app-provider";
import { SetListCard } from "@/features/sets/components/set-list-card";
import { ProgressBar } from "@/features/shared/progress-components";
import { BUILT_IN_LIBRARY_STATS } from "@/lib/dictionary";
import { formatPercent, normalizeAnswer, relativeTimeFromNow } from "@/lib/utils";

export function HomeScreen() {
  const { ready, sets, appStats, getSetStatsById } = useApp();
  const [online, setOnline] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOnline(window.navigator.onLine);

    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const completion = appStats.totalCards === 0 ? 0 : (appStats.masteredCards / appStats.totalCards) * 100;
  const focusSet = sets
    .map((set) => ({
      set,
      stats: getSetStatsById(set.id)
    }))
    .sort((left, right) => (right.stats?.due ?? 0) - (left.stats?.due ?? 0))[0];
  const normalizedQuery = normalizeAnswer(query);
  const visibleSets =
    normalizedQuery.length === 0
      ? sets
      : sets.filter((set) => {
          const searchable = [
            set.title,
            set.description,
            ...set.cards.flatMap((card) => [card.term, card.translation, card.example, card.note])
          ]
            .join(" ")
            .trim();

          return normalizeAnswer(searchable).includes(normalizedQuery);
        });

  const heroTitle =
    appStats.dueCards > 0 ? `${appStats.dueCards} карточек готовы к повторению` : "Сегодня можно идти в комфортном темпе";
  const heroText =
    appStats.dueCards > 0
      ? `${appStats.reviewsToday} проверок уже позади. Прогресс хранится локально и не теряется между сессиями.`
      : "Очередь на повтор чистая. Можно открыть словарь, собрать новый набор или пройти легкую сессию для закрепления.";

  return (
    <div className="screen-pad flex flex-col gap-6 pb-8">
      <header className="top-safe flex items-start justify-between gap-3">
        <div className="max-w-xs">
          <p className="section-kicker">Romanian Sprint</p>
          <h1 className="mt-3 text-[2.9rem] font-semibold leading-none text-gradient">LIMBI</h1>
          <p className="mt-3 text-sm leading-6 text-muted text-balance">
            Локальный тренажер для румынского: быстрые сессии, карточки, словарь и прогресс прямо на устройстве.
          </p>
        </div>
        <InstallPrompt />
      </header>

      <div className="flex flex-wrap gap-2">
        <span className="pill-tag text-xs">
          {online ? (
            <span className="inline-flex items-center gap-2">
              <SignalIcon className="h-4 w-4" />
              В сети
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <OfflineIcon className="h-4 w-4" />
              Оффлайн
            </span>
          )}
        </span>
        <span className="pill-tag text-xs">Local-first · IndexedDB</span>
      </div>

      <section className="glass-panel relative overflow-hidden rounded-[36px] p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-spot/10 blur-3xl" />

        <div className="relative space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[15rem]">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-spot">Сегодня в фокусе</p>
              <h2 className="mt-3 text-[2rem] font-semibold leading-tight text-balance text-text">{heroTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{heroText}</p>
            </div>

            <div className="accent-ring flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-[28px] border border-accent/25 bg-accentSoft text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-950/70">Темп</span>
              <span className="mt-2 text-3xl font-semibold leading-none text-slate-950">{formatPercent(completion)}</span>
            </div>
          </div>

          <ProgressBar value={appStats.masteredCards} max={Math.max(appStats.totalCards, 1)} showLabel={false} />

          <div className="grid grid-cols-2 gap-3">
            <div className="metric-tile">
              <div className="icon-chip h-10 w-10 text-text">
                <DeckIcon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">Наборы</p>
              <p className="mt-1 text-2xl font-semibold text-text">{appStats.totalSets}</p>
            </div>
            <div className="metric-tile">
              <div className="icon-chip h-10 w-10 text-text">
                <ClockIcon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">На сегодня</p>
              <p className="mt-1 text-2xl font-semibold text-text">{appStats.dueCards}</p>
            </div>
            <div className="metric-tile">
              <div className="icon-chip h-10 w-10 text-text">
                <ChartIcon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">Карточки</p>
              <p className="mt-1 text-2xl font-semibold text-text">{appStats.totalCards}</p>
            </div>
            <div className="metric-tile">
              <div className="icon-chip h-10 w-10 text-text">
                <StarIcon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">Уровень</p>
              <p className="mt-1 text-2xl font-semibold text-text">{appStats.level}</p>
            </div>
          </div>

          {focusSet?.stats ? (
            <Link
              href={`/sets/${focusSet.set.id}`}
              className="surface-card flex items-center justify-between gap-4 rounded-[28px] p-4 transition hover:bg-white/5"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Лучший следующий шаг</p>
                <p className="mt-2 text-lg font-semibold text-text">{focusSet.set.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {focusSet.stats.due} на повтор · последний подход {relativeTimeFromNow(focusSet.stats.lastReviewedAt)}
                </p>
              </div>
              <span className="icon-chip h-11 w-11 text-muted">
                <ChevronRightIcon className="h-5 w-5" />
              </span>
            </Link>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={focusSet ? `/sets/${focusSet.set.id}/study?mode=learn` : "/translate"}
              className="primary-action col-span-2 inline-flex items-center justify-between rounded-[28px] px-5 py-4 text-sm font-semibold text-slate-950"
            >
              <span className="inline-flex items-center gap-3">
                <span className="icon-chip h-10 w-10 border-none bg-slate-950/10 text-slate-950">
                  <BrainIcon className="h-5 w-5" />
                </span>
                Учить сейчас
              </span>
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/stats"
              className="secondary-action inline-flex items-center justify-center gap-2 rounded-[26px] px-4 py-4 text-sm font-semibold text-text"
            >
              <ChartIcon className="h-4 w-4 text-accent" />
              Статистика
            </Link>
            <Link
              href="/sets/new"
              className="secondary-action inline-flex items-center justify-center gap-2 rounded-[26px] px-4 py-4 text-sm font-semibold text-text"
            >
              <PlusIcon className="h-4 w-4 text-accent" />
              Новый набор
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Library</p>
            <h2 className="mt-2 text-2xl font-semibold text-text">Наборы</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
              {BUILT_IN_LIBRARY_STATS.categories} категорий и около {BUILT_IN_LIBRARY_STATS.cardsPerCategory} карточек в каждом
              встроенном наборе.
            </p>
          </div>
          <span className="rounded-full border border-line/70 bg-white/5 px-3 py-2 text-xs text-muted">{visibleSets.length} найдено</span>
        </div>

        <div className="glass-panel rounded-[32px] p-4">
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted" htmlFor="sets-search">
            Поиск по темам и словам
          </label>
          <div className="field-shell flex items-center gap-3 rounded-[26px] px-4 py-3">
            <DeckIcon className="h-5 w-5 text-muted" />
            <input
              id="sets-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например: casa, путешествие, семья"
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted/80"
            />
          </div>
        </div>

        {!ready ? (
          <div className="space-y-3">
            {[0, 1].map((item) => (
              <div key={item} className="glass-panel h-44 animate-pulse rounded-[32px]" />
            ))}
          </div>
        ) : null}

        {ready && sets.length === 0 ? (
          <div className="glass-panel rounded-[32px] p-6 text-center">
            <h3 className="text-xl font-semibold text-text">Пока нет наборов</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Создай первый набор или начни со встроенной библиотеки, которая уже готова к ежедневным повторениям.
            </p>
          </div>
        ) : null}

        {ready && sets.length > 0 && visibleSets.length === 0 ? (
          <div className="glass-panel rounded-[32px] p-6 text-center">
            <h3 className="text-xl font-semibold text-text">Ничего не найдено</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Попробуй более короткий запрос, корень слова или тему на русском языке.
            </p>
          </div>
        ) : null}

        {ready
          ? visibleSets.map((set) => {
              const stats = getSetStatsById(set.id);

              if (!stats) {
                return null;
              }

              return <SetListCard key={set.id} set={set} stats={stats} />;
            })
          : null}
      </section>
    </div>
  );
}
