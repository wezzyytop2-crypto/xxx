import { useRef } from "react";
import { useApp } from "@/components/providers/app-provider";
import { useRouter } from "next/navigation";

export function ImportSetButton() {
  const fileInput = useRef<HTMLInputElement>(null);
  const { createSetItem } = useApp();
  const router = useRouter();

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const set = JSON.parse(text);
      await createSetItem({
        title: set.title || "Импортированный набор",
        description: set.description || "",
        color: set.color || "teal",
        cards: set.cards || []
      });
      alert("Набор успешно импортирован!");
      router.push("/");
    } catch {
      alert("Ошибка при импорте файла. Проверьте формат JSON.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
      >
        Импортировать набор
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />
    </>
  );
}
