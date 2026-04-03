"use client";

import { useCallback, useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "@/components/icons";

export function ExportImport() {
  const { sets, reviews } = useApp();
  const [message, setMessage] = useState<string>("");

  const handleExport = useCallback(async () => {
    const data = {
      sets,
      reviews,
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

    setMessage("✅ Резервная копия сохранена!");
    setTimeout(() => setMessage(""), 3000);
  }, [sets, reviews]);

  return (
    <div className="space-y-3">
      <button
        onClick={handleExport}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-line bg-accent/10 px-4 py-2 text-sm font-medium text-accent",
          "transition hover:bg-accent/20"
        )}
      >
        <DownloadIcon className="h-4 w-4" />
        Экспортировать данные
      </button>
      {message && <p className="text-sm text-emerald-500">{message}</p>}
    </div>
  );
}