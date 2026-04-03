import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { SAMPLE_SETS } from "@/lib/sample-data";
import { createInitialProgress, evolveProgress } from "@/lib/study";
import type { CardDraft, CardProgress, MetaRecord, ReviewLog, ReviewResult, SaveSetInput, StudyMode, StudySet } from "@/lib/types";
import { createId } from "@/lib/utils";

interface LimbiDatabase extends DBSchema {
  sets: {
    key: string;
    value: StudySet;
  };
  progress: {
    key: string;
    value: CardProgress;
    indexes: {
      "by-setId": string;
      "by-dueAt": string;
    };
  };
  reviews: {
    key: string;
    value: ReviewLog;
    indexes: {
      "by-setId": string;
      "by-cardId": string;
      "by-reviewedAt": string;
    };
  };
  meta: {
    key: string;
    value: MetaRecord;
  };
}

const DB_NAME = "limbi-local-db";
const DB_VERSION = 1;
const SEEDED_KEY = "builtins-version";
const BUILT_IN_VERSION = "2026-04-03-cards-52";

let dbPromise: Promise<IDBPDatabase<LimbiDatabase>> | null = null;

function getDatabase() {
  if (!dbPromise) {
    dbPromise = openDB<LimbiDatabase>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains("sets")) {
          database.createObjectStore("sets", { keyPath: "id" });
        }

        if (!database.objectStoreNames.contains("progress")) {
          const progressStore = database.createObjectStore("progress", { keyPath: "cardId" });
          progressStore.createIndex("by-setId", "setId");
          progressStore.createIndex("by-dueAt", "dueAt");
        }

        if (!database.objectStoreNames.contains("reviews")) {
          const reviewStore = database.createObjectStore("reviews", { keyPath: "id" });
          reviewStore.createIndex("by-setId", "setId");
          reviewStore.createIndex("by-cardId", "cardId");
          reviewStore.createIndex("by-reviewedAt", "reviewedAt");
        }

        if (!database.objectStoreNames.contains("meta")) {
          database.createObjectStore("meta", { keyPath: "key" });
        }
      }
    });
  }

  return dbPromise;
}

function normalizeCards(cards: CardDraft[], previousCards: StudySet["cards"] = []) {
  const previousMap = new Map(previousCards.map((card) => [card.id, card]));
  const now = new Date().toISOString();

  return cards
    .map((card) => {
      const existing = card.id ? previousMap.get(card.id) : undefined;

      return {
        id: card.id ?? createId("card"),
        term: card.term.trim(),
        translation: card.translation.trim(),
        example: card.example.trim(),
        note: card.note.trim(),
        partOfSpeech: card.partOfSpeech,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now
      };
    })
    .filter((card) => card.term.length > 0 && card.translation.length > 0);
}

async function removeCardArtifacts(database: IDBPDatabase<LimbiDatabase>, cardIds: string[]) {
  if (cardIds.length === 0) {
    return;
  }

  const tx = database.transaction(["progress", "reviews"], "readwrite");

  for (const cardId of cardIds) {
    await tx.objectStore("progress").delete(cardId);
    const reviewKeys = await tx.objectStore("reviews").index("by-cardId").getAllKeys(cardId);

    for (const key of reviewKeys) {
      await tx.objectStore("reviews").delete(key as string);
    }
  }

  await tx.done;
}

export async function ensureSeedData() {
  const database = await getDatabase();
  const versionRecord = await database.get("meta", SEEDED_KEY);
  const needsRefresh = versionRecord?.value !== BUILT_IN_VERSION;

  if (needsRefresh) {
    const existingSets = await database.getAll("sets");
    const builtInSets = existingSets.filter((set) => set.id.startsWith("seed-"));

    for (const set of builtInSets) {
      await database.delete("sets", set.id);
      await removeCardArtifacts(
        database,
        set.cards.map((card) => card.id)
      );
    }
  }

  const tx = database.transaction(["sets", "meta"], "readwrite");

  for (const set of SAMPLE_SETS) {
    await tx.objectStore("sets").put(set);
  }

  await tx.objectStore("meta").put({
    key: SEEDED_KEY,
    value: BUILT_IN_VERSION
  });

  await tx.done;
}

export async function loadSnapshot() {
  const database = await getDatabase();
  const [sets, progress, reviews] = await Promise.all([
    database.getAll("sets"),
    database.getAll("progress"),
    database.getAll("reviews")
  ]);

  return {
    sets: sets.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
    progress,
    reviews: reviews.sort(
      (left, right) => new Date(right.reviewedAt).getTime() - new Date(left.reviewedAt).getTime()
    )
  };
}

export async function createSet(input: SaveSetInput) {
  const database = await getDatabase();
  const now = new Date().toISOString();
  const set: StudySet = {
    id: createId("set"),
    title: input.title.trim(),
    description: input.description.trim(),
    color: input.color,
    createdAt: now,
    updatedAt: now,
    cards: normalizeCards(input.cards)
  };

  await database.put("sets", set);
  return set;
}

export async function updateSet(setId: string, input: SaveSetInput) {
  const database = await getDatabase();
  const previous = await database.get("sets", setId);

  if (!previous) {
    throw new Error("Набор не найден");
  }

  const nextCards = normalizeCards(input.cards, previous.cards);
  const nextCardIds = new Set(nextCards.map((card) => card.id));
  const removedCards = previous.cards.filter((card) => !nextCardIds.has(card.id)).map((card) => card.id);
  const nextSet: StudySet = {
    ...previous,
    title: input.title.trim(),
    description: input.description.trim(),
    color: input.color,
    updatedAt: new Date().toISOString(),
    cards: nextCards
  };

  await database.put("sets", nextSet);
  await removeCardArtifacts(database, removedCards);

  return nextSet;
}

export async function deleteSet(setId: string) {
  const database = await getDatabase();
  const set = await database.get("sets", setId);

  if (!set) {
    return;
  }

  await database.delete("sets", setId);
  await removeCardArtifacts(
    database,
    set.cards.map((card) => card.id)
  );
}

export async function recordReview({
  setId,
  cardId,
  mode,
  result
}: {
  setId: string;
  cardId: string;
  mode: StudyMode;
  result: ReviewResult;
}) {
  const database = await getDatabase();
  const tx = database.transaction(["progress", "reviews"], "readwrite");
  const progressStore = tx.objectStore("progress");
  const current = (await progressStore.get(cardId)) ?? createInitialProgress(cardId, setId);
  const nextProgress = evolveProgress(current, result);
  const review: ReviewLog = {
    id: createId("review"),
    cardId,
    setId,
    mode,
    result,
    reviewedAt: new Date().toISOString()
  };

  await progressStore.put(nextProgress);
  await tx.objectStore("reviews").put(review);
  await tx.done;

  return {
    progress: nextProgress,
    review
  };
}

export async function resetSetProgress(setId: string) {
  const database = await getDatabase();
  const set = await database.get("sets", setId);

  if (!set) {
    return;
  }

  await removeCardArtifacts(
    database,
    set.cards.map((card) => card.id)
  );
}
