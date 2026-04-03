export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "phrase"
  | "expression"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "determiner"
  | "numeral"
  | "interjection";

export type SetTone = "teal" | "amber" | "rose" | "indigo" | "emerald" | "sky";

export type StudyMode = "flashcards" | "learn" | "write";

export type ReviewResult = "known" | "unknown" | "write-correct" | "write-wrong";

export type CardRecord = {
  id: string;
  term: string;
  translation: string;
  example: string;
  note: string;
  partOfSpeech: PartOfSpeech;
  createdAt: string;
  updatedAt: string;
};

export type StudySet = {
  id: string;
  title: string;
  description: string;
  color: SetTone;
  createdAt: string;
  updatedAt: string;
  cards: CardRecord[];
};

export type CardProgress = {
  cardId: string;
  setId: string;
  dueAt: string;
  intervalDays: number;
  ease: number;
  streak: number;
  knownCount: number;
  unknownCount: number;
  mastered: boolean;
  lastReviewedAt: string | null;
  lastResult: ReviewResult | null;
};

export type ReviewLog = {
  id: string;
  cardId: string;
  setId: string;
  mode: StudyMode;
  result: ReviewResult;
  reviewedAt: string;
};

export type MetaRecord = {
  key: string;
  value: string;
};

export type CardDraft = {
  id?: string;
  term: string;
  translation: string;
  example: string;
  note: string;
  partOfSpeech: PartOfSpeech;
};

export type SaveSetInput = {
  title: string;
  description: string;
  color: SetTone;
  cards: CardDraft[];
};

export type SetStats = {
  total: number;
  mastered: number;
  due: number;
  difficult: number;
  accuracy: number;
  reviewsToday: number;
  lastReviewedAt: string | null;
};

export type AppStats = {
  totalSets: number;
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  reviewsToday: number;
  xp: number;
  level: number;
};
