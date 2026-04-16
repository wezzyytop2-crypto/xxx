"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { GRAMMAR_RULES, getAllGrammarCategories, getGrammarRulesByCategory } from "@/lib/grammar";

export function GrammarRulesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  const categories = getAllGrammarCategories();
  const rules =
    selectedCategory && selectedCategory !== "all"
      ? getGrammarRulesByCategory(selectedCategory as any)
      : GRAMMAR_RULES;

  return (
    <div className="screen-pad flex flex-col gap-6 pb-8">
      <header className="top-safe">
        <p className="section-kicker">Теория</p>
        <h1 className="mt-3 text-[2rem] font-semibold text-text">Грамматика румынского</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Правила, объяснения и примеры на русском. Всё, что нужно знать базово.
        </p>
      </header>

      <div className="glass-panel rounded-[32px] space-y-2 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Категории</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              selectedCategory === "all" || !selectedCategory
                ? "border-accent bg-accent/10 text-accent"
                : "border-line/50 bg-white/5 text-text hover:border-accent/50"
            )}
          >
            Все правила
          </button>
          {categories.map((category) => {
            const categoryLabel: Record<string, string> = {
              articles: "Артикли",
              gender: "Род",
              number: "Число",
              adjectives: "Прилагательные",
              pronouns: "Местоимения",
              verbs: "Глаголы",
              tenses: "Времена",
              negation: "Отрицание",
              questions: "Вопросы",
              "word-order": "Порядок слов",
              possessives: "Притяжание",
              numerals: "Числа",
              comparison: "Сравнение",
              particles: "Частицы",
              expressions: "Выражения"
            };

            return (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(selectedCategory === category ? "all" : category)
                }
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition",
                  selectedCategory === category
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-line/50 bg-white/5 text-text hover:border-accent/50"
                )}
              >
                {categoryLabel[category] || category}
              </button>
            );
          })}
        </div>
      </div>

      <section className="space-y-3">
        {rules.length === 0 ? (
          <div className="glass-panel rounded-[32px] p-6 text-center">
            <h3 className="text-lg font-semibold text-text">Нет правил</h3>
            <p className="mt-2 text-sm text-muted">Выбери другую категорию.</p>
          </div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="surface-card rounded-[28px] p-4">
              <button
                onClick={() =>
                  setExpandedRuleId(expandedRuleId === rule.id ? null : rule.id)
                }
                className="flex w-full items-start justify-between gap-3 text-left transition hover:opacity-80"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text">{rule.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{rule.descriptionRu}</p>
                </div>
                <span
                  className={cn(
                    "mt-1 flex-shrink-0 text-accent transition",
                    expandedRuleId === rule.id ? "rotate-180" : ""
                  )}
                >
                  <ChevronDownIcon className="h-5 w-5" />
                </span>
              </button>

              {expandedRuleId === rule.id && (
                <div className="mt-4 space-y-4 border-t border-line/20 pt-4">
                  <div className="space-y-3">
                    {rule.examples.map((example, idx) => (
                      <div key={idx} className="rounded-lg bg-white/5 p-3">
                        <p className="text-sm font-semibold text-accent">{example.romanian}</p>
                        <p className="mt-1 text-sm text-text">{example.russian}</p>
                        {/* explanation отсутствует в данных, поэтому не отображаем */}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      💡 Совет
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text">{rule.tip}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
