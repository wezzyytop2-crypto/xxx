"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChartIcon, DeckIcon, OfflineIcon, PlusIcon, SignalIcon, StarIcon } from "@/components/icons";
import { InstallPrompt } from "@/components/install-prompt";
import { useApp } from "@/components/providers/app-provider";
import { SetListCard } from "@/features/sets/components/set-list-card";
import { BUILT_IN_LIBRARY_STATS } from "@/lib/dictionary";
import { formatPercent, normalizeAnswer } from "@/lib/utils";

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

  return (
    <div className="screen-pad flex flex-col gap-6 pb-6">
      <header className="top-safe flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Romanian PWA</p>
          <h1 className="mt-2 text-3xl font-semibold text-text">LIMBI</h1>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
            Телефонный формат для ежедневных повторений, быстрых свайпов и локального прогресса.
          </p>
        </div>
        <InstallPrompt />
      </header>

      <div className="flex items-center gap-2">
        <span className="rounded-full border border-line bg-panel px-3 py-2 text-xs text-muted">
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
        <span className="rounded-full border border-line bg-panel px-3 py-2 text-xs text-muted">
          IndexedDB на устройстве
        </span>
      </div>

      <section className="glass-panel overflow-hidden rounded-[32px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-warning">Сегодня</p>
            <h2 className="mt-2 text-2xl font-semibold text-text">{appStats.dueCards} слов ждут повторения</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {appStats.reviewsToday} проверок за сегодня. Прогресс полностью хранится локально.
            </p>
          </div>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white/5 text-lg font-semibold text-text">
            {formatPercent(completion)}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          <div className="rounded-[24px] border border-line bg-black/10 p-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
              <DeckIcon className="h-4 w-4 text-text" />
            </div>
            <p className="mt-3 text-xs text-muted">Наборы</p>
            <p className="text-lg font-semibold">{appStats.totalSets}</p>
          </div>
          <div className="rounded-[24px] border border-line bg-black/10 p-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
              <ChartIcon className="h-4 w-4 text-text" />
            </div>
            <p className="mt-3 text-xs text-muted">Карточки</p>
            <p className="text-lg font-semibold">{appStats.totalCards}</p>
          </div>
          <div className="rounded-[24px] border border-line bg-black/10 p-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
              <DeckIcon className="h-4 w-4 text-text" />
            </div>
            <p className="mt-3 text-xs text-muted">Словарь</p>
            <p className="text-lg font-semibold">{BUILT_IN_LIBRARY_STATS.words}</p>
          </div>
          <div className="rounded-[24px] border border-line bg-black/10 p-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
              <StarIcon className="h-4 w-4 text-text" />
            </div>
            <p className="mt-3 text-xs text-muted">Уровень</p>
            <p className="text-lg font-semibold">{appStats.level}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Link
            href="/sets/new"
            className="inline-flex items-center justify-center gap-2 rounded-[24px] border border-line bg-white/5 px-4 py-4 text-sm font-semibold text-text"
          >
            <PlusIcon className="h-5 w-5" />
            Новый набор
          </Link>
          <Link
            href="/stats"
            className="inline-flex items-center justify-center gap-2 rounded-[24px] border border-line bg-white/5 px-4 py-4 text-sm font-semibold text-text"
          >
            📊 Статистика
          </Link>
          <Link
            href={focusSet ? `/sets/${focusSet.set.id}/study?mode=learn` : "/"}
            className="inline-flex items-center justify-center gap-2 rounded-[24px] bg-accent px-4 py-4 text-sm font-semibold text-slate-950 shadow-glow"
          >
            Учить сейчас
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">Наборы</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              Готовая библиотека: {BUILT_IN_LIBRARY_STATS.categories} категорий, от {BUILT_IN_LIBRARY_STATS.cardsPerCategory} карточек в каждом наборе.
            </p>
          </div>
          <span className="text-xs text-muted">{visibleSets.length} найдено</span>
        </div>

        <div className="glass-panel rounded-[28px] p-4">
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted" htmlFor="sets-search">
            Поиск по категориям и словам
          </label>
          <input
            id="sets-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например: mânca, путешествие, семья"
            className="w-full rounded-[22px] border border-line bg-black/10 px-4 py-4 text-sm outline-none transition placeholder:text-muted/80 focus:border-accent/40"
          />
        </div>

        {!ready ? (
          <div className="space-y-3">
            {[0, 1].map((item) => (
              <div key={item} className="glass-panel h-40 animate-pulse rounded-[28px]" />
            ))}
          </div>
        ) : null}

        {ready && sets.length === 0 ? (
          <div className="glass-panel rounded-[28px] p-5 text-center">
            <h3 className="text-lg font-semibold text-text">Пока нет наборов</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Создай свой первый словарь или начни с демо-наборов, которые уже загружены при первом запуске.
            </p>
          </div>
        ) : null}

        {ready && sets.length > 0 && visibleSets.length === 0 ? (
          <div className="glass-panel rounded-[28px] p-5 text-center">
            <h3 className="text-lg font-semibold text-text">Ничего не найдено</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Попробуй короче запрос, первые буквы румынского слова или тему на русском.
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
