'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { AppProvider } from '@/components/providers/app-provider';
import { PwaProvider } from '@/components/providers/pwa-provider';
import { AppShell } from '@/components/app-shell';

export function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Critical app error:', error, errorInfo);
      }}
    >
      <AppProvider>
        <PwaProvider>
          <AppShell>{children}</AppShell>
        </PwaProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
