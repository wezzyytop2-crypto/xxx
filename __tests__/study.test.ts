import {
  evolveProgress,
  buildStudyQueue,
  getSetStats,
  getAppStats,
  createInitialProgress
} from '@/lib/study';
import type { CardProgress, StudySet, ReviewLog, CardRecord } from '@/lib/types';

/**
 * Создаёт тестовый прогресс для карты
 */
function createTestProgress(
  cardId: string,
  setId: string,
  overrides?: Partial<CardProgress>
): CardProgress {
  return {
    cardId,
    setId,
    dueAt: new Date().toISOString(),
    intervalDays: 0,
    ease: 2.5,
    streak: 0,
    knownCount: 0,
    unknownCount: 0,
    mastered: false,
    lastReviewedAt: null,
    lastResult: null,
    ...overrides
  };
}

/**
 * Создаёт тестовый набор с N карточками
 */
function createTestSet(setId: string, cardCount: number): StudySet {
  const cards: CardRecord[] = Array.from({ length: cardCount }, (_, i) => ({
    id: `card-${i + 1}`,
    term: `Слово ${i + 1}`,
    translation: `Переводовано ${i + 1}`,
    example: `Пример ${i + 1}`,
    note: `Заметка ${i + 1}`,
    partOfSpeech: 'noun' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  return {
    id: setId,
    title: `Набор ${setId}`,
    description: 'Тестовый набор',
    color: 'teal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards
  };
}

describe('SM-2 Algorithm (evolveProgress)', () => {
  it('correct answer should increase interval', () => {
    const progress = createTestProgress('card-1', 'set-1', { intervalDays: 1, ease: 2.5, streak: 1 });
    const result = evolveProgress(progress, 'known');

    expect(result.intervalDays).toBeGreaterThan(1);
    expect(result.ease).toBeCloseTo(2.62, 1); // 2.5 + 0.12
    expect(result.streak).toBe(2);
  });

  it('wrong answer should reset interval and decrease ease', () => {
    const progress = createTestProgress('card-1', 'set-1', { intervalDays: 5, ease: 2.5, streak: 2 });
    const result = evolveProgress(progress, 'unknown');

    expect(result.intervalDays).toBe(0);
    expect(result.ease).toBeCloseTo(2.32, 1); // 2.5 - 0.18
    expect(result.streak).toBe(0);
  });

  it('ease should never go below 1.35', () => {
    const progress = createTestProgress('card-1', 'set-1', { ease: 1.4 });
    const result = evolveProgress(progress, 'unknown');

    expect(result.ease).toBeGreaterThanOrEqual(1.35);
  });

  it('ease should never exceed 3.2', () => {
    const progress = createTestProgress('card-1', 'set-1', { ease: 3.15 });
    const result = evolveProgress(progress, 'known');

    expect(result.ease).toBeLessThanOrEqual(3.2);
  });

  it('should mark card as mastered at streak 3', () => {
    let progress = createTestProgress('card-1', 'set-1', { streak: 2, intervalDays: 7 });

    // Правильный ответ на streak=2 → streak=3
    progress = evolveProgress(progress, 'known');

    expect(progress.mastered).toBe(true);
  });

  it('should mark card as mastered at interval 7 days', () => {
    const progress = createTestProgress('card-1', 'set-1', { streak: 1, intervalDays: 6 });
    const result = evolveProgress(progress, 'known');

    expect(result.mastered).toBe(true);
  });

  it('should increment known/unknown counters', () => {
    let progress = createTestProgress('card-1', 'set-1', { knownCount: 5, unknownCount: 2 });

    progress = evolveProgress(progress, 'known');
    expect(progress.knownCount).toBe(6);

    progress = evolveProgress(progress, 'unknown');
    expect(progress.unknownCount).toBe(3);
  });

  it('write-correct and write-wrong should behave like known/unknown', () => {
    let progress = createTestProgress('card-1', 'set-1', { knownCount: 0, unknownCount: 0 });

    progress = evolveProgress(progress, 'write-correct');
    expect(progress.knownCount).toBe(1);

    progress = evolveProgress(progress, 'write-wrong');
    expect(progress.unknownCount).toBe(1);
  });

  it('should set dueAt date correctly based on new interval', () => {
    const now = new Date('2026-04-03T00:00:00.000Z');
    const progress = createTestProgress('card-1', 'set-1', { intervalDays: 5, ease: 2.5, dueAt: now.toISOString() });
    const result = evolveProgress(progress, 'known', now);

    // With ease 2.5 + 0.12 = 2.62 and interval 5 * 2.62 = 13.1 ≈ 13 days
    const expectedTime = now.getTime() + (13 * 86_400_000);
    const dueTime = new Date(result.dueAt).getTime();

    // Allow 1 second tolerance for timing
    expect(Math.abs(dueTime - expectedTime)).toBeLessThan(1000);
  });

  it('should set dueAt to 1 day out for initial progress', () => {
    const now = new Date('2026-04-03T00:00:00.000Z');
    // First review: intervalDays = 0, ease = 2.2
    const progress = createTestProgress('card-1', 'set-1', { intervalDays: 0, ease: 2.2, dueAt: now.toISOString() });
    const result = evolveProgress(progress, 'known', now);

    // With ease 2.2 + 0.12 = 2.32 and interval 1 * 2.32 = 2.32 ≈ 2 days
    const expectedTime = now.getTime() + (2 * 86_400_000);
    const dueTime = new Date(result.dueAt).getTime();

    expect(Math.abs(dueTime - expectedTime)).toBeLessThan(1000);
  });

  it('should update lastReviewedAt and lastResult', () => {
    const progress = createTestProgress('card-1', 'set-1');
    const before = Date.now();
    const result = evolveProgress(progress, 'known');
    const after = Date.now();

    expect(result.lastResult).toBe('known');
    const reviewTime = new Date(result.lastReviewedAt!).getTime();
    expect(reviewTime).toBeGreaterThanOrEqual(before);
    expect(reviewTime).toBeLessThanOrEqual(after);
  });
});

describe('buildStudyQueue', () => {
  it('should prioritize due cards higher than non-due', () => {
    const set = createTestSet('set-1', 3);
    const now = Date.now();

    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1', { dueAt: new Date(now - 1000).toISOString() }),
      'card-2': createTestProgress('card-2', 'set-1', { dueAt: new Date(now + 1000000).toISOString() }),
      'card-3': createTestProgress('card-3', 'set-1', { dueAt: new Date(now - 2000).toISOString() })
    };

    const queue = buildStudyQueue(set.cards, progressByCard, 'flashcards');

    // Due cards (card-1, card-3) should be prioritized over non-due (card-2)
    const firstTwoIds = queue.slice(0, 2).map(c => c.id);
    expect(firstTwoIds).toContain('card-1');
    expect(firstTwoIds).toContain('card-3');
    expect(queue[2]?.id).toBe('card-2');
  });

  it('should prioritize difficult cards in learn mode', () => {
    const set = createTestSet('set-1', 2);
    const now = Date.now();

    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1', { unknownCount: 10, knownCount: 2, dueAt: new Date(now + 1000000).toISOString() }),
      'card-2': createTestProgress('card-2', 'set-1', { unknownCount: 1, knownCount: 10, dueAt: new Date(now + 1000000).toISOString() })
    };

    const queue = buildStudyQueue(set.cards, progressByCard, 'learn');

    // Difficult card (card-1) should be first
    expect(queue[0]?.id).toBe('card-1');
  });

  it('should return empty queue for empty set', () => {
    const set = createTestSet('set-1', 0);
    const queue = buildStudyQueue(set.cards, {}, 'flashcards');
    expect(queue).toEqual([]);
  });

  it('should exclude mastered cards from learn mode when not due or difficult', () => {
    const set = createTestSet('set-1', 2);
    const now = Date.now();

    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1', { mastered: true, dueAt: new Date(now + 1000000).toISOString() }),
      'card-2': createTestProgress('card-2', 'set-1', { mastered: false, dueAt: new Date(now + 1000000).toISOString() })
    };

    const queue = buildStudyQueue(set.cards, progressByCard, 'learn');

    // Mastered card-1 should be excluded, card-2 included
    expect(queue.length).toBe(1);
    expect(queue[0]?.id).toBe('card-2');
  });
});

describe('getSetStats', () => {
  it('should calculate correct totals', () => {
    const set = createTestSet('set-1', 3);
    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1'),
      'card-2': createTestProgress('card-2', 'set-1'),
      'card-3': createTestProgress('card-3', 'set-1')
    };

    const stats = getSetStats(set, progressByCard, []);

    expect(stats.total).toBe(3);
    expect(stats.mastered).toBe(0);
  });

  it('should count mastered cards', () => {
    const set = createTestSet('set-1', 3);
    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1', { mastered: true }),
      'card-2': createTestProgress('card-2', 'set-1', { mastered: false }),
      'card-3': createTestProgress('card-3', 'set-1', { mastered: true })
    };

    const stats = getSetStats(set, progressByCard, []);

    expect(stats.mastered).toBe(2);
  });

  it('should count due cards', () => {
    const set = createTestSet('set-1', 3);
    const now = Date.now();

    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1', { dueAt: new Date(now - 1000).toISOString() }),
      'card-2': createTestProgress('card-2', 'set-1', { dueAt: new Date(now + 1000).toISOString() }),
      'card-3': createTestProgress('card-3', 'set-1', { dueAt: new Date(now - 2000).toISOString() })
    };

    const stats = getSetStats(set, progressByCard, []);

    expect(stats.due).toBe(2);
  });

  it('should calculate accuracy percentage from reviews', () => {
    const set = createTestSet('set-1', 1);
    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1', { knownCount: 8, unknownCount: 2 })
    };

    const reviews: ReviewLog[] = [
      { id: 'review-1', cardId: 'card-1', setId: 'set-1', mode: 'flashcards', result: 'known', reviewedAt: new Date().toISOString() },
      { id: 'review-2', cardId: 'card-1', setId: 'set-1', mode: 'flashcards', result: 'known', reviewedAt: new Date().toISOString() },
      { id: 'review-3', cardId: 'card-1', setId: 'set-1', mode: 'flashcards', result: 'unknown', reviewedAt: new Date().toISOString() },
      { id: 'review-4', cardId: 'card-1', setId: 'set-1', mode: 'flashcards', result: 'unknown', reviewedAt: new Date().toISOString() },
      { id: 'review-5', cardId: 'card-1', setId: 'set-1', mode: 'flashcards', result: 'unknown', reviewedAt: new Date().toISOString() }
    ];

    const stats = getSetStats(set, progressByCard, reviews);

    // 2 out of 5 reviews were correct
    expect(stats.accuracy).toBeCloseTo(40, 1);
  });

  it('should handle division by zero in accuracy', () => {
    const set = createTestSet('set-1', 1);
    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1', { knownCount: 0, unknownCount: 0 })
    };

    const stats = getSetStats(set, progressByCard, []);

    expect(stats.accuracy).toBe(0);
    expect(isFinite(stats.accuracy)).toBe(true);
  });
});

describe('getAppStats', () => {
  it('should aggregate stats from multiple sets', () => {
    const set1 = createTestSet('set-1', 2);
    const set2 = createTestSet('set-2', 3);

    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1', { mastered: true }),
      'card-2': createTestProgress('card-2', 'set-1'),
      'card-3': createTestProgress('card-3', 'set-2'),
      'card-4': createTestProgress('card-4', 'set-2'),
      'card-5': createTestProgress('card-5', 'set-2', { mastered: true })
    };

    const stats = getAppStats([set1, set2], progressByCard, []);

    expect(stats.totalCards).toBe(5);
    expect(stats.masteredCards).toBe(2);
    expect(stats.totalSets).toBe(2);
  });

  it('should count due cards across all sets', () => {
    const set1 = createTestSet('set-1', 2);
    const now = Date.now();

    const progressByCard: Record<string, CardProgress> = {
      'card-1': createTestProgress('card-1', 'set-1', { dueAt: new Date(now - 1000).toISOString() }),
      'card-2': createTestProgress('card-2', 'set-1', { dueAt: new Date(now + 1000).toISOString() })
    };

    const stats = getAppStats([set1], progressByCard, []);

    expect(stats.dueCards).toBe(1);
  });
});