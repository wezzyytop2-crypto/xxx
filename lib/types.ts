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

export type StudyMode = "focus" | "flashcards" | "learn" | "write" | "quiz";

export type QuizType = "multiple-choice" | "fill-in-blank" | "listening" | "translate";

export type ReviewResult = "known" | "unknown" | "write-correct" | "write-wrong" | "quiz-correct" | "quiz-wrong";

export type GrammarMetadata = {
  gender?: "m" | "f" | "n";
  number?: "singular" | "plural";
  article?: string;
  grammarNote?: string;
  grammarRuleIds?: string[];
};

export type CardRecord = {
  id: string;
  term: string;
  translation: string;
  example: string;
  note: string;
  partOfSpeech: PartOfSpeech;
  createdAt: string;
  updatedAt: string;
  grammar?: GrammarMetadata;
  grammarRuleId?: string;
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

/**
 * Запись словаря румынско-русского
 */
export type DictionaryEntry = {
  id: string;
  romanian: string;
  russian: string;
  partOfSpeech: PartOfSpeech;
  gender?: 'm' | 'f' | 'n';
  ipa?: string; // Международная фонетическая транскрипция
  examples?: Array<{
    romanian: string;
    russian: string;
  }>;
  synonyms?: string[];
  antonyms?: string[];
  etymology?: string;
  frequency?: number; // 1-5, где 5 = очень частое слово
};

/**
 * Результат поиска перевода
 */
export type TranslationResult = {
  exact: DictionaryEntry[];
  partial: DictionaryEntry[];
  suggestions: string[];
};

/**
 * Направление перевода
 */
export type TranslationDirection = 'ro-ru' | 'ru-ro';

export type AuthUserId = "user1" | "user2";

export type AuthUser = {
  id: AuthUserId;
  username: string;
};

export type AuthSession = {
  userId: AuthUserId;
  authenticatedAt: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResult =
  | {
      success: true;
      user: AuthUser;
    }
  | {
      success: false;
      error: string;
    };
