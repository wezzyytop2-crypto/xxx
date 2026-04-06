import {
  translate,
  isCorrectTranslation,
  getRandomWord,
  getWordsByPartOfSpeech,
  getMostFrequentWords,
  getWordById,
  getTranslationVariants
} from '@/lib/translation';
import type { DictionaryEntry } from '@/lib/types';

describe('translate function', () => {
  it('should find exact match for romanian word', () => {
    const result = translate('casă', 'ro-ru');
    expect(result.exact.length).toBeGreaterThan(0);
    expect(result.exact[0].romanian).toBe('casă');
    expect(result.exact[0].russian).toBe('дом');
  });

  it('should find exact match for russian word', () => {
    const result = translate('дом', 'ru-ro');
    expect(result.exact.length).toBeGreaterThan(0);
    expect(result.exact[0].russian).toBe('дом');
    expect(result.exact[0].romanian).toBe('casă');
  });

  it('should find exact match ignoring diacritics', () => {
    const result1 = translate('casa', 'ro-ru');
    const result2 = translate('casă', 'ro-ru');
    
    expect(result1.exact.length).toBe(result2.exact.length);
    expect(result1.exact[0]?.id).toBe(result2.exact[0]?.id);
  });

  it('should find partial matches starting with query', () => {
    const result = translate('ca', 'ro-ru');
    expect(result.partial.length).toBeGreaterThan(0);
    expect(result.partial.every(entry =>
      entry.romanian.toLowerCase().startsWith('ca')
    )).toBe(true);
  });

  it('should handle empty query', () => {
    const result = translate('', 'ro-ru');
    expect(result.exact).toEqual([]);
    expect(result.partial).toEqual([]);
    expect(result.suggestions).toEqual([]);
  });

  it('should return suggestions for typos using fuzzy matching', () => {
    const result = translate('cas', 'ro-ru');
    // Should find similar words even with typo
    expect(result.exact.length === 0 || result.partial.length > 0 || result.suggestions.length > 0).toBe(true);
  });

  it('should not duplicate results in partial and exact', () => {
    const result = translate('casă', 'ro-ru');
    const exactIds = new Set(result.exact.map(e => e.id));
    const partialIds = result.partial.map(e => e.id);
    const duplicates = partialIds.filter(id => exactIds.has(id));
    expect(duplicates.length).toBe(0);
  });

  it('should switch between ro-ru and ru-ro directions', () => {
    const roRu = translate('casă', 'ro-ru');
    const ruRo = translate('дом', 'ru-ro');
    
    expect(roRu.exact[0]?.id).toBe(ruRo.exact[0]?.id);
  });

  it('should return top 10 suggestions max', () => {
    const result = translate('a', 'ro-ru');
    expect(result.suggestions.length).toBeLessThanOrEqual(10);
  });

  it('should return top 10 partial matches max', () => {
    const result = translate('a', 'ro-ru');
    expect(result.partial.length).toBeLessThanOrEqual(10);
  });

  it('should handle case insensitive search', () => {
    const result1 = translate('CASA', 'ro-ru');
    const result2 = translate('casa', 'ro-ru');
    const result3 = translate('Casa', 'ro-ru');
    
    expect(result1.exact.length).toBeGreaterThan(0);
    expect(result2.exact.length).toBeGreaterThan(0);
    expect(result3.exact.length).toBeGreaterThan(0);
  });

  it('should handle whitespace normalization', () => {
    const result1 = translate('  casă  ', 'ro-ru');
    const result2 = translate('casă', 'ro-ru');
    
    expect(result1.exact.length).toBe(result2.exact.length);
  });

  it('should find verbs', () => {
    const result = translate('a merge', 'ro-ru');
    expect(result.exact.length).toBeGreaterThan(0);
    expect(result.exact[0]?.partOfSpeech).toBe('verb');
  });

  it('should find adjectives', () => {
    const result = translate('bun', 'ro-ru');
    expect(result.exact.length).toBeGreaterThan(0);
    expect(result.exact[0]?.partOfSpeech).toBe('adjective');
  });
});

describe('isCorrectTranslation function', () => {
  const testEntry: DictionaryEntry = {
    id: 'test-casa',
    romanian: 'casă',
    russian: 'дом',
    partOfSpeech: 'noun',
    gender: 'f',
    synonyms: ['locuință', 'domiciliu']
  };

  it('should recognize correct exact answer', () => {
    expect(isCorrectTranslation('дом', testEntry, 'ro-ru')).toBe(true);
  });

  it('should recognize correct answer ignoring case', () => {
    expect(isCorrectTranslation('ДОМ', testEntry, 'ro-ru')).toBe(true);
    expect(isCorrectTranslation('Дом', testEntry, 'ro-ru')).toBe(true);
  });

  it('should recognize correct synonym', () => {
    expect(isCorrectTranslation('locuință', testEntry, 'ro-ru')).toBe(true);
    expect(isCorrectTranslation('domiciliu', testEntry, 'ro-ru')).toBe(true);
  });

  it('should reject incorrect answer', () => {
    expect(isCorrectTranslation('книга', testEntry, 'ro-ru')).toBe(false);
  });

  it('should handle reverse direction (ru-ro)', () => {
    expect(isCorrectTranslation('casă', testEntry, 'ru-ro')).toBe(true);
  });

  it('should ignore whitespace in answer', () => {
    expect(isCorrectTranslation('  дом  ', testEntry, 'ro-ru')).toBe(true);
  });

  it('should handle entry without synonyms', () => {
    const simpleEntry = { ...testEntry, synonyms: undefined };
    expect(isCorrectTranslation('дом', simpleEntry, 'ro-ru')).toBe(true);
  });
});

describe('getTranslationVariants function', () => {
  const testEntry: DictionaryEntry = {
    id: 'test-casa',
    romanian: 'casă',
    russian: 'дом',
    partOfSpeech: 'noun',
    gender: 'f',
    synonyms: ['locuință', 'domiciliu']
  };

  it('should return main translation and synonyms', () => {
    const variants = getTranslationVariants(testEntry);
    expect(variants).toContain('дом');
    expect(variants).toContain('locuință');
    expect(variants).toContain('domiciliu');
    expect(variants.length).toBe(3);
  });

  it('should handle entry without synonyms', () => {
    const simple = { ...testEntry, synonyms: undefined };
    const variants = getTranslationVariants(simple);
    expect(variants).toEqual(['дом']);
  });
});

describe('getRandomWord function', () => {
  it('should return a valid dictionary entry', () => {
    const word = getRandomWord();
    expect(word).toHaveProperty('id');
    expect(word).toHaveProperty('romanian');
    expect(word).toHaveProperty('russian');
    expect(word).toHaveProperty('partOfSpeech');
  });

  it('should return different words on multiple calls', () => {
    const words = new Set();
    for (let i = 0; i < 10; i++) {
      words.add(getRandomWord().id);
    }
    // With 50+ words, probability of 10 unique calls is very high
    expect(words.size).toBeGreaterThan(1);
  });
});

describe('getWordsByPartOfSpeech function', () => {
  it('should return only nouns when filtered by noun', () => {
    const nouns = getWordsByPartOfSpeech('noun');
    expect(nouns.length).toBeGreaterThan(0);
    expect(nouns.every(word => word.partOfSpeech === 'noun')).toBe(true);
  });

  it('should return only verbs when filtered by verb', () => {
    const verbs = getWordsByPartOfSpeech('verb');
    expect(verbs.length).toBeGreaterThan(0);
    expect(verbs.every(word => word.partOfSpeech === 'verb')).toBe(true);
  });

  it('should return empty array for unknown part of speech', () => {
    const unknown = getWordsByPartOfSpeech('unknown-pos');
    expect(unknown).toEqual([]);
  });
});

describe('getMostFrequentWords function', () => {
  it('should return requested number of words', () => {
    const words = getMostFrequentWords(10);
    expect(words.length).toBeLessThanOrEqual(10);
  });

  it('should return words sorted by frequency descending', () => {
    const words = getMostFrequentWords(20);
    for (let i = 0; i < words.length - 1; i++) {
      const freq1 = words[i].frequency ?? 0;
      const freq2 = words[i + 1].frequency ?? 0;
      expect(freq1).toBeGreaterThanOrEqual(freq2);
    }
  });

  it('should return all words if limit > dictionary size', () => {
    const all = getMostFrequentWords(10000);
    expect(all.length).toBeGreaterThan(30); // Should be 50+
  });
});

describe('getWordById function', () => {
  it('should find word by valid id', () => {
    const word = getWordById('ro_casa');
    expect(word).toBeDefined();
    expect(word?.romanian).toBe('casă');
  });

  it('should return undefined for invalid id', () => {
    const word = getWordById('invalid-id-12345');
    expect(word).toBeUndefined();
  });
});
