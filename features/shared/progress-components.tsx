"use client";

import { cn, formatPercent } from "@/lib/utils";

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  animated = true,
  className = ""
}: {
  value: number;
  max?: number;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className={cn(
            "rounded-full bg-gradient-to-r from-accent via-accentStrong to-spot transition-all",
            animated && "duration-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted">{formatPercent(percentage)} завершено</p>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  unit = "",
  trend,
  className = ""
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  const trendClassName =
    trend === "up" ? "text-success" : trend === "down" ? "text-danger" : trend === "neutral" ? "text-warning" : "";

  const trendLabel =
    trend === "up" ? "Растет" : trend === "down" ? "Снижается" : trend === "neutral" ? "Стабильно" : null;

  return (
    <div className={cn("metric-tile space-y-2", className)}>
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="text-[1.85rem] font-semibold leading-none text-text">
        {value}
        {unit && <span className="text-lg text-muted">{unit}</span>}
      </p>
      {trendLabel ? (
        <p className={cn("text-xs font-semibold uppercase tracking-[0.14em]", trendClassName)}>
          {trendLabel}
        </p>
      ) : null}
    </div>
  );
}
