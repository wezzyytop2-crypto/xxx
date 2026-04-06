'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary компонент для перехвата ошибок React компонентов
 * Обрабатывает критические ошибки и показывает UI для восстановления
 * @example
 * <ErrorBoundary 
 *   fallback={<ErrorScreen onReset={() => window.location.reload()} />}
 *   onError={(error) => console.error('App error:', error)}
 * >
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
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

/**
 * Дефолтный экран ошибки
 */
function DefaultErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bg to-bg-secondary p-4">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-2">⚠️</h1>
          <h2 className="text-2xl font-bold text-text mb-2">Что-то пошло не так</h2>
          <p className="text-muted mb-4">
            К сожалению, приложение столкнулось с ошибкой. Пожалуйста, попробуйте перезагрузить страницу.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
            <p className="text-xs font-mono text-rose-400 break-words">
              {error.message}
            </p>
            {error.stack && (
              <pre className="text-xs text-rose-300/70 mt-2 overflow-auto max-h-32">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onReset}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg font-medium transition",
              "bg-indigo-500 text-white hover:bg-indigo-600"
            )}
          >
            Попробовать снова
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg font-medium transition",
              "bg-panel text-text border border-line hover:bg-panel/80"
            )}
          >
            На главную
          </button>
        </div>

        <p className="text-xs text-muted text-center">
          Если проблема повторяется, попробуйте очистить локальные данные в браузере.
        </p>
      </div>
    </div>
  );
}

/**
 * Ошибка с опцией сброса иденских данных
 */
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
      // Очищаем IndexedDB
      const dbs = await window.indexedDB.databases();
      for (const db of dbs) {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      }
      // Очищаем localStorage
      localStorage.clear();
      sessionStorage.clear();
      // Перезагружаем
      window.location.reload();
    } catch (err) {
      console.error('Failed to clear data:', err);
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bg to-bg-secondary p-4">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-2">🔴</h1>
          <h2 className="text-2xl font-bold text-text mb-2">Критическая ошибка</h2>
          <p className="text-muted mb-4">
            Не удалось загрузить приложение. Это может быть проблемой с хранилищем данных.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
            <p className="text-xs font-mono text-rose-400 break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={onReset}
            className={cn(
              "w-full py-2 px-4 rounded-lg font-medium transition",
              "bg-indigo-500 text-white hover:bg-indigo-600"
            )}
          >
            Попробовать снова
          </button>
          <button
            onClick={handleClearData}
            disabled={isClearing}
            className={cn(
              "w-full py-2 px-4 rounded-lg font-medium transition",
              "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30",
              isClearing && "opacity-50 cursor-not-allowed"
            )}
          >
            {isClearing ? '⏳ Очистка...' : '🗑️ Очистить данные и перезагрузить'}
          </button>
          <button
            onClick={() => window.location.href = '/offline'}
            className={cn(
              "w-full py-2 px-4 rounded-lg font-medium transition",
              "bg-panel text-text border border-line hover:bg-panel/80"
            )}
          >
            Автономный режим
          </button>
        </div>

        <p className="text-xs text-muted text-center">
          Если проблема после очистки данных, пожалуйста, свяжитесь с поддержкой.
        </p>
      </div>
    </div>
  );
}
