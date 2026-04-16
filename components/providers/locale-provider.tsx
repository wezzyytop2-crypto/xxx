"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { LOCALES, Locale } from "@/lib/i18n";

const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({
  locale: "ru",
  setLocale: () => {}
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ru");

  useEffect(() => {
    const stored = localStorage.getItem("limbi-locale");
    if (stored && LOCALES.includes(stored as Locale)) {
      setLocale(stored as Locale);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("limbi-locale", locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
