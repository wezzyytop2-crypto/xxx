import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { RootLayoutClient } from "@/components/providers/root-layout-client";
import { LocaleProvider } from "@/components/providers/locale-provider";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "LIMBI";
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-sans"
});

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
  themeColor: "#f7f3ea"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${manrope.variable} antialiased`}>
        <LocaleProvider>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </LocaleProvider>
      </body>
    </html>
  );
}
