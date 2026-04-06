"use client";

import { useCallback, useRef, useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import type { CardDraft, SaveSetInput } from "@/lib/types";
import { cn, isValidPartOfSpeech } from "@/lib/utils";

export function BulkImportCSV() {
  const { createSetItem } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setLoading(true);
      try {
        const text = await file.text();
        const lines = text.split("\n").filter(line => line.trim());
        
        // Ожидаемый формат: term,translation,example,note,partOfSpeech
        const cards: CardDraft[] = [];
        const errors: string[] = [];
        
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          const line = lines[lineIndex];
          const parts = line.split(",").map(s => s.trim());
          
          // Валидация минимальных требований
          if (parts.length < 2) {
            errors.push(`Строка ${lineIndex + 1}: недостаточно полей (мин. 2: term,translation)`);
            continue;
          }
          
          const [term, translation, example = "", note = "", partOfSpeechRaw = "noun"] = parts;
          
          // Валидация term и translation
          if (!term) {
            errors.push(`Строка ${lineIndex + 1}: пустое слово`);
            continue;
          }
          if (!translation) {
            errors.push(`Строка ${lineIndex + 1}: пустой перевод`);
            continue;
          }
          
          // Валидация partOfSpeech с type guard
          const partOfSpeech = isValidPartOfSpeech(partOfSpeechRaw) 
            ? partOfSpeechRaw 
            : "noun";
          
          if (!isValidPartOfSpeech(partOfSpeechRaw) && partOfSpeechRaw !== "noun") {
            errors.push(`Строка ${lineIndex + 1}: неизвестный тип слова "${partOfSpeechRaw}" (использовано "noun")`);
          }
          
          cards.push({
            term,
            translation,
            example,
            note,
            partOfSpeech
          });
        }

        if (cards.length === 0) {
          const errorText = errors.length > 0 
            ? `❌ Не найдено валидных слов. Ошибки:\n${errors.slice(0, 3).join("\n")}`
            : "❌ Не найдено валидных слов в файле";
          setMessage({ type: "error", text: errorText });
          return;
        }

        const setTitle = file.name.replace(".csv", "") || "Импортированный набор";
        const input: SaveSetInput = {
          title: setTitle,
          description: `Импортировано ${cards.length} слов из файла${errors.length > 0 ? ` (${errors.length} ошибок исправлено)` : ""}`,
          color: "teal",
          cards
        };

        await createSetItem(input);
        const successMsg = `✅ Импортировано ${cards.length} слов!${errors.length > 0 ? ` (${errors.length} строк с предупреждениями)` : ""}`;
        setMessage({ type: "success", text: successMsg });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error("CSV import error:", error);
        const errorMsg = error instanceof Error 
          ? `❌ Ошибка при загрузке файла: ${error.message}`
          : "❌ Ошибка при загрузке файла";
        setMessage({ type: "error", text: errorMsg });
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [createSetItem]
  );

  return (
    <div className="space-y-3">
      <div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-line bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400",
            "transition hover:bg-indigo-500/20 disabled:opacity-50"
          )}
        >
          📥 Импортировать из CSV
        </button>
        <p className="mt-2 text-xs text-muted">Формат: term,translation,example,note,partOfSpeech</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImport}
        className="hidden"
      />
      {message && (
        <p className={cn(
          "text-sm whitespace-pre-line",
          message.type === "success" ? "text-emerald-500" : "text-rose-500"
        )}>
          {message.text}
        </p>
      )}
    </div>
  );
}