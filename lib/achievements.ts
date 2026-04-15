// lib/achievements.ts
import type { ReviewLog, AppStats } from "@/lib/types";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: AppStats, reviews: ReviewLog[]) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-review",
    title: "Первый шаг",
    description: "Проведите первую проверку карточки.",
    icon: "🥇",
    condition: (stats, reviews) => reviews.length >= 1,
  },
  {
    id: "hundred-xp",
    title: "100 XP!",
    description: "Наберите 100 XP за обучение.",
    icon: "💯",
    condition: (stats) => stats.xp >= 100,
  },
  {
    id: "streak-7",
    title: "7 дней подряд",
    description: "Учитесь каждый день в течение недели.",
    icon: "🔥",
    condition: (stats, reviews) => {
      const days = new Set(reviews.map(r => r.reviewedAt.slice(0, 10)));
      return days.size >= 7;
    },
  },
  {
    id: "master-10",
    title: "10 освоенных слов",
    description: "Освойте 10 карточек (статус mastered).",
    icon: "🏆",
    condition: (stats) => stats.masteredCards >= 10,
  },
  {
    id: "review-100",
    title: "100 повторений",
    description: "Проведите 100 повторений.",
    icon: "🚀",
    condition: (stats, reviews) => reviews.length >= 100,
  },
];

export function getUnlockedAchievements(stats: AppStats, reviews: ReviewLog[], unlocked: string[]): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.condition(stats, reviews) && !unlocked.includes(a.id));
}
