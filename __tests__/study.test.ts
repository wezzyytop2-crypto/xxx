import { evolveProgress } from '../lib/study';

test('SM-2 correct answer increases interval', () => {
  const progress = { intervalDays: 1, ease: 2.5, streak: 1, knownCount: 1, unknownCount: 0, mastered: false, dueAt: '2026-04-03T00:00:00.000Z', lastReviewedAt: null, lastResult: null };
  const result = evolveProgress(progress, 'known');
  expect(result.intervalDays).toBeGreaterThan(1);
});