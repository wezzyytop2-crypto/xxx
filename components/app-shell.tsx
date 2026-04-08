"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.includes("/study") || pathname.includes("/edit") || pathname === "/sets/new";

  return (
    <div className="min-h-dvh bg-transparent">
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[-10rem] z-0 mx-auto h-[24rem] max-w-[34rem] rounded-full bg-accent/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none fixed bottom-[-12rem] left-1/2 z-0 h-[22rem] w-[26rem] -translate-x-1/2 rounded-full bg-spot/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-dvh max-w-[30rem] flex-col">
        <main className={hideNav ? "flex-1 px-4" : "flex-1 px-4 pb-24"}>{children}</main>
        {!hideNav ? <BottomNav /> : null}
      </div>
    </div>
  );
}
