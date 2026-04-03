"use client";

import { useEffect, useState } from "react";
import { DownloadIcon } from "@/components/icons";

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    setInstalled(isStandalone);
    setShowIosHint(isIos && !isStandalone);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setInstalled(true);
      setPromptEvent(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function install() {
    if (!promptEvent) {
      return;
    }

    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  }

  if (installed) {
    return <span className="rounded-full border border-line bg-panel px-3 py-2 text-xs text-muted">Установлено</span>;
  }

  if (promptEvent) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent px-3 py-2 text-xs font-semibold text-slate-950 shadow-glow"
      >
        <DownloadIcon className="h-4 w-4" />
        Установить
      </button>
    );
  }

  if (showIosHint) {
    return (
      <span className="rounded-full border border-line bg-panel px-3 py-2 text-[11px] leading-5 text-muted">
        Safari → Поделиться → На экран домой
      </span>
    );
  }

  return <span className="rounded-full border border-line bg-panel px-3 py-2 text-xs text-muted">Offline ready</span>;
}
