import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-5 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-line bg-panel/90 text-3xl shadow-card">
        ă
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-text">Оффлайн-режим активен</h1>
        <p className="max-w-xs text-sm leading-6 text-muted">
          Если нужная страница уже открывалась раньше, приложение продолжит работать без сети и сохранит прогресс на
          устройстве.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium text-text transition hover:border-accent/40 hover:bg-panel"
      >
        На главный экран
      </Link>
    </div>
  );
}
