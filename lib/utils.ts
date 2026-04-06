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
    hero: "from-teal-300/18 via-teal-400/8 to-transparent",
    pill: "bg-teal-400/12 text-teal-200 border-teal-300/20",
    dot: "bg-teal-300"
  },
  amber: {
    hero: "from-amber-300/18 via-amber-400/8 to-transparent",
    pill: "bg-amber-400/12 text-amber-200 border-amber-300/20",
    dot: "bg-amber-300"
  },
  rose: {
    hero: "from-rose-300/18 via-rose-400/8 to-transparent",
    pill: "bg-rose-400/12 text-rose-200 border-rose-300/20",
    dot: "bg-rose-300"
  },
  indigo: {
    hero: "from-indigo-300/18 via-indigo-400/8 to-transparent",
    pill: "bg-indigo-400/12 text-indigo-200 border-indigo-300/20",
    dot: "bg-indigo-300"
  },
  emerald: {
    hero: "from-emerald-300/18 via-emerald-400/8 to-transparent",
    pill: "bg-emerald-400/12 text-emerald-200 border-emerald-300/20",
    dot: "bg-emerald-300"
  },
  sky: {
    hero: "from-sky-300/18 via-sky-400/8 to-transparent",
    pill: "bg-sky-400/12 text-sky-200 border-sky-300/20",
    dot: "bg-sky-300"
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
    "write-correct": "Верно",
    "write-wrong": "Ошибка"
  };

  return labels[result];
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
