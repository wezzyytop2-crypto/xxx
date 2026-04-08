"use client";

import React, { ReactNode } from "react";
import { CloseIcon, OfflineIcon, RefreshIcon, TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error, this.reset);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} onReset={this.reset} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-[36px] p-6 text-center">
        <div className="accent-ring mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-danger/25 bg-danger/10 text-danger">
          <CloseIcon className="h-7 w-7" />
        </div>

        <p className="section-kicker mt-5">Recovery</p>
        <h2 className="mt-3 text-2xl font-semibold text-text">Что-то пошло не так</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Приложение столкнулось с ошибкой. Обычно помогает повторить попытку или вернуться на главный экран.
        </p>

        {process.env.NODE_ENV === "development" ? (
          <div className="mt-5 rounded-[24px] border border-danger/20 bg-danger/10 p-3 text-left">
            <p className="text-xs font-mono break-words text-danger">{error.message}</p>
            {error.stack ? <pre className="mt-2 max-h-32 overflow-auto text-xs text-danger/80">{error.stack}</pre> : null}
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onReset}
            className={cn("primary-action inline-flex items-center justify-center gap-2 rounded-[24px] px-4 py-3 text-sm font-semibold text-slate-950")}
          >
            <RefreshIcon className="h-4 w-4" />
            Повторить
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="secondary-action inline-flex items-center justify-center rounded-[24px] px-4 py-3 text-sm font-semibold text-text"
          >
            На главную
          </button>
        </div>

        <p className="mt-4 text-xs leading-5 text-muted">Если проблема повторяется, можно очистить локальные данные и перезапустить приложение.</p>
      </div>
    </div>
  );
}

export function ErrorScreenWithDataReset({
  error,
  onReset
}: {
  error: Error;
  onReset: () => void;
}) {
  const [isClearing, setIsClearing] = React.useState(false);

  const handleClearData = async () => {
    setIsClearing(true);

    try {
      const databases = await window.indexedDB.databases();

      for (const db of databases) {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      }

      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error("Failed to clear data:", err);
      setIsClearing(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-[36px] p-6 text-center">
        <div className="accent-ring mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-danger/25 bg-danger/10 text-danger">
          <TrashIcon className="h-7 w-7" />
        </div>

        <p className="section-kicker mt-5">Critical State</p>
        <h2 className="mt-3 text-2xl font-semibold text-text">Нужен сброс данных</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Похоже, локальное хранилище повреждено или вернуло неожиданные данные. Можно попробовать перезапуск или полную очистку.
        </p>

        {process.env.NODE_ENV === "development" ? (
          <div className="mt-5 rounded-[24px] border border-danger/20 bg-danger/10 p-3 text-left">
            <p className="text-xs font-mono break-words text-danger">{error.message}</p>
          </div>
        ) : null}

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={onReset}
            className="primary-action inline-flex w-full items-center justify-center gap-2 rounded-[24px] px-4 py-3 text-sm font-semibold text-slate-950"
          >
            <RefreshIcon className="h-4 w-4" />
            Попробовать снова
          </button>

          <button
            type="button"
            onClick={handleClearData}
            disabled={isClearing}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-[24px] border border-danger/25 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger transition",
              isClearing ? "cursor-not-allowed opacity-50" : "hover:bg-danger/15"
            )}
          >
            <TrashIcon className="h-4 w-4" />
            {isClearing ? "Очистка..." : "Очистить данные и перезапустить"}
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/offline";
            }}
            className="secondary-action inline-flex w-full items-center justify-center gap-2 rounded-[24px] px-4 py-3 text-sm font-semibold text-text"
          >
            <OfflineIcon className="h-4 w-4 text-accent" />
            Автономный режим
          </button>
        </div>
      </div>
    </div>
  );
}
