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
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={cn("bg-gradient-to-r from-teal-400 to-teal-500 transition-all", animated && "duration-500")}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted">{formatPercent(percentage)}% завершено</p>
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
  return (
    <div className={cn("rounded-[24px] border border-line bg-black/10 p-4", className)}>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text">
        {value}
        {unit && <span className="text-lg text-muted">{unit}</span>}
      </p>
      {trend && (
        <p className={cn(
          "mt-1 text-xs font-medium",
          trend === "up" && "text-emerald-500",
          trend === "down" && "text-rose-500",
          trend === "neutral" && "text-amber-500"
        )}>
          {trend === "up" && "↑ растёт"} {trend === "down" && "↓ снижается"} {trend === "neutral" && "→ стабильно"}
        </p>
      )}
    </div>
  );
}