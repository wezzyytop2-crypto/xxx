'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary, ErrorScreenWithDataReset } from '@/components/error-boundary';

interface ErrorBoundaryProviderProps {
  children: ReactNode;
}

export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <ErrorScreenWithDataReset error={error} onReset={reset} />
      )}
      onError={(error, errorInfo) => {
        console.error('Critical app error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
