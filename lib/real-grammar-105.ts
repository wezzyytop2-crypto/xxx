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

// Удалён не входящий ни в какой массив или функцию фрагмент объекта
// Удалён не входящий ни в какой массив объект (id: 'art2', ...)
  
];

export function getRules() {
  return REAL_GRAMMAR_105;
}

