'use client';

import { cn } from '@/lib/utils';

/**
 * Спинер загрузки для отображения при загрузке компонентов
 */
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn(
      'flex items-center justify-center p-8',
      className
    )}>
      <div className="space-y-4 text-center">
        <div className="inline-flex">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-muted text-sm">Загрузка...</p>
      </div>
    </div>
  );
}
