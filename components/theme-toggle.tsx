"use client";

import { useEffect, useState, useRef } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
const STORAGE_KEY = "limbi-theme";


function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}


export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);
  const userSelected = useRef(false);

  useEffect(() => {
    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
    setMounted(true);
    // Слушаем смену системной темы, если пользователь не выбирал вручную
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!userSelected.current && !window.localStorage.getItem(STORAGE_KEY)) {
        const sysTheme = media.matches ? "dark" : "light";
        setTheme(sysTheme);
        document.documentElement.dataset.theme = sysTheme;
      }
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.theme = theme;
    if (userSelected.current) {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [mounted, theme]);

  const handleToggle = () => {
    userSelected.current = true;
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel/80 text-text shadow-card transition duration-200 hover:bg-white/20",
        className
      )}
      aria-label="Переключить тему"
      aria-pressed={theme === "dark"}
    >
      {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
