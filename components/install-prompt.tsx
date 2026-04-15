"use client";

import { useEffect, useState } from 'react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
      setDeferredPrompt(null);
    }
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 transform gap-3 rounded-2xl bg-accent/95 px-6 py-4 shadow-2xl backdrop-blur-sm">
      <div>
        <h3 className="font-semibold text-slate-950">Установить приложение</h3>
        <p className="mt-1 text-sm text-slate-800">Добавь на главный экран для оффлайн</p>
      </div>
      <div className="flex gap-2">
        <button onClick={handleInstall} className="primary-action px-4 py-2 text-slate-950">
          Установить
        </button>
        <button onClick={() => setShowInstall(false)} className="px-4 py-2 text-slate-800">
          Позже
        </button>
      </div>
    </div>
  );
}

