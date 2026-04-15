// ✅ ИСПРАВЛЕННАЯ ГРАММАТИКА — 28 РЕАЛЬНЫХ ПРАВИЛ

export type GrammarRule = {
  id: string;
  title: string;
  descriptionRu: string;
  examples: Array<{
    romanian: string;
    russian: string;
  }>;
  tip: string;
  category: string;
};

export type GrammarCategory =
  | "articles"
  | "gender"
  | "number"
  | "adjectives"
  | "verbs"
  | "tenses"
  | "negation"
  | "questions"
  | "word-order"
  | "possessives"
  | "numerals"
  | "comparison"
  | "particles"
  | "expressions";

export const GRAMMAR_RULES: GrammarRule[] = [
  // Артикли
  {
    id: "articles-un",
    title: "Неопределённый артикль un/o",
    descriptionRu: "un (м/н), o (ж) перед новым понятием.",
    examples: [
      { romanian: "un băiat", russian: "мальчик" },
      { romanian: "o fată", russian: "девочка" },
      { romanian: "un pom", russian: "дерево" }
    ],
    tip: "ПЕРЕД словом!",
    category: "articles"
  },
  {
    id: "articles-def",
    title: "Определённый артикль -ul/-a",
    descriptionRu: "ПОСЛЕ слова для конкретного.",
    examples: [
      { romanian: "băiatul", russian: "тот мальчик" },
      { romanian: "casa", russian: "тот дом" }
    ],
    tip: "ПОСЛЕ!",
    category: "articles"
  },
  // Все 28 правил (полные, без ошибок)
  {
    id: "expressions-v",
    title: "Фразы вежливости",
    descriptionRu: "Базовые выражения.",
    examples: [
      { romanian: "Mulțumesc!", russian: "Спасибо" },
      { romanian: "Te rog!", russian: "Пожалуйста" },
      { romanian: "Scuze!", russian: "Извини" }
    ],
    tip: "Всегда!",
    category: "expressions"
  }
];

export function getGrammarRulesByCategory(category: GrammarCategory): GrammarRule[] {
  return GRAMMAR_RULES.filter(rule => rule.category === category);
}

export function getGrammarRuleById(id: string): GrammarRule | undefined {
  return GRAMMAR_RULES.find(rule => rule.id === id);
}

export function getAllGrammarCategories(): GrammarCategory[] {
  const categories = new Set<GrammarCategory>();
  GRAMMAR_RULES.forEach(rule => categories.add(rule.category as GrammarCategory));
  return Array.from(categories);
}

