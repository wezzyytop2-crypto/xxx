import { useRef } from "react";
import { useApp } from "@/components/providers/app-provider";
import { useRouter } from "next/navigation";
import { importSetFromAnki } from "@/lib/anki";

export function ImportAnkiButton() {
  const fileInput = useRef<HTMLInputElement>(null);
  const { createSetItem } = useApp();
  const router = useRouter();

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const set = importSetFromAnki(text);
      await createSetItem(set);
      alert("Набор успешно импортирован из Anki!");
      router.push("/");
    } catch {
      alert("Ошибка при импорте файла. Проверьте формат Anki (tab-separated).\nКаждая строка: term<TAB>translation");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
      >
        Импорт из Anki
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="text/plain"
        className="hidden"
        onChange={handleImport}
      />
    </>
  );
}
