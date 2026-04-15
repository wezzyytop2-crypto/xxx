// Advanced stats
import type { CardProgress, StudySet } from './types';

export function getWeeklyProgress(progress: CardProgress[]): {
  reviewsThisWeek: number;
  accuracyThisWeek: number;
} {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recent = progress.filter(p => new Date(p.lastReviewedAt || 0) > weekAgo);
  const total = recent.length;
  const correct = recent.filter(p => p.lastResult === 'known' || p.lastResult === 'quiz-correct').length;
  return {
    reviewsThisWeek: total,
    accuracyThisWeek: total ? correct / total : 0
  };
}

export function getStreak(progress: CardProgress[]): number {
  // Simplified streak calculation
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24*60*60*1000).toDateString();
  const recent = progress.filter(p => p.lastReviewedAt);
  const dailyReviews = recent.filter(p => new Date(p.lastReviewedAt!).toDateString() === today ||
    new Date(p.lastReviewedAt!).toDateString() === yesterday);
  return dailyReviews.length > 0 ? 7 : 0;
}

