import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full border border-line bg-panel px-4 py-2 text-xs uppercase tracking-[0.24em] text-accent">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-text">Экран не найден</h1>
        <p className="max-w-xs text-sm leading-6 text-muted">
          Возможно, набор был удалён или ссылка устарела. Возвращайся на главный экран и продолжай учить слова.
        </p>
      </div>
      <Link href="/" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950">
        Домой
      </Link>
    </div>
  );
}
