"use client";

import { useEffect, useState } from "react";
import { CheckIcon, VolumeIcon } from "@/components/icons";
import { speakRomanian } from "@/lib/speech";
import { isCorrectTranslation } from "@/lib/utils";
import type { CardRecord, ReviewResult } from "@/lib/types";

type WriteSessionProps = {
  cards: CardRecord[];
  busy: boolean;
  onAdvance: (result: ReviewResult) => Promise<void>;
};

export function WriteSession({ cards, busy, onAdvance }: WriteSessionProps) {
  const current = cards[0];
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<ReviewResult | null>(null);

  useEffect(() => {
    setAnswer("");
    setResult(null);
  }, [current?.id]);

  if (!current) {
    return null;
  }

  function checkAnswer() {
    // Проверяем румынское слово (вместо перевода)
    const correct = isCorrectTranslation(answer, current.term);
    setResult(correct ? "write-correct" : "write-wrong");
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-[32px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">Write</p>
            <h2 className="mt-2 text-3xl font-semibold text-text">{current.translation}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Напиши румынское слово. Можно использовать один из вариантов через запятую.
            </p>
          </div>
          <button
            type="button"
            onClick={() => speakRomanian(current.term)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/5 text-text"
          >
            <VolumeIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <label className="block text-sm text-muted" htmlFor="answer">
            Введи румынское слово
          </label>
          <input
            id="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            placeholder="Напиши слово..."
            className="w-full rounded-[24px] border border-line bg-black/10 px-4 py-4 text-base text-text outline-none transition placeholder:text-muted/80 focus:border-accent/40"
          />
        </div>

        {result ? (
          <div
            className={`mt-4 rounded-[28px] border p-4 ${
              result === "write-correct"
                ? "border-success/30 bg-success/10 text-success"
                : "border-danger/30 bg-danger/10 text-danger"
            }`}
          >
            <p className="text-sm font-semibold">{result === "write-correct" ? "Верно" : "Нужно закрепить"}</p>
            <p className="mt-2 text-sm leading-6 text-text">Правильный вариант: {current.term}</p>
            {current.example ? <p className="mt-2 text-sm leading-6 text-muted">{current.example}</p> : null}
            {current.note ? <p className="mt-2 text-sm leading-6 text-muted">{current.note}</p> : null}
          </div>
        ) : null}
      </div>

      {result ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onAdvance(result)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[26px] bg-accent px-4 py-4 text-sm font-semibold text-slate-950 shadow-glow disabled:opacity-60"
        >
          <CheckIcon className="h-5 w-5" />
          Следующее слово
        </button>
      ) : (
        <button
          type="button"
          disabled={busy || answer.trim().length === 0}
          onClick={checkAnswer}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[26px] bg-accent px-4 py-4 text-sm font-semibold text-slate-950 shadow-glow disabled:opacity-60"
        >
          Проверить
        </button>
      )}
    </div>
  );
}
