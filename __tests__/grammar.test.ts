import { GRAMMAR_RULES, getGrammarRulesByCategory, getAllGrammarCategories } from '@/lib/grammar';

describe('Grammar Module', () => {
  it('has exactly 28 rules', () => {
    expect(GRAMMAR_RULES.length).toBe(28);
  });

  it('has all required categories', () => {
    const categories = getAllGrammarCategories();
    expect(categories).toContain('articles');
    expect(categories).toContain('verbs');
    expect(categories.length).toBeGreaterThan(5);
  });

  it('filters by category correctly', () => {
    const articles = getGrammarRulesByCategory('articles');
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every(rule => rule.category === 'articles')).toBe(true);
  });

  it('finds rule by ID', () => {
    const rule = GRAMMAR_RULES.find(r => r.id === 'articles-1');
    expect(rule).toBeDefined();
    expect(rule?.title).toContain('артикль');
  });
});

