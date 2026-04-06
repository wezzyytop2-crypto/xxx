import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { AppProvider } from "@/components/providers/app-provider";
import { PwaProvider } from "@/components/providers/pwa-provider";
import { ErrorBoundary, ErrorScreenWithDataReset } from "@/components/error-boundary";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "LIMBI";

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`
  },
  description: "Локальное PWA для ежедневного изучения румынского языка через карточки, повторения и письменные упражнения.",
  applicationName: appName,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: appName
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#07111f"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorScreenWithDataReset error={error} onReset={reset} />
          )}
          onError={(error, errorInfo) => {
            console.error('Critical app error:', error, errorInfo);
            // Здесь можно отправить ошибку на сервер логирования
          }}
        >
          <AppProvider>
            <PwaProvider>
              <AppShell>{children}</AppShell>
            </PwaProvider>
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
