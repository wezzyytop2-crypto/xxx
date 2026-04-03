"use client";

import { useCallback, useRef, useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import type { CardDraft, SaveSetInput } from "@/lib/types";
import { cn } from "@/lib/utils";

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
        
        for (const line of lines) {
          const [term, translation, example = "", note = "", partOfSpeech = "noun"] = line.split(",").map(s => s.trim());
          
          if (!term || !translation) continue;
          
          cards.push({
            term,
            translation,
            example,
            note,
            partOfSpeech: (partOfSpeech as any) || "noun"
          });
        }

        if (cards.length === 0) {
          setMessage({ type: "error", text: "❌ Не найдено валидных слов в файле" });
          return;
        }

        const setTitle = file.name.replace(".csv", "") || "Импортированный набор";
        const input: SaveSetInput = {
          title: setTitle,
          description: `Импортировано ${cards.length} слов из файла`,
          color: "teal",
          cards
        };

        await createSetItem(input);
        setMessage({ type: "success", text: `✅ Импортировано ${cards.length} слов!` });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        setMessage({ type: "error", text: "❌ Ошибка при загрузке файла" });
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
          "text-sm",
          message.type === "success" ? "text-emerald-500" : "text-rose-500"
        )}>
          {message.text}
        </p>
      )}
    </div>
  );
}