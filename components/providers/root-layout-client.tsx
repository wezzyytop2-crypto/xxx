"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AppProvider } from "@/components/providers/app-provider";
import { PwaProvider } from "@/components/providers/pwa-provider";
import { useAuthStore } from "@/lib/stores/authStore";

export function RootLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user, hydrateSession, resolveNextPath } = useAuthStore();
  const isLoginRoute = pathname === "/login";

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (!user && !isLoginRoute) {
      const currentSearch = typeof window !== "undefined" ? window.location.search : "";
      const requestedPath = resolveNextPath(`${pathname}${currentSearch}`);

      router.replace(`/login?next=${encodeURIComponent(requestedPath)}`);
      return;
    }

    if (user && isLoginRoute) {
      const nextPath =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;

      router.replace(resolveNextPath(nextPath));
    }
  }, [isLoginRoute, pathname, ready, resolveNextPath, router, user]);

  const shouldShowProtectedApp = ready && user && !isLoginRoute;
  const shouldShowLogin = ready && isLoginRoute;

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("Critical app error:", error, errorInfo);
      }}
    >
      <PwaProvider>
        {!ready || (!shouldShowProtectedApp && !shouldShowLogin) ? (
          <LoadingSpinner className="min-h-dvh" />
        ) : null}

        {shouldShowLogin ? children : null}

        {shouldShowProtectedApp ? (
          <AppProvider key={user.id} userId={user.id}>
            <AppShell>{children}</AppShell>
          </AppProvider>
        ) : null}
      </PwaProvider>
    </ErrorBoundary>
  );
}
