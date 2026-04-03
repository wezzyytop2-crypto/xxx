"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ArrowLeftIcon, CloseIcon, PlusIcon } from "@/components/icons";
import { useApp } from "@/components/providers/app-provider";
import { BUILT_IN_LIBRARY_STATS, getDictionarySuggestions, type DictionaryEntry } from "@/lib/dictionary";
import type { CardDraft, SaveSetInput, SetTone } from "@/lib/types";
import { asDraftDefaults, cn, partOfSpeechOptions, toneOptions, toneStyles } from "@/lib/utils";

function emptyCard(): CardDraft {
  return asDraftDefaults();
}

export function SetEditorScreen({ mode, setId }: { mode: "create" | "edit"; setId?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { ready, getSet, createSetItem, updateSetItem } = useApp();
  const existingSet = setId ? getSet(setId) : undefined;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<SetTone>("teal");
  const [cards, setCards] = useState<CardDraft[]>([emptyCard(), emptyCard(), emptyCard()]);
  const [error, setError] = useState("");
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !existingSet) {
      return;
    }

    setTitle(existingSet.title);
    setDescription(existingSet.description);
    setColor(existingSet.color);
    setCards(
      existingSet.cards.map((card) => ({
        id: card.id,
        term: card.term,
        translation: card.translation,
        example: card.example,
        note: card.note,
        partOfSpeech: card.partOfSpeech
      }))
    );
  }, [existingSet, mode]);

  function updateCard(index: number, patch: Partial<CardDraft>) {
    setCards((previous) => previous.map((card, cardIndex) => (cardIndex === index ? { ...card, ...patch } : card)));
  }

  function removeCard(index: number) {
    setCards((previous) => (previous.length <= 2 ? previous : previous.filter((_, cardIndex) => cardIndex !== index)));
  }

  function addCard() {
    setCards((previous) => [...previous, emptyCard()]);
  }

  function applySuggestion(index: number, suggestion: DictionaryEntry) {
    updateCard(index, {
      term: suggestion.term,
      translation: suggestion.translation,
      example: suggestion.example,
      note: suggestion.note,
      partOfSpeech: suggestion.partOfSpeech
    });
    setFocusedCardIndex(null);
  }

  function handleSubmit() {
    const cleanedCards = cards.filter((card) => card.term.trim() || card.translation.trim());
    const completedCards = cleanedCards.filter((card) => card.term.trim() && card.translation.trim());

    if (title.trim().length < 3) {
      setError("Добавь название набора.");
      return;
    }

    if (completedCards.length < 2) {
      setError("Нужно минимум 2 заполненные карточки.");
      return;
    }

    setError("");

    const payload: SaveSetInput = {
      title,
      description,
      color,
      cards: completedCards
    };

    startTransition(() => {
      void (async () => {
        const saved =
          mode === "edit" && setId ? await updateSetItem(setId, payload) : await createSetItem(payload);

        router.replace(`/sets/${saved.id}`);
      })();
    });
  }

  if (mode === "edit" && !ready) {
    return <div className="screen-pad glass-panel mt-6 h-72 animate-pulse rounded-[32px]" />;
  }

  if (mode === "edit" && ready && !existingSet) {
    return (
      <div className="screen-pad flex min-h-[70dvh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-text">Набор не найден</h1>
        <Link href="/" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950">
          На главный экран
        </Link>
      </div>
    );
  }

  return (
    <div className="screen-pad flex flex-col gap-5 pb-8">
      <header className="top-safe flex items-center justify-between gap-3">
        <Link
          href={mode === "edit" && setId ? `/sets/${setId}` : "/"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel text-text"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">{mode === "edit" ? "Редактирование" : "Новый набор"}</p>
          <h1 className="mt-1 text-xl font-semibold text-text">
            {mode === "edit" ? "Обнови карточки" : "Собери свой словарь"}
          </h1>
        </div>
      </header>

      <section className="glass-panel rounded-[32px] p-5">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-muted" htmlFor="title">
              Название
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например: Еда и покупки"
              className="w-full rounded-[24px] border border-line bg-black/10 px-4 py-4 outline-none transition placeholder:text-muted/80 focus:border-accent/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted" htmlFor="description">
              Описание
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Коротко опиши тему или контекст"
              className="w-full rounded-[24px] border border-line bg-black/10 px-4 py-4 outline-none transition placeholder:text-muted/80 focus:border-accent/40"
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm text-muted">Акцент набора</p>
          <div className="grid grid-cols-3 gap-3">
            {toneOptions.map((tone) => (
              <button
                key={tone.value}
                type="button"
                onClick={() => setColor(tone.value)}
                className={cn(
                  "rounded-[22px] border px-3 py-4 text-sm font-medium transition",
                  color === tone.value ? "border-accent bg-accent text-slate-950" : `border-line bg-panel ${toneStyles[tone.value].pill}`
                )}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">Карточки</h2>
            <p className="mt-1 text-xs leading-5 text-muted">
              Встроенная библиотека: {BUILT_IN_LIBRARY_STATS.categories} готовых наборов, по {BUILT_IN_LIBRARY_STATS.cardsPerCategory}+ карточек в каждом.
            </p>
          </div>
          <button
            type="button"
            onClick={addCard}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium text-text"
          >
            <PlusIcon className="h-4 w-4" />
            Добавить
          </button>
        </div>

        {cards.map((card, index) => (
          <article key={`${card.id ?? "draft"}-${index}`} className="glass-panel rounded-[30px] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Карточка {index + 1}</p>
                <p className="text-sm text-text">Румынский → перевод</p>
              </div>
              <button
                type="button"
                onClick={() => removeCard(index)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-black/10 text-muted"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <input
                  value={card.term}
                  onFocus={() => setFocusedCardIndex(index)}
                  onBlur={() => {
                    window.setTimeout(() => {
                      setFocusedCardIndex((current) => (current === index ? null : current));
                    }, 120);
                  }}
                  onChange={(event) => {
                    updateCard(index, { term: event.target.value });
                    setFocusedCardIndex(index);
                  }}
                  placeholder="Румынское слово"
                  className="w-full rounded-[22px] border border-line bg-black/10 px-4 py-3 outline-none transition placeholder:text-muted/80 focus:border-accent/40"
                />

                {focusedCardIndex === index && card.term.trim().length >= 2 ? (
                  <div className="space-y-2 rounded-[22px] border border-line bg-black/10 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">Подсказки словаря</p>
                    {getDictionarySuggestions(card.term, 6).length > 0 ? (
                      <div className="space-y-2">
                        {getDictionarySuggestions(card.term, 6).map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onPointerDown={() => applySuggestion(index, suggestion)}
                            className="w-full rounded-[18px] border border-line bg-panel px-3 py-3 text-left transition hover:border-accent/30 hover:bg-white/5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-text">{suggestion.term}</p>
                                <p className="mt-1 text-xs text-muted">{suggestion.translation}</p>
                              </div>
                              <span className="rounded-full border border-line bg-black/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-accent">
                                {suggestion.familyTitle}
                              </span>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-muted">{suggestion.example}</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs leading-5 text-muted">
                        Пока нет совпадений. Попробуй первые 2–3 буквы слова с румынской диакритикой или без неё.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
              <input
                value={card.translation}
                onChange={(event) => updateCard(index, { translation: event.target.value })}
                placeholder="Перевод"
                className="w-full rounded-[22px] border border-line bg-black/10 px-4 py-3 outline-none transition placeholder:text-muted/80 focus:border-accent/40"
              />
              <select
                value={card.partOfSpeech}
                onChange={(event) => updateCard(index, { partOfSpeech: event.target.value as CardDraft["partOfSpeech"] })}
                className="w-full rounded-[22px] border border-line bg-black/10 px-4 py-3 outline-none transition focus:border-accent/40"
              >
                {partOfSpeechOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <textarea
                value={card.example}
                onChange={(event) => updateCard(index, { example: event.target.value })}
                rows={2}
                placeholder="Пример предложения"
                className="w-full rounded-[22px] border border-line bg-black/10 px-4 py-3 outline-none transition placeholder:text-muted/80 focus:border-accent/40"
              />
              <textarea
                value={card.note}
                onChange={(event) => updateCard(index, { note: event.target.value })}
                rows={2}
                placeholder="Заметка или грамматическая форма"
                className="w-full rounded-[22px] border border-line bg-black/10 px-4 py-3 outline-none transition placeholder:text-muted/80 focus:border-accent/40"
              />
            </div>
          </article>
        ))}
      </section>

      {error ? (
        <div className="rounded-[24px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-[28px] bg-accent px-5 py-4 text-sm font-semibold text-slate-950 shadow-glow disabled:opacity-60"
      >
        {isPending ? "Сохраняю..." : mode === "edit" ? "Сохранить изменения" : "Создать набор"}
      </button>
    </div>
  );
}
