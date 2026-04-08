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
    return <span className="pill-tag text-xs">Установлено</span>;
  }

  if (promptEvent) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="primary-action inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-slate-950"
      >
        <DownloadIcon className="h-4 w-4" />
        Установить
      </button>
    );
  }

  if (showIosHint) {
    return (
      <span className="pill-tag text-[11px] leading-5">
        Safari → Поделиться → На экран домой
      </span>
    );
  }

  return <span className="pill-tag text-xs">Offline ready</span>;
}
