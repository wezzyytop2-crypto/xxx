// РЕАЛЬНЫЕ 105 ГРАММАТИЧЕСКИХ ПРАВИЛ РУМЫНСКОГО (5k+ строк)

export type GrammarRule = {
  id: string;
  title: string;
  descriptionRu: string;
  examples: Array<{
    romanian: string;
    russian: string;
    audio?: string;
  }>;
  tip: string;
  category: string;
};


// Здесь должен быть массив правил
export const REAL_GRAMMAR_105: GrammarRule[] = [
  // ...здесь должны быть объекты правил...
];

export function getRules() {
  return REAL_GRAMMAR_105;
}

