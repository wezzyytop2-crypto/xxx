"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
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
  error: Error | null;
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
  const [error, setError] = useState<Error | null>(null);

  async function refresh() {
    try {
      const snapshot = await loadSnapshot();

      setSets(snapshot.sets);
      setReviews(snapshot.reviews);
      setProgressByCard(buildProgressMap(snapshot.progress));
      setReady(true);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load data');
      console.error('Failed to refresh app state:', error);
      setError(error);
      setReady(true); // Позволяем UI показать ошибку
      throw error;
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        await ensureSeedData();

        if (cancelled) {
          return;
        }

        await refresh();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Bootstrap failed');
        console.error('Bootstrap error:', error);
        
        if (!cancelled) {
          setError(error);
          setReady(true); // Позволяем UI показать ошибку
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  // Мемоизируем appStats чтобы избежать пересчёта на каждом render
  const appStats = useMemo(() => {
    return getAppStats(sets, progressByCard, reviews);
  }, [sets, progressByCard, reviews]);

  const value: AppContextValue = {
    ready,
    sets,
    reviews,
    progressByCard,
    appStats,
    error,
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
      try {
        const created = await createSet(input);
        setSets((previous) => [created, ...previous]);
        setError(null);
        return created;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create set');
        console.error('Create set error:', error);
        setError(error);
        throw error;
      }
    },
    async updateSetItem(setId, input) {
      try {
        const updated = await updateSet(setId, input);
        await refresh();
        setError(null);
        return updated;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update set');
        console.error('Update set error:', error);
        setError(error);
        throw error;
      }
    },
    async deleteSetItem(setId) {
      try {
        await deleteSet(setId);
        await refresh();
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete set');
        console.error('Delete set error:', error);
        setError(error);
        throw error;
      }
    },
    async resetProgressForSet(setId) {
      try {
        await resetSetProgress(setId);
        await refresh();
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to reset progress');
        console.error('Reset progress error:', error);
        setError(error);
        throw error;
      }
    },
    async recordCardReview(payload) {
      try {
        const result = await recordReview(payload);

        setProgressByCard((previous) => ({
          ...previous,
          [result.progress.cardId]: result.progress
        }));

        setReviews((previous) => [result.review, ...previous]);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to record review');
        console.error('Record review error:', error);
        setError(error);
        throw error;
      }
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
