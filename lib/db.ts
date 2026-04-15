import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { SAMPLE_SETS } from "@/lib/sample-data";
import { createInitialProgress, evolveProgress } from "@/lib/study";
import type {
  AuthUserId,
  CardDraft,
  CardProgress,
  MetaRecord,
  ReviewLog,
  ReviewResult,
  SaveSetInput,
  StudyMode,
  StudySet
} from "@/lib/types";
import { createId } from "@/lib/utils";

type Snapshot = {
  sets: StudySet[];
  progress: CardProgress[];
  reviews: ReviewLog[];
};

type StoredSetRecord = {
  key: string;
  userId: AuthUserId;
  setId: string;
  updatedAt: string;
  data: StudySet;
};

type StoredProgressRecord = {
  key: string;
  userId: AuthUserId;
  cardId: string;
  setId: string;
  dueAt: string;
  data: CardProgress;
};

type StoredReviewRecord = {
  key: string;
  userId: AuthUserId;
  reviewId: string;
  cardId: string;
  setId: string;
  reviewedAt: string;
  data: ReviewLog;
};

type StoredMetaRecord = MetaRecord & {
  key: string;
  userId: AuthUserId;
};

interface LimbiDatabase extends DBSchema {
  sets: {
    key: string;
    value: StoredSetRecord;
    indexes: {
      "by-userId": AuthUserId;
      "by-userId-setId": [AuthUserId, string];
    };
  };
  progress: {
    key: string;
    value: StoredProgressRecord;
    indexes: {
      "by-userId": AuthUserId;
      "by-userId-setId": [AuthUserId, string];
    };
  };
  reviews: {
    key: string;
    value: StoredReviewRecord;
    indexes: {
      "by-userId": AuthUserId;
      "by-userId-setId": [AuthUserId, string];
      "by-userId-cardId": [AuthUserId, string];
    };
  };
  meta: {
    key: string;
    value: StoredMetaRecord;
    indexes: {
      "by-userId": AuthUserId;
    };
  };
}

interface LegacyLimbiDatabase extends DBSchema {
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

const DB_NAME = "limbi-local-db-v2";
const DB_VERSION = 1;
const LEGACY_DB_NAME = "limbi-local-db";
const LEGACY_DB_VERSION = 1;
const SEEDED_KEY = "builtins-version";
const BUILT_IN_VERSION = "2026-04-15-library-20-sets-expanded";
const LEGACY_IMPORT_KEY = "legacy-import-v1";
const LEGACY_IMPORT_VERSION = "2026-04-08-user1-import";

let dbPromise: Promise<IDBPDatabase<LimbiDatabase>> | null = null;

interface CacheEntry {
  data: Snapshot;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000;
const snapshotCache = new Map<AuthUserId, CacheEntry>();

function scopedKey(userId: AuthUserId, value: string) {
  return `${userId}::${value}`;
}

function metaScopedKey(userId: AuthUserId, key: string) {
  return `${userId}::meta::${key}`;
}

function createMetaRecord(userId: AuthUserId, key: string, value: string): StoredMetaRecord {
  return {
    key: metaScopedKey(userId, key),
    userId,
    value
  };
}

function toStoredSet(userId: AuthUserId, set: StudySet): StoredSetRecord {
  return {
    key: scopedKey(userId, set.id),
    userId,
    setId: set.id,
    updatedAt: set.updatedAt,
    data: set
  };
}

function toStoredProgress(userId: AuthUserId, progress: CardProgress): StoredProgressRecord {
  return {
    key: scopedKey(userId, progress.cardId),
    userId,
    cardId: progress.cardId,
    setId: progress.setId,
    dueAt: progress.dueAt,
    data: progress
  };
}

function toStoredReview(userId: AuthUserId, review: ReviewLog): StoredReviewRecord {
  return {
    key: scopedKey(userId, review.id),
    userId,
    reviewId: review.id,
    cardId: review.cardId,
    setId: review.setId,
    reviewedAt: review.reviewedAt,
    data: review
  };
}

function invalidateCache(userId?: AuthUserId) {
  if (userId) {
    snapshotCache.delete(userId);
    return;
  }

  snapshotCache.clear();
}

function getDatabase() {
  if (!dbPromise) {
    dbPromise = openDB<LimbiDatabase>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains("sets")) {
          const setsStore = database.createObjectStore("sets", { keyPath: "key" });
          setsStore.createIndex("by-userId", "userId");
          setsStore.createIndex("by-userId-setId", ["userId", "setId"]);
        }

        if (!database.objectStoreNames.contains("progress")) {
          const progressStore = database.createObjectStore("progress", { keyPath: "key" });
          progressStore.createIndex("by-userId", "userId");
          progressStore.createIndex("by-userId-setId", ["userId", "setId"]);
        }

        if (!database.objectStoreNames.contains("reviews")) {
          const reviewStore = database.createObjectStore("reviews", { keyPath: "key" });
          reviewStore.createIndex("by-userId", "userId");
          reviewStore.createIndex("by-userId-setId", ["userId", "setId"]);
          reviewStore.createIndex("by-userId-cardId", ["userId", "cardId"]);
        }

        if (!database.objectStoreNames.contains("meta")) {
          const metaStore = database.createObjectStore("meta", { keyPath: "key" });
          metaStore.createIndex("by-userId", "userId");
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

async function removeCardArtifacts(database: IDBPDatabase<LimbiDatabase>, userId: AuthUserId, cardIds: string[]) {
  if (cardIds.length === 0) {
    return;
  }

  const tx = database.transaction(["progress", "reviews"], "readwrite");
  const reviewStore = tx.objectStore("reviews");
  const reviewIndex = reviewStore.index("by-userId-cardId");

  for (const cardId of cardIds) {
    await tx.objectStore("progress").delete(scopedKey(userId, cardId));

    const reviewKeys = await reviewIndex.getAllKeys([userId, cardId]);

    for (const key of reviewKeys) {
      await reviewStore.delete(key as string);
    }
  }

  await tx.done;
}

async function legacyDbExists() {
  if (typeof indexedDB === "undefined") {
    return false;
  }

  const databases = (indexedDB as IDBFactory & {
    databases?: () => Promise<Array<{ name?: string }>>;
  }).databases;

  if (!databases) {
    return false;
  }

  try {
    const list = await databases.call(indexedDB);
    return list.some((database) => database.name === LEGACY_DB_NAME);
  } catch {
    return false;
  }
}

async function hasUserData(database: IDBPDatabase<LimbiDatabase>, userId: AuthUserId) {
  const count = await database.transaction("sets", "readonly").store.index("by-userId").count(userId);
  return count > 0;
}

async function migrateLegacyDataForUser(userId: AuthUserId) {
  const database = await getDatabase();
  const importedRecord = await database.get("meta", metaScopedKey(userId, LEGACY_IMPORT_KEY));

  if (importedRecord?.value === LEGACY_IMPORT_VERSION) {
    return;
  }

  if (userId !== "user1" || (await hasUserData(database, userId)) || !(await legacyDbExists())) {
    await database.put("meta", createMetaRecord(userId, LEGACY_IMPORT_KEY, LEGACY_IMPORT_VERSION));
    return;
  }

  const legacyDb = await openDB<LegacyLimbiDatabase>(LEGACY_DB_NAME, LEGACY_DB_VERSION);
  const [legacySets, legacyProgress, legacyReviews] = await Promise.all([
    legacyDb.getAll("sets"),
    legacyDb.getAll("progress"),
    legacyDb.getAll("reviews")
  ]);

  const tx = database.transaction(["sets", "progress", "reviews", "meta"], "readwrite");

  for (const set of legacySets) {
    await tx.objectStore("sets").put(toStoredSet(userId, set));
  }

  for (const progress of legacyProgress) {
    await tx.objectStore("progress").put(toStoredProgress(userId, progress));
  }

  for (const review of legacyReviews) {
    await tx.objectStore("reviews").put(toStoredReview(userId, review));
  }

  await tx.objectStore("meta").put(createMetaRecord(userId, LEGACY_IMPORT_KEY, LEGACY_IMPORT_VERSION));
  await tx.done;

  legacyDb.close();
  invalidateCache(userId);
}

async function getUserSnapshot(database: IDBPDatabase<LimbiDatabase>, userId: AuthUserId): Promise<Snapshot> {
  const tx = database.transaction(["sets", "progress", "reviews"], "readonly");
  const [sets, progress, reviews] = await Promise.all([
    tx.objectStore("sets").index("by-userId").getAll(userId),
    tx.objectStore("progress").index("by-userId").getAll(userId),
    tx.objectStore("reviews").index("by-userId").getAll(userId)
  ]);

  await tx.done;

  return {
    sets: sets
      .map((record) => record.data)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
    progress: progress.map((record) => record.data),
    reviews: reviews
      .map((record) => record.data)
      .sort((left, right) => new Date(right.reviewedAt).getTime() - new Date(left.reviewedAt).getTime())
  };
}

export async function ensureSeedData(userId: AuthUserId) {
  await migrateLegacyDataForUser(userId);

  const database = await getDatabase();
  const versionRecord = await database.get("meta", metaScopedKey(userId, SEEDED_KEY));
  const needsRefresh = versionRecord?.value !== BUILT_IN_VERSION;

  if (needsRefresh) {
    const existingSets = await database.transaction("sets", "readonly").store.index("by-userId").getAll(userId);
    const builtInSets = existingSets.filter((record) => record.setId.startsWith("seed-"));

    for (const record of builtInSets) {
      await database.delete("sets", record.key);
      await removeCardArtifacts(
        database,
        userId,
        record.data.cards.map((card) => card.id)
      );
    }
  }

  const tx = database.transaction(["sets", "meta"], "readwrite");

  for (const set of SAMPLE_SETS) {
    await tx.objectStore("sets").put(toStoredSet(userId, set));
  }

  await tx.objectStore("meta").put(createMetaRecord(userId, SEEDED_KEY, BUILT_IN_VERSION));
  await tx.done;

  invalidateCache(userId);
}

export async function loadSnapshot(userId: AuthUserId) {
  const now = Date.now();
  const cached = snapshotCache.get(userId);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const database = await getDatabase();
  const data = await getUserSnapshot(database, userId);

  snapshotCache.set(userId, {
    data,
    timestamp: now
  });

  return data;
}

export async function createSet(userId: AuthUserId, input: SaveSetInput) {
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

  await database.put("sets", toStoredSet(userId, set));
  invalidateCache(userId);
  return set;
}

export async function updateSet(userId: AuthUserId, setId: string, input: SaveSetInput) {
  const database = await getDatabase();
  const previous = await database.get("sets", scopedKey(userId, setId));

  if (!previous) {
    throw new Error("Набор не найден");
  }

  const nextCards = normalizeCards(input.cards, previous.data.cards);
  const nextCardIds = new Set(nextCards.map((card) => card.id));
  const removedCards = previous.data.cards.filter((card) => !nextCardIds.has(card.id)).map((card) => card.id);
  const nextSet: StudySet = {
    ...previous.data,
    title: input.title.trim(),
    description: input.description.trim(),
    color: input.color,
    updatedAt: new Date().toISOString(),
    cards: nextCards
  };

  await database.put("sets", toStoredSet(userId, nextSet));
  await removeCardArtifacts(database, userId, removedCards);
  invalidateCache(userId);

  return nextSet;
}

export async function deleteSet(userId: AuthUserId, setId: string) {
  const database = await getDatabase();
  const record = await database.get("sets", scopedKey(userId, setId));

  if (!record) {
    return;
  }

  await database.delete("sets", record.key);
  await removeCardArtifacts(
    database,
    userId,
    record.data.cards.map((card) => card.id)
  );
  invalidateCache(userId);
}

export async function recordReview(
  userId: AuthUserId,
  {
    setId,
    cardId,
    mode,
    result
  }: {
    setId: string;
    cardId: string;
    mode: StudyMode;
    result: ReviewResult;
  }
) {
  const database = await getDatabase();
  const tx = database.transaction(["progress", "reviews"], "readwrite");
  const progressStore = tx.objectStore("progress");
  const currentRecord = await progressStore.get(scopedKey(userId, cardId));
  const current = currentRecord?.data ?? createInitialProgress(cardId, setId);
  const nextProgress = evolveProgress(current, result);
  const review: ReviewLog = {
    id: createId("review"),
    cardId,
    setId,
    mode,
    result,
    reviewedAt: new Date().toISOString()
  };

  await progressStore.put(toStoredProgress(userId, nextProgress));
  await tx.objectStore("reviews").put(toStoredReview(userId, review));
  await tx.done;

  invalidateCache(userId);

  return {
    progress: nextProgress,
    review
  };
}

export async function resetSetProgress(userId: AuthUserId, setId: string) {
  const database = await getDatabase();
  const record = await database.get("sets", scopedKey(userId, setId));

  if (!record) {
    return;
  }

  await removeCardArtifacts(
    database,
    userId,
    record.data.cards.map((card) => card.id)
  );
  invalidateCache(userId);
}
