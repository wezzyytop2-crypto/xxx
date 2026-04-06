'use client';

import React, { useState } from 'react';
import type { DictionaryEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSpeech } from '@/lib/hooks/useSpeech';

interface DictionaryCardProps {
  entry: DictionaryEntry;
  direction: 'ro-ru' | 'ru-ro';
  onSelectWord?: (romanian: string) => void;
}

/**
 * Компонент для отображения одного слова из словаря
 */
export function DictionaryCard({
  entry,
  direction,
  onSelectWord
}: DictionaryCardProps) {
  const [showExamples, setShowExamples] = useState(false);
  const { speak, speaking } = useSpeech();

  const sourceWord = direction === 'ro-ru' ? entry.romanian : entry.russian;
  const targetWord = direction === 'ro-ru' ? entry.russian : entry.romanian;

  const handleSpeak = async () => {
    try {
      await speak(entry.romanian);
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  return (
    <div className="border border-line rounded-lg p-4 mb-3 bg-panel hover:bg-panel/80 transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-2xl font-bold text-text">{sourceWord}</h3>
          {entry.ipa && (
            <p className="text-muted text-sm font-mono">
              /{entry.ipa}/
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs font-medium">
            {capitalize(entry.partOfSpeech)}
          </span>
          {entry.frequency && (
            <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs font-medium">
              ★ {entry.frequency}/5
            </span>
          )}
        </div>
      </div>

      {/* Основной перевод */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3 mb-3">
        <p className="text-sm text-muted mb-1">Перевод:</p>
        <p className="text-xl font-semibold text-text">{targetWord}</p>
      </div>

      {/* Род (если есть) */}
      {entry.gender && (
        <p className="text-sm text-muted mb-2">
          Род: <span className="text-text font-medium">
            {genderLabel(entry.gender)}
          </span>
        </p>
      )}

      {/* Примеры использования */}
      {entry.examples && entry.examples.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="text-indigo-400 hover:text-indigo-300 text-sm underline font-medium"
          >
            {showExamples ? '▼' : '▶'} Примеры ({entry.examples.length})
          </button>

          {showExamples && (
            <div className="mt-2 space-y-2">
              {entry.examples.map((example, i) => (
                <div key={i} className="bg-bg-secondary rounded p-2 border border-line">
                  <p className="italic text-text mb-1">{example.romanian}</p>
                  <p className="text-muted text-sm">{example.russian}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Синонимы */}
      {entry.synonyms && entry.synonyms.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-muted mb-1">Синонимы:</p>
          <div className="flex flex-wrap gap-2">
            {entry.synonyms.map((synonym, i) => (
              <button
                key={i}
                onClick={() => onSelectWord?.(synonym)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition',
                  'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                )}
              >
                {synonym}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка произнесения */}
      {direction === 'ro-ru' && (
        <button
          onClick={handleSpeak}
          disabled={speaking}
          className={cn(
            'w-full py-2 px-3 rounded-lg font-medium transition text-sm mt-3',
            'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {speaking ? '🔊 Воспроизведение...' : '🔊 Произнесение'}
        </button>
      )}
    </div>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function genderLabel(gender: 'm' | 'f' | 'n'): string {
  const labels = {
    m: 'Мужской',
    f: 'Женский',
    n: 'Средний'
  };
  return labels[gender];
}
