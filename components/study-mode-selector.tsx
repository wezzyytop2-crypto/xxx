"use client";

import Link from "next/link";
import type { StudySet } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  StarIcon,
  PenIcon,
  BookIcon,
  BrainIcon,
  VolumeIcon,
  ChevronRightIcon
} from "@/components/icons";

type StudyModeSelectorProps = {
  set: StudySet;
};

export function StudyModeSelector({ set }: StudyModeSelectorProps) {
  const modes = [
    {
      key: "focus",
      label: "Умный повтор",
      description: "Приоритет на важные карточки",
      icon: StarIcon,
      shortcut: "f",
      color: "text-accent"
    },
    {
      key: "flashcards",
      label: "Свайп карточек",
      description: "Классический режим с быстрым неносом",
      icon: BookIcon,
      shortcut: "c",
      color: "text-amber-500"
    },
    {
      key: "write",
      label: "Письмо",
      description: "Ручной ввод слов для практики",
      icon: PenIcon,
      shortcut: "w",
      color: "text-sky-500"
    },
    {
      key: "quiz",
      label: "Тест",
      description: "Вариантные тесты и заполнение пробелов",
      icon: BrainIcon,
      shortcut: "q",
      color: "text-emerald-500"
    },
    {
      key: "listen",
      label: "Аудирование",
      description: "Слушай и повторяй с произношением",
      icon: VolumeIcon,
      shortcut: "l",
      color: "text-rose-500"
    }
  ];

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <Link
            key={mode.key}
            href={`/sets/${set.id}/study?mode=${mode.key}`}
            className={cn(
              "surface-card group relative flex flex-col justify-between rounded-[28px] p-4 transition hover:bg-white/5"
            )}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className={cn("icon-chip h-10 w-10", mode.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                  {mode.shortcut}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-text">{mode.label}</h3>
              <p className="mt-1 text-sm leading-5 text-muted">{mode.description}</p>
            </div>
            <div className="mt-3 flex items-center justify-end">
              <span className="icon-chip h-9 w-9 text-muted group-hover/group:text-accent transition">
                <ChevronRightIcon className="h-5 w-5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
