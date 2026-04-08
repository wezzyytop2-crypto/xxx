"use client";

import { useState } from "react";
import { VolumeIcon } from "@/components/icons";
import { useSpeech } from "@/lib/hooks/useSpeech";
import type { DictionaryEntry } from "@/lib/types";
import { cn, partOfSpeechLabel } from "@/lib/utils";

interface DictionaryCardProps {
  entry: DictionaryEntry;
  direction: "ro-ru" | "ru-ro";
  onSelectWord?: (romanian: string) => void;
}

export function DictionaryCard({ entry, direction, onSelectWord }: DictionaryCardProps) {
  const [showExamples, setShowExamples] = useState(false);
  const { speak, speaking } = useSpeech();

  const sourceWord = direction === "ro-ru" ? entry.romanian : entry.russian;
  const targetWord = direction === "ro-ru" ? entry.russian : entry.romanian;

  const handleSpeak = async () => {
    try {
      await speak(entry.romanian);
    } catch (error) {
      console.error("Speech error:", error);
    }
  };

  return (
    <article className="glass-panel rounded-[32px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-accent/20 bg-accentSoft px-2.5 py-1 text-[11px] font-semibold text-accent">
              {partOfSpeechLabel(entry.partOfSpeech)}
            </span>
            {entry.frequency ? (
              <span className="rounded-full border border-spot/20 bg-spotSoft px-2.5 py-1 text-[11px] font-semibold text-spot">
                Частотность {entry.frequency}/5
              </span>
            ) : null}
          </div>

          <h3 className="mt-4 text-[2rem] font-semibold leading-none text-text">{sourceWord}</h3>
          {entry.ipa ? <p className="mt-2 text-sm font-mono tracking-wide text-muted">/{entry.ipa}/</p> : null}
        </div>

        {direction === "ro-ru" ? (
          <button
            type="button"
            onClick={handleSpeak}
            disabled={speaking}
            className="icon-chip h-11 w-11 shrink-0 text-text transition hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Произнести слово"
          >
            <VolumeIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="mt-5 rounded-[26px] border border-accent/18 bg-accentSoft px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Перевод</p>
        <p className="mt-2 text-2xl font-semibold leading-tight text-text">{targetWord}</p>
      </div>

      {entry.gender ? (
        <p className="mt-4 text-sm text-muted">
          Род: <span className="font-medium text-text">{genderLabel(entry.gender)}</span>
        </p>
      ) : null}

      {entry.examples && entry.examples.length > 0 ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowExamples((value) => !value)}
            className="secondary-action rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text"
          >
            {showExamples ? "Скрыть примеры" : `Показать примеры · ${entry.examples.length}`}
          </button>

          {showExamples ? (
            <div className="mt-3 space-y-2">
              {entry.examples.map((example, index) => (
                <div key={index} className="surface-card rounded-[22px] p-3">
                  <p className="text-sm italic text-text">{example.romanian}</p>
                  <p className="mt-1 text-sm text-muted">{example.russian}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {entry.synonyms && entry.synonyms.length > 0 ? (
        <div className="mt-5">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Синонимы</p>
          <div className="flex flex-wrap gap-2">
            {entry.synonyms.map((synonym, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectWord?.(synonym)}
                className={cn(
                  "rounded-full border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success transition",
                  "hover:bg-success/15"
                )}
              >
                {synonym}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {direction === "ro-ru" ? (
        <button
          type="button"
          onClick={handleSpeak}
          disabled={speaking}
          className="primary-action mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[26px] px-4 py-3.5 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          <VolumeIcon className="h-4 w-4" />
          {speaking ? "Воспроизведение..." : "Произнести"}
        </button>
      ) : null}
    </article>
  );
}

function genderLabel(gender: "m" | "f" | "n"): string {
  const labels = {
    m: "Мужской",
    f: "Женский",
    n: "Средний"
  };

  return labels[gender];
}
