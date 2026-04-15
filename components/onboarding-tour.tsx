import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ONBOARDING_KEY = "onboardingComplete";

const steps = [
  {
    title: "Добро пожаловать в LIMBI!",
    text: "Это локальный тренажёр для румынского языка. Все данные только на вашем устройстве.",
  },
  {
    title: "Три режима обучения",
    text: "Используйте Flashcards для быстрого повторения, Learn для сложных слов, Write для активной практики.",
  },
  {
    title: "Геймификация и статистика",
    text: "Зарабатывайте XP, повышайте уровень, следите за прогрессом и экспортируйте данные.",
  },
  {
    title: "Импорт и резервные копии",
    text: "Добавляйте свои наборы через CSV, делайте резервные копии для безопасности.",
  },
  {
    title: "Готовы начать?",
    text: "Вы всегда можете вернуться к этому туру через настройки! Удачи!",
  },
];

export function OnboardingTour({ onFinish }: { onFinish?: () => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) setVisible(true);
  }, []);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      localStorage.setItem(ONBOARDING_KEY, "1");
      setVisible(false);
      onFinish?.();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="glass-panel max-w-sm rounded-3xl p-8 text-center shadow-xl">
        <h2 className="text-xl font-bold text-text">{steps[step].title}</h2>
        <p className="mt-3 text-base text-muted">{steps[step].text}</p>
        <button
          className={cn(
            "mt-6 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-slate-950 transition",
            step === steps.length - 1 && "bg-emerald-600"
          )}
          onClick={handleNext}
        >
          {step === steps.length - 1 ? "Начать" : "Далее"}
        </button>
      </div>
    </div>
  );
}
