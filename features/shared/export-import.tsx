"use client";

import { useCallback, useState } from "react";
import { DownloadIcon } from "@/components/icons";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

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

    setMessage("Резервная копия сохранена.");
    setTimeout(() => setMessage(""), 3000);
  }, [sets, reviews]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleExport}
        className={cn(
          "primary-action inline-flex w-full items-center justify-center gap-2 rounded-[24px] px-4 py-3.5 text-sm font-semibold text-slate-950",
          "transition"
        )}
      >
        <DownloadIcon className="h-4 w-4" />
        Экспортировать данные
      </button>
      {message ? <p className="text-sm text-success">{message}</p> : null}
    </div>
  );
}
