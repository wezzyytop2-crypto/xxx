'use client';

import { useState, useEffect } from 'react';
import { translate } from '@/lib/translation';
import type { TranslationResult, TranslationDirection } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DictionaryCard } from '@/components/dictionary-card';

export default function TranslatePage() {
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<TranslationDirection>('ro-ru');
  const [results, setResults] = useState<TranslationResult | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Загружаем последние поиски из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        // Игнорируем ошибки парсинга
      }
    }
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 0) {
      const newResults = translate(value, direction);
      setResults(newResults);
    } else {
      setResults(null);
    }
  };

  const handleSelectWord = (word: string) => {
    setQuery(word);
    const newResults = translate(word, direction);
    setResults(newResults);

    // Добавляем в недавние поиски
    setRecentSearches(prev => {
      const updated = [word, ...prev.filter(s => s !== word)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const switchDirection = () => {
    const newDirection = direction === 'ro-ru' ? 'ru-ro' : 'ro-ru';
    setDirection(newDirection);
    setResults(null);
    setQuery('');
  };

  const placeholder = direction === 'ro-ru'
    ? 'Введите румынское слово...'
    : 'Введите русское слово...';

  const directionLabel = direction === 'ro-ru' ? 'RO → RU' : 'RU → RO';

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-secondary">
      <div className="max-w-3xl mx-auto p-4 pb-24">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-2">
            📚 Словарь (Румынский ↔ Русский)
          </h1>
          <p className="text-muted">
            Поиск по{' '}
            <span className="text-indigo-400 font-semibold">
              {direction === 'ro-ru' ? '50+' : '50+'}
            </span>
            {' '}словам с примерами и произношением
          </p>
        </div>

        {/* Поисковое поле */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className={cn(
                'flex-1 px-4 py-3 rounded-lg border transition',
                'bg-panel border-line text-text placeholder-muted',
                'focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20'
              )}
            />
            <button
              onClick={switchDirection}
              className={cn(
                'px-4 py-3 rounded-lg font-medium transition',
                'bg-indigo-500 text-white hover:bg-indigo-600'
              )}
              title="Переключить направление перевода"
            >
              {directionLabel} ⇄
            </button>
          </div>

          {/* Недавние поиски */}
          {!query && recentSearches.length > 0 && (
            <div>
              <p className="text-xs text-muted mb-2">Недавние поиски:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSelectWord(search)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition',
                      'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30'
                    )}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Результаты поиска */}
        {results && query && (
          <div className="space-y-6">
            {/* Точные совпадения */}
            {results.exact.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-xl font-bold text-text">✓ Точное совпадение</h2>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-medium">
                    {results.exact.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {results.exact.map((entry) => (
                    <DictionaryCard
                      key={entry.id}
                      entry={entry}
                      direction={direction}
                      onSelectWord={handleSelectWord}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Похожие слова */}
            {results.partial.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold text-text">~ Похожие слова</h2>
                  <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded text-xs font-medium">
                    {results.partial.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.partial.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() =>
                        handleSelectWord(
                          direction === 'ro-ru' ? entry.romanian : entry.russian
                        )
                      }
                      className={cn(
                        'px-4 py-2 rounded-lg font-medium transition text-sm',
                        'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30'
                      )}
                    >
                      {direction === 'ro-ru' ? entry.romanian : entry.russian}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Предложения на основе нечеткого поиска */}
            {results.exact.length === 0 && results.suggestions.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold text-text">🔍 Может быть вы имели в виду?</h2>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs font-medium">
                    {results.suggestions.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectWord(suggestion)}
                      className={cn(
                        'px-4 py-2 rounded-lg font-medium transition text-sm',
                        'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Нет результатов */}
            {results.exact.length === 0 &&
              results.partial.length === 0 &&
              results.suggestions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-2xl mb-2">😅</p>
                  <p className="text-muted">
                    К сожалению, "{query}" не найдено в словаре.
                  </p>
                  <p className="text-muted text-sm mt-1">
                    Попробуйте ввести другое слово или проверьте орфографию.
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Пустое состояние */}
        {!results && !query && (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">📖</p>
            <h2 className="text-2xl font-bold text-text mb-2">Начните с поиска</h2>
            <p className="text-muted max-w-sm mx-auto">
              Введите слово румынском или русском языке, чтобы найти перевод, примеры
              использования и произношение.
            </p>

            {/* Популярные слова */}
            <div className="mt-8">
              <p className="text-muted text-sm mb-3">Популярные слова:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['casă', 'carte', 'om', 'a merge', 'bun', 'zi', 'apă'].map(
                  (word) => (
                    <button
                      key={word}
                      onClick={() => handleSelectWord(word)}
                      className={cn(
                        'px-4 py-2 rounded-lg font-medium transition text-sm',
                        'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30'
                      )}
                    >
                      {word}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
