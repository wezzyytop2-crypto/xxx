"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.includes("/study") || pathname.includes("/edit") || pathname === "/sets/new";

  return (
    <div className="min-h-dvh bg-transparent">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col">
        <main className={hideNav ? "flex-1 px-4" : "flex-1 px-4 pb-24"}>{children}</main>
        {!hideNav ? <BottomNav /> : null}
      </div>
    </div>
  );
}
