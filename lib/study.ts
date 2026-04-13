import type { AppStats, CardProgress, CardRecord, ReviewLog, ReviewResult, SetStats, StudyMode, StudySet } from "@/lib/types";
import { countReviewsToday, isToday } from "@/lib/utils";

export function isStudyMode(value: string | undefined): value is StudyMode {
  return value === "focus" || value === "flashcards" || value === "learn" || value === "write";
}

export function isCorrectResult(result: ReviewResult) {
  return result === "known" || result === "write-correct";
}

export function createInitialProgress(cardId: string, setId: string): CardProgress {
  return {
    cardId,
    setId,
    dueAt: new Date(0).toISOString(),
    intervalDays: 0,
    ease: 2.2,
    streak: 0,
    knownCount: 0,
    unknownCount: 0,
    mastered: false,
    lastReviewedAt: null,
    lastResult: null
  };
}

export function isCardDue(progress: CardProgress | undefined) {
  if (!progress) {
    return true;
  }

  return new Date(progress.dueAt).getTime() <= Date.now();
}

export function evolveProgress(current: CardProgress, result: ReviewResult, now = new Date()) {
  const correct = isCorrectResult(result);
  const next: CardProgress = {
    ...current,
    lastResult: result,
    lastReviewedAt: now.toISOString()
  };

  if (correct) {
    const nextEase = Math.min(3.2, current.ease + 0.12);
    const baseInterval = current.intervalDays === 0 ? 1 : current.intervalDays;
    const nextInterval = Math.max(1, Math.round(baseInterval * nextEase));

    next.ease = nextEase;
    next.intervalDays = nextInterval;
    next.streak = current.streak + 1;
    next.knownCount = current.knownCount + 1;
    next.mastered = next.streak >= 3 || next.intervalDays >= 7;
    next.dueAt = new Date(now.getTime() + nextInterval * 86_400_000).toISOString();

    return next;
  }

  next.ease = Math.max(1.35, current.ease - 0.18);
  next.intervalDays = 0;
  next.streak = 0;
  next.unknownCount = current.unknownCount + 1;
  next.mastered = false;
  next.dueAt = now.toISOString();

  return next;
}

function priorityForCard(card: CardRecord, progressMap: Record<string, CardProgress>, mode: StudyMode) {
  const progress = progressMap[card.id];
  const due = isCardDue(progress);
  const missed = progress?.unknownCount ?? 0;
  const known = progress?.knownCount ?? 0;
  const streak = progress?.streak ?? 0;
  const interval = progress?.intervalDays ?? 0;
  const unresolved = !progress?.mastered ? 18 : 0;
  const dueWeight = due ? 45 : 0;
  const learnBias = mode === "learn" ? 22 : 0;
  const writeBias = mode === "write" ? 8 : 0;

  return dueWeight + unresolved + learnBias + writeBias + missed * 14 - known * 4 - streak * 3 - interval;
}

function isWeakProgress(progress: CardProgress | undefined) {
  if (!progress) {
    return true;
  }

  return (
    progress.unknownCount > progress.knownCount ||
    progress.lastResult === "unknown" ||
    progress.lastResult === "write-wrong"
  );
}

function focusScore(card: CardRecord, progressMap: Record<string, CardProgress>) {
  const progress = progressMap[card.id];
  const due = isCardDue(progress);
  const weak = isWeakProgress(progress);
  const recentWrong = progress?.lastResult === "unknown" || progress?.lastResult === "write-wrong";
  const newCard = !progress;
  const streak = progress?.streak ?? 0;
  const interval = progress?.intervalDays ?? 0;
  const masteredPenalty = progress?.mastered ? 18 : 0;

  return (
    10 +
    (due ? 55 : 0) +
    (weak ? 36 : 0) +
    (recentWrong ? 18 : 0) +
    (newCard ? 22 : 0) -
    masteredPenalty -
    streak * 3 -
    interval
  );
}

export function buildStudyQueue(cards: CardRecord[], progressMap: Record<string, CardProgress>, mode: StudyMode) {
  const scored = cards
    .map((card) => ({
      card,
      progress: progressMap[card.id],
      score: mode === "focus" ? focusScore(card, progressMap) : priorityForCard(card, progressMap, mode)
    }))
    .sort((left, right) => right.score - left.score);

  if (mode === "focus") {
    const focused = scored.filter((item) => isCardDue(item.progress) || isWeakProgress(item.progress));
    const pool = focused.length >= 4 ? focused : scored;
    return pool.map((item) => item.card);
  }

  if (mode === "learn") {
    const focused = scored.filter(
      (item) =>
        !item.progress?.mastered ||
        isCardDue(item.progress) ||
        (item.progress?.unknownCount ?? 0) > (item.progress?.knownCount ?? 0)
    );

    return (focused.length ? focused : scored).map((item) => item.card);
  }

  return scored.map((item) => item.card);
}

export function getSetStats(set: StudySet, progressMap: Record<string, CardProgress>, reviews: ReviewLog[]): SetStats {
  const setReviews = reviews.filter((item) => item.setId === set.id);
  const total = set.cards.length;
  const mastered = set.cards.filter((card) => progressMap[card.id]?.mastered).length;
  const due = set.cards.filter((card) => isCardDue(progressMap[card.id])).length;
  const difficult = set.cards.filter((card) => {
    const progress = progressMap[card.id];

    if (!progress) {
      return true;
    }

    return progress.unknownCount > progress.knownCount || progress.lastResult === "unknown" || progress.lastResult === "write-wrong";
  }).length;
  const correctReviews = setReviews.filter((item) => isCorrectResult(item.result)).length;
  const accuracy = setReviews.length === 0 ? 0 : (correctReviews / setReviews.length) * 100;

  return {
    total,
    mastered,
    due,
    difficult,
    accuracy,
    reviewsToday: setReviews.filter((item) => isToday(item.reviewedAt)).length,
    lastReviewedAt: setReviews[0]?.reviewedAt ?? null
  };
}

export function getAppStats(sets: StudySet[], progressMap: Record<string, CardProgress>, reviews: ReviewLog[]): AppStats {
  const totalCards = sets.reduce((sum, set) => sum + set.cards.length, 0);
  const masteredCards = sets.reduce(
    (sum, set) => sum + set.cards.filter((card) => progressMap[card.id]?.mastered).length,
    0
  );
  const dueCards = sets.reduce((sum, set) => sum + set.cards.filter((card) => isCardDue(progressMap[card.id])).length, 0);

  const xp = reviews.length * 10; // 10 XP per review
  const level = Math.floor(xp / 100) + 1;

  return {
    totalSets: sets.length,
    totalCards,
    dueCards,
    masteredCards,
    reviewsToday: countReviewsToday(reviews),
    xp,
    level
  };
}

export function repeatCardLater(queue: CardRecord[], card: CardRecord, result: ReviewResult, mode: StudyMode) {
  const rest = queue.slice(1);

  if (mode === "flashcards" && !isCorrectResult(result)) {
    return [...rest, card];
  }

  if ((mode === "learn" || mode === "focus") && !isCorrectResult(result)) {
    const insertAt = Math.min(2, rest.length);
    const prefix = rest.slice(0, insertAt);
    const suffix = rest.slice(insertAt);

    return [...prefix, card, ...suffix];
  }

  return rest;
}
