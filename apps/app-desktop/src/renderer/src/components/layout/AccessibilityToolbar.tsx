import { Accessibility, Minus, Plus, RotateCcw } from "lucide-react";
import { type JSX, useEffect, useState } from "react";

const STORAGE_KEY = "temin_accessibility_font_scale";
const MIN_SCALE = 100;
const MAX_SCALE = 150;
const STEP = 10;

function readInitialScale(): number {
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(stored) && stored >= MIN_SCALE &&
        stored <= MAX_SCALE && stored % STEP === 0
      ? stored
      : 100;
  } catch {
    return 100;
  }
}

export function AccessibilityToolbar(): JSX.Element {
  const [scale, setScale] = useState<number>(readInitialScale);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${16 * scale / 100}px`;
    root.dataset.fontScale = String(scale);

    try {
      localStorage.setItem(STORAGE_KEY, String(scale));
    } catch {
      // Font scaling still works when persistent storage is unavailable.
    }
  }, [scale]);

  return (
    <section
      aria-label="Erişilebilirlik araçları"
      className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1 rounded-xl border border-slate-300 bg-white p-2 text-slate-900 shadow-lg dark:border-slate-600 dark:bg-slate-900 dark:text-white"
    >
      <Accessibility aria-hidden="true" size={18} className="mx-1 shrink-0" />
      <span className="sr-only" aria-live="polite">
        Yazı boyutu yüzde {scale}
      </span>
      <button
        type="button"
        onClick={() =>
          setScale((current) => Math.max(MIN_SCALE, current - STEP))}
        disabled={scale <= MIN_SCALE}
        aria-label="Yazı boyutunu küçült"
        title="Yazı boyutunu küçült"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800"
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <output
        className="min-w-12 text-center text-sm font-semibold tabular-nums"
        aria-label={`Yazı boyutu yüzde ${scale}`}
      >
        {scale}%
      </output>
      <button
        type="button"
        onClick={() =>
          setScale((current) => Math.min(MAX_SCALE, current + STEP))}
        disabled={scale >= MAX_SCALE}
        aria-label="Yazı boyutunu büyüt"
        title="Yazı boyutunu büyüt"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => setScale(100)}
        disabled={scale === 100}
        aria-label="Yazı boyutunu varsayılana döndür"
        title="Varsayılan yazı boyutu"
        className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800"
      >
        <RotateCcw size={15} aria-hidden="true" />
      </button>
    </section>
  );
}
