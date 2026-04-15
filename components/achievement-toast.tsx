import { useEffect, useState } from "react";
import { getUnlockedAchievements, ACHIEVEMENTS, type Achievement } from "@/lib/achievements";
import type { AppStats, ReviewLog } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export function AchievementToast({ stats, reviews }: { stats: AppStats; reviews: ReviewLog[] }) {
  const [shown, setShown] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("achievements") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const unlocked = getUnlockedAchievements(stats, reviews, shown);
    if (unlocked.length > 0) {
      setNewAchievement(unlocked[0]);
      setShown((prev) => {
        const updated = [...prev, unlocked[0].id];
        localStorage.setItem("achievements", JSON.stringify(updated));
        return updated;
      });
    }
  }, [stats, reviews]);

  if (!newAchievement) return null;

  return (
    <AnimatePresence>
      {newAchievement && (
        <motion.div
          className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-accent px-6 py-4 text-center shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <div className="text-3xl mb-2">{newAchievement.icon}</div>
          <div className="font-bold text-lg text-slate-950">{newAchievement.title}</div>
          <div className="text-sm text-slate-950/80 mt-1">{newAchievement.description}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
