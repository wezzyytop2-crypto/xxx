"use client";

import { useApp } from "@/components/providers/app-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatsPage() {
  const { appStats, sets } = useApp();

  const chartData = [
    { name: 'Должно', value: appStats.dueCards },
    { name: 'Освоено', value: appStats.masteredCards },
    { name: 'Сегодня', value: appStats.reviewsToday }
  ];

  return (
    <div className="screen-pad flex flex-col gap-6 pb-8">
      <header>
        <h1 className="text-3xl font-semibold text-text">Статистика</h1>
        <p className="mt-2 text-muted">Твой прогресс по изучению</p>
      </header>

      <div className="glass-panel rounded-[32px] p-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">{appStats.reviewsToday}</div>
            <div className="mt-1 text-sm text-muted">Сегодня</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-500">{appStats.dueCards}</div>
            <div className="mt-1 text-sm text-muted">К повтору</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-sky-500">{appStats.level}</div>
            <div className="mt-1 text-sm text-muted">Уровень</div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[32px] p-6">
        <h2 className="text-xl font-semibold mb-4">Прогресс по категориям</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

