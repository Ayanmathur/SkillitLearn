"use client";

import { useEffect, useState } from "react";

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="w-full bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 border border-accent/30 rounded-2xl p-4 flex items-center justify-between gap-4 mb-6 animate-fade-in shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="SkillItLearn" className="w-10 h-10 rounded-xl shadow-sm" />
        <div>
          <h4 className="text-sm font-bold text-text-primary">Install SkillItLearn App</h4>
          <p className="text-xs text-text-secondary">
            Get the full app experience on iOS, Android, or PC.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full
                     px-4 py-2 text-xs transition-all shadow-sm"
        >
          Install Now
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="text-text-muted hover:text-text-primary text-xs p-1"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
