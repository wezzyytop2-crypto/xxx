"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { CheckIcon, CloseIcon, VolumeIcon } from "@/components/icons";
import { speakRomanian } from "@/lib/speech";
import type { CardRecord } from "@/lib/types";
import { partOfSpeechLabel } from "@/lib/utils";

type SwipeStackProps = {
  cards: CardRecord[];
  busy: boolean;
  onResult: (result: "known" | "unknown") => Promise<void>;
};

export function SwipeStack({ cards, busy, onResult }: SwipeStackProps) {
  const current = cards[0];
  const trailingCards = cards.slice(1, 3);
  const startXRef = useRef<number | null>(null);
  const movedRef = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const positive = Math.min(Math.max(dragX / 140, 0), 1);
  const negative = Math.min(Math.max(-dragX / 140, 0), 1);

  useEffect(() => {
    setFlipped(false);
    setDragX(0);
    startXRef.current = null;
    movedRef.current = false;
  }, [current?.id]);

  if (!current) {
    return null;
  }

  async function commitResult(result: "known" | "unknown") {
    setDragX(result === "known" ? 440 : -440);
    await new Promise((resolve) => setTimeout(resolve, 110));
    await onResult(result);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (busy) {
      return;
    }

    startXRef.current = event.clientX;
    movedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (startXRef.current === null || busy) {
      return;
    }

    const nextOffset = event.clientX - startXRef.current;

    if (Math.abs(nextOffset) > 4) {
      movedRef.current = true;
    }

    setDragX(nextOffset);
  }

  function handlePointerUp() {
    if (startXRef.current === null || busy) {
      return;
    }

    const offset = dragX;
    startXRef.current = null;

    if (!movedRef.current || Math.abs(offset) < 8) {
      setDragX(0);
      setFlipped((previous) => !previous);
      return;
    }

    if (Math.abs(offset) >= 90) {
      void commitResult(offset > 0 ? "known" : "unknown");
      return;
    }

    setDragX(0);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-line bg-panel/70 px-4 py-3 text-center text-xs leading-5 text-muted">
        Свайп вправо, если знаешь слово. Влево, если нужен повтор. Тап по карточке показывает перевод.
      </div>

      <div className="relative mx-auto h-[430px] w-full perspective">
        {trailingCards
          .slice()
          .reverse()
          .map((card, index) => (
            <div
              key={card.id}
              className="glass-panel absolute inset-x-4 top-0 rounded-[32px] shadow-card"
              style={{
                height: "100%",
                transform: `translateY(${14 + index * 12}px) scale(${0.96 - index * 0.03})`,
                opacity: 0.55 - index * 0.15
              }}
            />
          ))}

        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 touch-none select-none"
        >
          <div
            className="absolute inset-0 rounded-[32px] transition-transform duration-300 preserve-3d"
            style={{
              transform: `translateX(${dragX}px) rotate(${dragX / 24}deg) rotateY(${flipped ? 180 : 0}deg)`,
              transitionDuration: busy ? "420ms" : "240ms"
            }}
          >
            <div className="glass-panel absolute inset-0 flex flex-col justify-between rounded-[32px] p-6 shadow-card backface-hidden">
              <div
                className="pointer-events-none absolute inset-0 rounded-[32px] transition-opacity"
                style={{
                  background: "linear-gradient(140deg, rgba(94, 230, 168, 0.22), transparent 60%)",
                  opacity: positive
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-[32px] transition-opacity"
                style={{
                  background: "linear-gradient(220deg, rgba(255, 130, 152, 0.22), transparent 60%)",
                  opacity: negative
                }}
              />
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full border border-line bg-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-accent">
                  Română
                </span>
                <button
                  type="button"
                  onClick={() => speakRomanian(current.term)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/5 text-text"
                >
                  <VolumeIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-center">
                <p className="text-3xl font-semibold text-balance text-text">{current.term}</p>
                <p className="text-sm leading-6 text-muted">{partOfSpeechLabel(current.partOfSpeech)}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted">
                <span>Тапни, чтобы увидеть перевод</span>
                <span>{cards.length} в очереди</span>
              </div>
            </div>

            <div
              className="glass-panel absolute inset-0 flex flex-col justify-between rounded-[32px] p-6 shadow-card backface-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full border border-line bg-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-warning">
                  Перевод
                </span>
                <button
                  type="button"
                  onClick={() => speakRomanian(current.term)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/5 text-text"
                >
                  <VolumeIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1 text-center">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted">Значение</p>
                  <p className="text-3xl font-semibold text-balance text-text">{current.translation}</p>
                </div>

                <div className="rounded-[28px] border border-line bg-black/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Пример</p>
                  <p className="mt-2 text-sm leading-6 text-text">{current.example || "Добавь пример в наборе, чтобы закреплять контекст."}</p>
                </div>

                {current.note ? (
                  <div className="rounded-[24px] border border-line bg-black/10 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">Заметка</p>
                    <p className="mt-2 text-sm leading-6 text-text">{current.note}</p>
                  </div>
                ) : null}
              </div>

              <p className="text-center text-xs text-muted">Смахни карточку или используй большие кнопки ниже</p>
            </div>
          </div>

          <div
            className="pointer-events-none absolute left-5 top-5 rounded-full border border-success/40 bg-success/12 px-3 py-1 text-xs font-semibold text-success transition"
            style={{ opacity: dragX > 16 ? Math.min(1, dragX / 90) : 0 }}
          >
            Знаю
          </div>
          <div
            className="pointer-events-none absolute right-5 top-5 rounded-full border border-danger/40 bg-danger/12 px-3 py-1 text-xs font-semibold text-danger transition"
            style={{ opacity: dragX < -16 ? Math.min(1, Math.abs(dragX) / 90) : 0 }}
          >
            Повторить
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => void commitResult("unknown")}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-[26px] border border-danger/30 bg-danger/12 px-4 py-4 text-sm font-semibold text-danger disabled:opacity-60"
        >
          <CloseIcon className="h-5 w-5" />
          Не знаю
        </button>
        <button
          type="button"
          onClick={() => void commitResult("known")}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-[26px] bg-accent px-4 py-4 text-sm font-semibold text-slate-950 shadow-glow disabled:opacity-60"
        >
          <CheckIcon className="h-5 w-5" />
          Знаю
        </button>
      </div>
    </div>
  );
}
