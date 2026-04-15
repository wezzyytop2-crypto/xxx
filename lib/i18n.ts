// lib/i18n.ts
export const LOCALES = ["ru", "en"] as const;
export type Locale = typeof LOCALES[number];

export const translations: Record<string, Record<Locale, string>> = {
  "app.title": {
    ru: "LIMBI — Румынский тренажёр",
    en: "LIMBI — Romanian Trainer"
  },
  "button.save": {
    ru: "Сохранить",
    en: "Save"
  },
  "button.cancel": {
    ru: "Отмена",
    en: "Cancel"
  },
  "button.share": {
    ru: "Поделиться",
    en: "Share"
  },
  "onboarding.welcome": {
    ru: "Добро пожаловать в LIMBI!",
    en: "Welcome to LIMBI!"
  },
  // ...добавлять ключи по мере необходимости
};

export function t(key: string, locale: Locale = "ru"): string {
  return translations[key]?.[locale] || translations[key]?.ru || key;
}
