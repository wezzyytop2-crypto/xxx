import { type PartOfSpeech, type ReviewLog, type ReviewResult, type SetTone } from "@/lib/types";

export const toneOptions: Array<{ value: SetTone; label: string }> = [
  { value: "teal", label: "Teal" },
  { value: "amber", label: "Amber" },
  { value: "rose", label: "Rose" },
  { value: "indigo", label: "Indigo" },
  { value: "emerald", label: "Emerald" },
  { value: "sky", label: "Sky" }
];

export const partOfSpeechOptions: Array<{ value: PartOfSpeech; label: string }> = [
  { value: "noun", label: "Существительное" },
  { value: "verb", label: "Глагол" },
  { value: "adjective", label: "Прилагательное" },
  { value: "adverb", label: "Наречие" },
  { value: "pronoun", label: "Местоимение" },
  { value: "preposition", label: "Предлог" },
  { value: "conjunction", label: "Союз" },
  { value: "determiner", label: "Определитель" },
  { value: "numeral", label: "Числительное" },
  { value: "interjection", label: "Междометие" },
  { value: "phrase", label: "Фраза" },
  { value: "expression", label: "Выражение" }
];

export const toneStyles: Record<
  SetTone,
  {
    hero: string;
    pill: string;
    dot: string;
  }
> = {
  teal: {
    hero: "from-teal-400/18 via-teal-300/10 to-white/25",
    pill: "bg-teal-500/10 text-teal-950 border-teal-600/20",
    dot: "bg-teal-600"
  },
  amber: {
    hero: "from-amber-400/18 via-amber-300/10 to-white/25",
    pill: "bg-amber-500/12 text-amber-950 border-amber-600/20",
    dot: "bg-amber-600"
  },
  rose: {
    hero: "from-rose-400/18 via-rose-300/10 to-white/25",
    pill: "bg-rose-500/10 text-rose-950 border-rose-600/20",
    dot: "bg-rose-600"
  },
  indigo: {
    hero: "from-indigo-400/18 via-indigo-300/10 to-white/25",
    pill: "bg-indigo-500/10 text-indigo-950 border-indigo-600/20",
    dot: "bg-indigo-600"
  },
  emerald: {
    hero: "from-emerald-400/18 via-emerald-300/10 to-white/25",
    pill: "bg-emerald-500/10 text-emerald-950 border-emerald-600/20",
    dot: "bg-emerald-600"
  },
  sky: {
    hero: "from-sky-400/18 via-sky-300/10 to-white/25",
    pill: "bg-sky-500/10 text-sky-950 border-sky-600/20",
    dot: "bg-sky-600"
  }
};

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function createId(prefix = "id") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Ещё не было";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "Пока пусто";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function relativeTimeFromNow(value: string | null) {
  if (!value) {
    return "Без повторений";
  }

  const diff = new Date(value).getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);

  if (days <= 0) {
    return "Сегодня";
  }

  if (days === 1) {
    return "Завтра";
  }

  if (days < 7) {
    return `Через ${days} дн.`;
  }

  return `Через ${Math.round(days / 7)} нед.`;
}

export function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitAlternatives(value: string) {
  return value
    .split(/[;,/|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isCorrectTranslation(answer: string, translation: string) {
  const normalizedAnswer = normalizeAnswer(answer);
  const variants = splitAlternatives(translation).map(normalizeAnswer);

  if (!normalizedAnswer) {
    return false;
  }

  return variants.some((variant) => variant === normalizedAnswer);
}

export function labelForReviewResult(result: ReviewResult) {
  const labels: Record<ReviewResult, string> = {
    known: "Знаю",
    unknown: "Повторить",
    "write-correct": "Верно (письмо)",
    "write-wrong": "Ошибка (письмо)",
    "quiz-correct": "Верно (квиз)",
    "quiz-wrong": "Ошибка (квиз)"
  };

  return labels[result] || "Неизвестно";
}

/**
 * Type guard для проверки, является ли значение валидным PartOfSpeech
 */
export function isValidPartOfSpeech(value: unknown): value is PartOfSpeech {
  const validParts: PartOfSpeech[] = [
    "noun",
    "verb",
    "adjective",
    "adverb",
    "phrase",
    "expression",
    "pronoun",
    "preposition",
    "conjunction",
    "determiner",
    "numeral",
    "interjection"
  ];
  return typeof value === "string" && (validParts as string[]).includes(value);
}

export function partOfSpeechLabel(value: PartOfSpeech) {
  const labels: Record<PartOfSpeech, string> = {
    noun: "Существительное",
    verb: "Глагол",
    adjective: "Прилагательное",
    adverb: "Наречие",
    pronoun: "Местоимение",
    preposition: "Предлог",
    conjunction: "Союз",
    determiner: "Определитель",
    numeral: "Числительное",
    interjection: "Междометие",
    phrase: "Фраза",
    expression: "Выражение"
  };

  return labels[value];
}

export function isToday(value: string) {
  const now = new Date();
  const date = new Date(value);

  return (
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate()
  );
}

export function countReviewsToday(reviews: ReviewLog[]) {
  return reviews.filter((item) => isToday(item.reviewedAt)).length;
}

export function asDraftDefaults() {
  return {
    term: "",
    translation: "",
    example: "",
    note: "",
    partOfSpeech: "noun" as const
  };
}
