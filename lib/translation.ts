import { BUILT_IN_DICTIONARY } from '@/lib/dictionary';
import { ROMANIAN_RUSSIAN_DICTIONARY } from '@/lib/dictionary-ro-ru';
import type { DictionaryEntry, TranslationResult, TranslationDirection } from '@/lib/types';

// Кеш результатов поиска (макс 50 последних запросов)
const searchCache = new Map<string, TranslationResult>();
const CACHE_MAX_SIZE = 50;

function createBuiltInTranslationEntry(
  entry: (typeof BUILT_IN_DICTIONARY)[number]
): DictionaryEntry {
  return {
    id: entry.id,
    romanian: entry.term,
    russian: entry.translation,
    partOfSpeech: entry.partOfSpeech
  };
}

function dedupeEntries(entries: DictionaryEntry[]) {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    const key = `${normalizeText(entry.romanian)}::${entry.partOfSpeech}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

const SEARCH_DICTIONARY = dedupeEntries([
  ...ROMANIAN_RUSSIAN_DICTIONARY,
  ...BUILT_IN_DICTIONARY.map(createBuiltInTranslationEntry)
]);

export const TRANSLATION_DICTIONARY_SIZE = SEARCH_DICTIONARY.length;

/**
 * Нормализует текст для поиска:
 * - преобразует в нижний регистр
 * - убирает диакритику (ă→a, ț→t, etc)
 * - окаймляет пробелы
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Убрать диакритику
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Вычисляет расстояние Левенштейна между двумя строками
 * для нечеткого поиска
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = 1 + Math.min(
          matrix[i - 1][j],     // deletion
          matrix[i][j - 1],     // insertion
          matrix[i - 1][j - 1]  // substitution
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Вычисляет сходство между двумя строками (0-1)
 * основано на расстоянии Левенштейна
 */
function stringSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

/**
 * Основная функция поиска перевода с кешированием результатов
 * 
 * @example
 * const result = translate('casă', 'ro-ru');
 * // {
 * //   exact: [{...}],           // точные совпадения
 * //   partial: [{...}],         // начинается с запроса
 * //   suggestions: ['casa', ...] // нечеткий поиск
 * // }
 */
export function translate(
  query: string,
  direction: TranslationDirection = 'ro-ru'
): TranslationResult {
  if (!query || query.length === 0) {
    return { exact: [], partial: [], suggestions: [] };
  }

  // Проверяем кеш
  const cacheKey = `${query}|${direction}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const result = translateUncached(query, direction);
  
  // Добавляем в кеш с ограничением размера
  if (searchCache.size >= CACHE_MAX_SIZE) {
    const firstKey = searchCache.keys().next().value;
    if (firstKey !== undefined) {
      searchCache.delete(firstKey);
    }
  }
  searchCache.set(cacheKey, result);

  return result;
}

/**
 * Внутренняя функция поиска без кеширования
 * @internal
 */
function translateUncached(
  query: string,
  direction: TranslationDirection
): TranslationResult {

  const searchKey = direction === 'ro-ru' ? 'romanian' : 'russian';
  const targetKey = direction === 'ro-ru' ? 'russian' : 'romanian';
  const normalizedQuery = normalizeText(query);

  // Точное совпадение (игнорируя диакритику)
  const exact = SEARCH_DICTIONARY.filter(entry => {
    const normalized = normalizeText(entry[searchKey]);
    return normalized === normalizedQuery;
  });

  // Частичное совпадение (начинается с)
  const partial = SEARCH_DICTIONARY.filter(entry => {
    const normalized = normalizeText(entry[searchKey]);
    return (
      normalized.startsWith(normalizedQuery) &&
      !exact.some(e => e.id === entry.id)
    );
  }).slice(0, 10);

  // Нечеткий поиск (для опечаток и подобных)
  const fuzzy: Array<{ entry: DictionaryEntry; similarity: number }> = [];

  SEARCH_DICTIONARY.forEach(entry => {
    if (exact.some(e => e.id === entry.id) || partial.some(e => e.id === entry.id)) {
      return; // Пропустить если уже в exact/partial
    }

    const normalized = normalizeText(entry[searchKey]);
    const similarity = stringSimilarity(normalizedQuery, normalized);

    // Учитываем только результаты с сходством >= 0.6 (60%)
    if (similarity >= 0.6) {
      fuzzy.push({ entry, similarity });
    }
  });

  // Сортируем по сходству и берем топ 10
  const suggestions = fuzzy
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10)
    .map(item => item.entry[searchKey]);

  return { exact, partial, suggestions };
}

/**
 * Получает все варианты перевода слова (со всеми синонимами)
 */
export function getTranslationVariants(entry: DictionaryEntry): string[] {
  const variants = [entry.russian];
  if (entry.synonyms) {
    variants.push(...entry.synonyms);
  }
  return variants;
}

/**
 * Проверяет, является ли ответ правильным переводом
 * (с учетом синонимов)
 * 
 * @example
 * isCorrectAnswer('casa', { romanian: 'casă', russian: 'дом' }); // true (игнорирует диакритику)
 */
export function isCorrectTranslation(
  answer: string,
  entry: DictionaryEntry,
  direction: TranslationDirection = 'ro-ru'
): boolean {
  const normalizedAnswer = normalizeText(answer);
  const variants = direction === 'ro-ru'
    ? [normalizeText(entry.russian)]
    : [normalizeText(entry.romanian)];

  if (entry.synonyms) {
    variants.push(...entry.synonyms.map(normalizeText));
  }

  return variants.some(variant => variant === normalizedAnswer);
}

/**
 * Получает случайное слово из словаря
 * для практики
 */
export function getRandomWord(): DictionaryEntry {
  const randomIndex = Math.floor(Math.random() * SEARCH_DICTIONARY.length);
  return SEARCH_DICTIONARY[randomIndex];
}

/**
 * Получает слова определенной части речи
 */
export function getWordsByPartOfSpeech(partOfSpeech: string): DictionaryEntry[] {
  return SEARCH_DICTIONARY.filter(
    entry => entry.partOfSpeech === partOfSpeech
  );
}

/**
 * Получает самые частотные слова
 */
export function getMostFrequentWords(limit: number = 20): DictionaryEntry[] {
  return [...SEARCH_DICTIONARY]
    .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
    .slice(0, limit);
}

/**
 * Поиск слова по ID
 */
export function getWordById(id: string): DictionaryEntry | undefined {
  return SEARCH_DICTIONARY.find(entry => entry.id === id);
}

/**
 * Очищает кеш результатов поиска
 * Используется для отладки или при необходимости сброса
 * @internal
 */
export function clearTranslationCache(): void {
  searchCache.clear();
}
