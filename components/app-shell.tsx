"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideNav = !mounted || pathname.includes("/study") || pathname.includes("/edit") || pathname === "/sets/new";

  return (
    <div className="min-h-dvh bg-transparent">
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[-10rem] z-0 mx-auto h-[24rem] max-w-[34rem] rounded-full bg-accent/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none fixed bottom-[-12rem] left-1/2 z-0 h-[22rem] w-[26rem] -translate-x-1/2 rounded-full bg-spot/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-dvh max-w-[30rem] flex-col">
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>
        <main className={hideNav ? "flex-1 px-4" : "flex-1 px-4 pb-24"}>{children}</main>
        {!hideNav ? <BottomNav /> : null}
      </div>
    </div>
  );
}
