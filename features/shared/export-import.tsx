"use client";

import { useCallback, useRef, useState } from "react";
import { DownloadIcon, UploadIcon } from "@/components/icons";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";
import { exportSetToAnki } from "@/lib/anki";
import { ImportAnkiButton } from "@/components/import-anki-button";

function escapeCsv(value: string) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

export function ExportImport() {
  const { sets, reviews, progressByCard, importBackupData } = useApp();
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [ankiExportStatus, setAnkiExportStatus] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = useCallback(async () => {
    const data = {
      sets,
      reviews,
      progress: Object.values(progressByCard),
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `limbi-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage("Резервная копия сохранена.");
    setError("");
    setTimeout(() => setMessage(""), 3000);
  }, [sets, reviews, progressByCard]);

  const handleExportCsv = useCallback(() => {
    const rows = [
      ["Набор", "Румынский", "Русский", "Пример", "Заметка", "Часть речи"]
    ];

    for (const set of sets) {
      for (const card of set.cards) {
        rows.push([
          set.title,
          card.term,
          card.translation,
          card.example,
          card.note,
          card.partOfSpeech
        ]);
      }
    }

    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `limbi-cards-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage("CSV-файл создан.");
    setError("");
    setTimeout(() => setMessage(""), 3000);
  }, [sets]);

  const handleImport = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed?.sets || !Array.isArray(parsed.sets)) {
        throw new Error("Файл не содержит действительных наборов.");
      }

      if (!parsed?.reviews || !Array.isArray(parsed.reviews)) {
        throw new Error("Файл не содержит действительных отзывов.");
      }

      await importBackupData({
        sets: parsed.sets,
        reviews: parsed.reviews,
        progress: Array.isArray(parsed.progress) ? parsed.progress : []
      });

      setMessage("Данные успешно импортированы.");
      setError("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось импортировать файл.";
      setError(message);
      setMessage("");
    }
  }, [importBackupData]);

  const handleExportAnki = useCallback((setId: string) => {
    const set = sets.find(s => s.id === setId);
    if (!set) return;
    const anki = exportSetToAnki(set);
    const blob = new Blob([anki], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${set.title || "set"}.anki.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setAnkiExportStatus(`Экспортировано в Anki: ${set.title}`);
    setTimeout(() => setAnkiExportStatus(""), 3000);
  }, [sets]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={handleExport}
          className={cn(
            "primary-action inline-flex w-full items-center justify-center gap-2 rounded-[24px] px-4 py-3.5 text-sm font-semibold text-slate-950",
            "transition"
          )}
        >
          <DownloadIcon className="h-4 w-4" />
          Экспорт JSON
        </button>
        <button
          type="button"
          onClick={handleExportCsv}
          className={cn(
            "primary-action inline-flex w-full items-center justify-center gap-2 rounded-[24px] px-4 py-3.5 text-sm font-semibold text-slate-950",
            "transition"
          )}
        >
          <DownloadIcon className="h-4 w-4" />
          Экспорт CSV
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "secondary-action inline-flex w-full items-center justify-center gap-2 rounded-[24px] px-4 py-3.5 text-sm font-semibold text-text",
            "transition"
          )}
        >
          <UploadIcon className="h-4 w-4" />
          Импорт JSON
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleImport(file);
          }
        }}
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <ImportAnkiButton />
        {sets.map(set => (
          <button
            key={set.id}
            type="button"
            onClick={() => handleExportAnki(set.id)}
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
          >
            Экспорт в Anki: {set.title}
          </button>
        ))}
      </div>
      {ankiExportStatus && (
        <div className="mt-2 rounded bg-accent px-4 py-2 text-slate-950">{ankiExportStatus}</div>
      )}
      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
