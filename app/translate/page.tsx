"use client";

import { useEffect, useState } from "react";
import { DictionaryCard } from "@/components/dictionary-card";
import { RefreshIcon } from "@/components/icons";
import { TRANSLATION_DICTIONARY_SIZE, translate } from "@/lib/translation";
import type { TranslationDirection, TranslationResult } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function TranslatePage() {
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState<TranslationDirection>("ro-ru");
  const [results, setResults] = useState<TranslationResult | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");

    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (value.length > 0) {
      setResults(translate(value, direction));
      return;
    }

    setResults(null);
  };

  const handleSelectWord = (word: string) => {
    setQuery(word);
    setResults(translate(word, direction));

    setRecentSearches((previous) => {
      const updated = [word, ...previous.filter((item) => item !== word)].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const switchDirection = () => {
    const nextDirection = direction === "ro-ru" ? "ru-ro" : "ro-ru";
    setDirection(nextDirection);
    setResults(null);
    setQuery("");
  };

  const placeholder = direction === "ro-ru" ? "Введите румынское слово" : "Введите русское слово";
  const directionLabel = direction === "ro-ru" ? "RO → RU" : "RU → RO";

  return (
    <div className="screen-pad flex flex-col gap-6 pb-8">
      <header className="top-safe">
        <p className="section-kicker">Instant Dictionary</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-text text-balance">Словарь Romanian ↔ Russian</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
          Быстрый локальный поиск по {TRANSLATION_DICTIONARY_SIZE} словам, значениям и примерам. Без сети, без ожидания, с
          произношением для румынских слов.
        </p>
      </header>

      <section className="glass-panel rounded-[36px] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Направление</p>
            <p className="mt-2 text-lg font-semibold text-text">{direction === "ro-ru" ? "Румынский в русский" : "Русский в румынский"}</p>
          </div>

          <button
            type="button"
            onClick={switchDirection}
            className="secondary-action inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-text"
          >
            <RefreshIcon className="h-4 w-4 text-accent" />
            {directionLabel}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="surface-card rounded-[24px] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Слов</p>
            <p className="mt-2 text-2xl font-semibold text-text">{TRANSLATION_DICTIONARY_SIZE}</p>
          </div>
          <div className="surface-card rounded-[24px] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Режим</p>
            <p className="mt-2 text-base font-semibold text-text">{directionLabel}</p>
          </div>
          <div className="surface-card rounded-[24px] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Память</p>
            <p className="mt-2 text-2xl font-semibold text-text">{recentSearches.length}</p>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted" htmlFor="dictionary-search">
            Поиск
          </label>
          <div className="field-shell flex items-center gap-3 rounded-[28px] px-4 py-3">
            <input
              id="dictionary-search"
              type="text"
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder={`${placeholder} или часть слова`}
              autoFocus
              className="w-full bg-transparent text-base text-text outline-none placeholder:text-muted/80"
            />
            {query ? (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="rounded-full bg-white/6 px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-text"
              >
                Очистить
              </button>
            ) : null}
          </div>
        </div>

        {!query && recentSearches.length > 0 ? (
          <div className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Недавние запросы</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => handleSelectWord(search)}
                  className="secondary-action rounded-full px-3 py-1.5 text-xs font-semibold text-text"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {results && query ? (
        <div className="space-y-5">
          {results.exact.length > 0 ? (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Results</p>
                  <h2 className="mt-2 text-2xl font-semibold text-text">Точные совпадения</h2>
                </div>
                <span className="rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  {results.exact.length}
                </span>
              </div>

              <div className="space-y-3">
                {results.exact.map((entry) => (
                  <DictionaryCard key={entry.id} entry={entry} direction={direction} onSelectWord={handleSelectWord} />
                ))}
              </div>
            </section>
          ) : null}

          {results.partial.length > 0 ? (
            <section className="glass-panel rounded-[32px] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Matches</p>
                  <h2 className="mt-2 text-xl font-semibold text-text">Похожие слова</h2>
                </div>
                <span className="rounded-full border border-accent/20 bg-accentSoft px-3 py-1 text-xs font-semibold text-accent">
                  {results.partial.length}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {results.partial.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleSelectWord(direction === "ro-ru" ? entry.romanian : entry.russian)}
                    className="secondary-action rounded-full px-3 py-2 text-sm font-semibold text-text"
                  >
                    {direction === "ro-ru" ? entry.romanian : entry.russian}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {results.exact.length === 0 && results.suggestions.length > 0 ? (
            <section className="glass-panel rounded-[32px] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Suggestions</p>
                  <h2 className="mt-2 text-xl font-semibold text-text">Возможно, ты имел в виду</h2>
                </div>
                <span className="rounded-full border border-spot/20 bg-spotSoft px-3 py-1 text-xs font-semibold text-spot">
                  {results.suggestions.length}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {results.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSelectWord(suggestion)}
                    className="rounded-full border border-spot/20 bg-spotSoft px-3 py-2 text-sm font-semibold text-spot transition hover:bg-spot/15"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {results.exact.length === 0 && results.partial.length === 0 && results.suggestions.length === 0 ? (
            <section className="glass-panel rounded-[32px] p-6 text-center">
              <h2 className="text-2xl font-semibold text-text">По запросу ничего не найдено</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Попробуй другой вариант написания, убери окончание или начни с более короткой формы слова.
              </p>
            </section>
          ) : null}
        </div>
      ) : null}

      {!results && !query ? (
        <section className="glass-panel rounded-[36px] p-6">
          <p className="section-kicker">Quick Start</p>
          <h2 className="mt-3 text-2xl font-semibold text-text">Начни с короткого запроса</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            Словарь работает мгновенно и локально. Попробуй одно из популярных слов или введи только корень, если не помнишь
            полную форму.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {["casă", "carte", "om", "a merge", "bun", "zi", "apă"].map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => handleSelectWord(word)}
                className={cn("secondary-action rounded-full px-3 py-2 text-sm font-semibold text-text")}
              >
                {word}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
