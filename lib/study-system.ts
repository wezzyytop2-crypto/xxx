import type { CardProgress, StudySet, CardRecord, ReviewResult } from "@/lib/types";

// SM-2 Algorithm implementation for spaced repetition
export type SM2State = {
  easiness: number; // EF (ease factor)
  interval: number; // interval in days
  repetition: number; // number of repetitions
  nextReview: string; // ISO date string
};

export function calculateSM2NextReview(
  quality: number, // 0-5, where 5 is perfect
  currentState: SM2State
): SM2State {
  // Quality: 0 = complete blackout, 1 = incorrect but close, 2 = incorrect, 3 = correct with hesitation,
  // 4 = correct but required effort, 5 = correct and fast

  let { easiness, interval, repetition } = currentState;

  // Calculate new easiness factor
  let newEasiness = easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  if (newEasiness < 1.3) {
    newEasiness = 1.3;
  }

  let newInterval = interval;
  let newRepetition = repetition;

  if (quality < 3) {
    // Incorrect answer - restart from first interval
    newInterval = 1;
    newRepetition = 0;
  } else {
    // Correct answer - advance
    newRepetition = repetition + 1;

    if (newRepetition === 1) {
      newInterval = 1;
    } else if (newRepetition === 2) {
      newInterval = 3;
    } else {
      newInterval = Math.round(interval * newEasiness);
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    easiness: newEasiness,
    interval: newInterval,
    repetition: newRepetition,
    nextReview: nextReviewDate.toISOString()
  };
}

export function createInitialSM2State(): SM2State {
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + 1);

  return {
    easiness: 2.5,
    interval: 0,
    repetition: 0,
    nextReview: nextReview.toISOString()
  };
}

// Study session types
export type StudySessionCard = CardRecord & {
  progress: CardProgress;
};

export type StudySession = {
  id: string;
  setId: string;
  mode: "focus" | "learn" | "write" | "quiz" | "listen";
  cards: StudySessionCard[];
  currentIndex: number;
  startedAt: string;
  completedAt?: string;
};

export function createStudySession(
  set: StudySet,
  cards: StudySessionCard[],
  mode: "focus" | "learn" | "write" | "quiz" | "listen"
): StudySession {
  return {
    id: `session-${Date.now()}`,
    setId: set.id,
    mode,
    cards: cards.slice(0, Math.max(cards.length, 20)), // Max 20 cards per session
    currentIndex: 0,
    startedAt: new Date().toISOString()
  };
}

export function getNextCard(session: StudySession): StudySessionCard | null {
  if (session.currentIndex >= session.cards.length) {
    return null;
  }

  return session.cards[session.currentIndex];
}

export function moveToNextCard(session: StudySession): StudySession {
  return {
    ...session,
    currentIndex: Math.min(session.currentIndex + 1, session.cards.length)
  };
}

export function isSessionComplete(session: StudySession): boolean {
  return session.currentIndex >= session.cards.length;
}

// Quiz question generation
export type QuizQuestion = {
  id: string;
  type: "multiple-choice" | "fill-in-blank" | "listening";
  question: string;
  options?: string[];
  correctAnswer: string;
  card: CardRecord;
};

export function generateMultipleChoiceQuestion(
  card: CardRecord,
  allCards: CardRecord[],
  questionType: "rumanian-to-russian" | "russian-to-rumanian" = "rumanian-to-russian"
): QuizQuestion {
  const wrongAnswers = allCards
    .filter((c) => c.id !== card.id)
    .map((c) => (questionType === "rumanian-to-russian" ? c.translation : c.term))
    .slice(0, 3);

  const correctAnswer = questionType === "rumanian-to-russian" ? card.translation : card.term;
  const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

  return {
    id: `quiz-${card.id}`,
    type: "multiple-choice",
    question:
      questionType === "rumanian-to-russian"
        ? `Как переводится слово "${card.term}"?`
        : `Какое румынское слово означает "${card.translation}"?`,
    options,
    correctAnswer,
    card
  };
}

export function generateFillInBlankQuestion(card: CardRecord): QuizQuestion {
  const example = card.example || "";
  const highlighted = example.replace(new RegExp(`\\b${card.term}\\b`, "gi"), "______");

  return {
    id: `fill-${card.id}`,
    type: "fill-in-blank",
    question: `Заповніть пропуск в реченні:\n"${highlighted}"`,
    correctAnswer: card.term,
    card
  };
}

// Review outcome mapping
export function mapQualityToResult(quality: number): ReviewResult {
  if (quality >= 4) {
    return "known";
  } else if (quality >= 3) {
    return "unknown"; // Uncertain
  } else {
    return "unknown"; // Wrong
  }
}

// Difficulty calculation based on stats
export type CardDifficulty = "easy" | "medium" | "hard";

export function calculateCardDifficulty(progress: CardProgress): CardDifficulty {
  const correctCount = progress.knownCount;
  const totalCount = progress.knownCount + progress.unknownCount;

  if (totalCount === 0) {
    return "medium";
  }

  const correctRatio = correctCount / totalCount;

  if (correctRatio >= 0.8) {
    return "easy";
  } else if (correctRatio >= 0.5) {
    return "medium";
  } else {
    return "hard";
  }
}

// Priority queue for study sessions
export type StudyPriority = {
  card: StudySessionCard;
  priority: number; // Higher = more urgent
};

export function calculateCardPriority(
  card: StudySessionCard,
  now: Date = new Date()
): number {
  const { progress } = card;
  const dueDate = new Date(progress.dueAt);
  const dayOverdue = Math.max(0, (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

  const difficulty = calculateCardDifficulty(progress);
  let difficultyMultiplier = 1;

  if (difficulty === "hard") {
    difficultyMultiplier = 3;
  } else if (difficulty === "medium") {
    difficultyMultiplier = 1.5;
  }

  const streakBonus = Math.max(0, progress.streak - 1) * 0.1;

  return (1 + dayOverdue) * difficultyMultiplier + streakBonus;
}

export function sortCardsByPriority(
  cards: StudySessionCard[],
  now?: Date
): StudySessionCard[] {
  return [...cards].sort((a, b) => calculateCardPriority(b, now) - calculateCardPriority(a, now));
}

// Session filtering
export function filterDueCards(cards: StudySessionCard[], now: Date = new Date()): StudySessionCard[] {
  return cards.filter((c) => new Date(c.progress.dueAt).getTime() <= now.getTime());
}

export function filterWeakCards(cards: StudySessionCard[]): StudySessionCard[] {
  return cards.filter((c) => {
    const correctCount = c.progress.knownCount;
    const totalCount = c.progress.knownCount + c.progress.unknownCount;

    if (totalCount === 0) {
      return false;
    }

    const correctRatio = correctCount / totalCount;
    return correctRatio < 0.6; // Less than 60% correct
  });
}

export function filterNewCards(cards: StudySessionCard[]): StudySessionCard[] {
  return cards.filter((c) => c.progress.knownCount + c.progress.unknownCount === 0);
}

export function filterMasteredCards(cards: StudySessionCard[]): StudySessionCard[] {
  return cards.filter((c) => c.progress.mastered);
}

// Session stats
export type SessionStats = {
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  timeSpent: number; // in seconds
};

export function calculateSessionStats(
  session: StudySession,
  results: Array<{ cardId: string; result: ReviewResult }>
): SessionStats {
  const endTime = new Date().getTime();
  const startTime = new Date(session.startedAt).getTime();
  const timeSpent = Math.round((endTime - startTime) / 1000);

  const totalCards = results.length;
  const correctCount = results.filter(
    (r) => r.result === "known" || r.result === "write-correct" || r.result === "quiz-correct"
  ).length;
  const incorrectCount = totalCards - correctCount;
  const accuracy = totalCards === 0 ? 0 : correctCount / totalCards;

  return {
    totalCards,
    correctCount,
    incorrectCount,
    accuracy,
    timeSpent
  };
}

// XP and leveling
export const XP_PER_CORRECT = 10;
export const XP_PER_LEVEL = 100;

export function calculateXPForResult(result: ReviewResult): number {
  const isCorrect = result === "known" || result === "write-correct" || result === "quiz-correct";
  return isCorrect ? XP_PER_CORRECT : 0;
}

export function getLevelFromXP(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

export function getXPForNextLevel(totalXP: number): number {
  const currentLevel = getLevelFromXP(totalXP);
  const xpForCurrentLevel = (currentLevel - 1) * XP_PER_LEVEL;
  const xpForNextLevel = currentLevel * XP_PER_LEVEL;
  return xpForNextLevel - totalXP;
}
