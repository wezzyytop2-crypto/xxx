"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

export function PwaProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    async function registerWorker() {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/"
        });

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;

          if (!installing) {
            return;
          }

          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              installing.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      } catch {
        // Silent fallback: the app still works online without PWA registration.
      }
    }

    void registerWorker();
  }, []);

  return <>{children}</>;
}
