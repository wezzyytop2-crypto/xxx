"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createSet, deleteSet, ensureSeedData, loadSnapshot, recordReview, resetSetProgress, updateSet } from "@/lib/db";
import { getAppStats, getSetStats } from "@/lib/study";
import type { AppStats, CardProgress, ReviewLog, ReviewResult, SaveSetInput, SetStats, StudyMode, StudySet } from "@/lib/types";

type AppContextValue = {
  ready: boolean;
  sets: StudySet[];
  reviews: ReviewLog[];
  progressByCard: Record<string, CardProgress>;
  appStats: AppStats;
  refresh: () => Promise<void>;
  getSet: (setId: string) => StudySet | undefined;
  getSetStatsById: (setId: string) => SetStats | null;
  createSetItem: (input: SaveSetInput) => Promise<StudySet>;
  updateSetItem: (setId: string, input: SaveSetInput) => Promise<StudySet>;
  deleteSetItem: (setId: string) => Promise<void>;
  resetProgressForSet: (setId: string) => Promise<void>;
  recordCardReview: (payload: {
    setId: string;
    cardId: string;
    mode: StudyMode;
    result: ReviewResult;
  }) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

function buildProgressMap(progress: CardProgress[]) {
  return Object.fromEntries(progress.map((item) => [item.cardId, item]));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [sets, setSets] = useState<StudySet[]>([]);
  const [reviews, setReviews] = useState<ReviewLog[]>([]);
  const [progressByCard, setProgressByCard] = useState<Record<string, CardProgress>>({});

  async function refresh() {
    const snapshot = await loadSnapshot();

    setSets(snapshot.sets);
    setReviews(snapshot.reviews);
    setProgressByCard(buildProgressMap(snapshot.progress));
    setReady(true);
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      await ensureSeedData();

      if (cancelled) {
        return;
      }

      await refresh();
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const appStats = getAppStats(sets, progressByCard, reviews);

  const value: AppContextValue = {
    ready,
    sets,
    reviews,
    progressByCard,
    appStats,
    refresh,
    getSet(setId) {
      return sets.find((set) => set.id === setId);
    },
    getSetStatsById(setId) {
      const set = sets.find((item) => item.id === setId);

      if (!set) {
        return null;
      }

      return getSetStats(set, progressByCard, reviews);
    },
    async createSetItem(input) {
      const created = await createSet(input);
      setSets((previous) => [created, ...previous]);
      return created;
    },
    async updateSetItem(setId, input) {
      const updated = await updateSet(setId, input);
      await refresh();
      return updated;
    },
    async deleteSetItem(setId) {
      await deleteSet(setId);
      await refresh();
    },
    async resetProgressForSet(setId) {
      await resetSetProgress(setId);
      await refresh();
    },
    async recordCardReview(payload) {
      const result = await recordReview(payload);

      setProgressByCard((previous) => ({
        ...previous,
        [result.progress.cardId]: result.progress
      }));

      setReviews((previous) => [result.review, ...previous]);
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}
