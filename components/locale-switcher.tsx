import { useLocale } from "@/components/providers/locale-provider";
import { LOCALES } from "@/lib/i18n";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex gap-2">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${locale === l ? "bg-accent text-slate-950" : "bg-panel text-text"}`}
        >
          {l === "ru" ? "Русский" : "English"}
        </button>
      ))}
    </div>
  );
}
