import { evolveProgress, createInitialProgress, isCardDue } from '@/lib/study';
import { calculateSM2NextReview } from '@/lib/study-system';

describe('Study System (SM-2)', () => {
  it('initial progress has SM-2 defaults', () => {
    const progress = createInitialProgress('card1', 'set1');
    expect(progress.ease).toBeCloseTo(2.5, 1);
    expect(progress.intervalDays).toBe(0);
  });

  it('correct answer increases interval (SM-2)', () => {
    const initial = createInitialProgress('card1', 'set1');
    const next = evolveProgress(initial, 'known');
    expect(next.intervalDays).toBeGreaterThan(0);
    expect(next.ease).toBeGreaterThan(2.5);
  });

  it('wrong answer resets to day 1', () => {
    const initial = createInitialProgress('card1', 'set1');
    const next = evolveProgress(initial, 'unknown');
    expect(next.intervalDays).toBe(1);
    expect(next.streak).toBe(0);
  });

  it('isCardDue works with SM-2 dates', () => {
    const progress = createInitialProgress('card1', 'set1');
    expect(isCardDue(progress)).toBe(true);
  });

  it('SM-2 quality mapping', () => {
    const state = { easiness: 2.5, interval: 1, repetition: 1, nextReview: new Date().toISOString() };
    const nextCorrect = calculateSM2NextReview(5, state);
    const nextWrong = calculateSM2NextReview(2, state);
    expect(nextCorrect.interval).toBeGreaterThan(1);
    expect(nextWrong.interval).toBe(1);
  });
});

