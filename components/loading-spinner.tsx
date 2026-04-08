'use client';

import { cn } from '@/lib/utils';

/**
 * Спинер загрузки для отображения при загрузке компонентов
 */
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="space-y-4 text-center">
        <div className="inline-flex rounded-full border border-line/80 bg-white/5 p-4">
          <div className="h-8 w-8 rounded-full border-4 border-accent/15 border-t-accent animate-spin" />
        </div>
        <p className="text-muted text-sm">Загрузка...</p>
      </div>
    </div>
  );
}
