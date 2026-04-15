"use client";

import { useState } from "react";
import type { CardRecord } from "@/lib/types";
import { generateMultipleChoiceQuestion, generateFillInBlankQuestion } from "@/lib/study-system";
import { cn } from "@/lib/utils";
import { CheckIcon, CloseIcon } from "@/components/icons";

type QuizSessionProps = {
  card: CardRecord;
  allCards: CardRecord[];
  onAnswer: (isCorrect: boolean) => void;
  cardIndex: number;
  totalCards: number;
};

export function QuizSession({ card, allCards, onAnswer, cardIndex, totalCards }: QuizSessionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [quizType] = useState<"multiple-choice" | "fill-in-blank">(
    cardIndex % 2 === 0 ? "multiple-choice" : "fill-in-blank"
  );

  const question =
    quizType === "multiple-choice"
      ? generateMultipleChoiceQuestion(card, allCards, "rumanian-to-russian")
      : generateFillInBlankQuestion(card);

  const handleAnswer = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === question.correctAnswer;
    setSubmitted(true);

    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
      setSubmitted(false);
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Запитання {cardIndex + 1} з {totalCards}
          </p>
          <div className="h-1.5 flex-1 rounded-full bg-line/20">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${((cardIndex + 1) / totalCards) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-lg font-semibold text-text">{question.question}</p>

          {quizType === "multiple-choice" ? (
            <div className="space-y-3">
              {question.options?.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrectAnswer = option === question.correctAnswer;
                const showCorrect = submitted && isCorrectAnswer;
                const showWrong = submitted && isSelected && !isCorrectAnswer;

                return (
                  <button
                    key={option}
                    onClick={() => !submitted && setSelectedOption(option)}
                    disabled={submitted}
                    className={cn(
                      "w-full rounded-[24px] border-2 p-4 text-left font-semibold transition",
                      isSelected && !submitted
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-line/30 bg-white/5 text-text hover:border-accent/50 hover:bg-white/10",
                      showCorrect && "border-success bg-success/10 text-success",
                      showWrong && "border-danger bg-danger/10 text-danger"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>{option}</span>
                      {showCorrect && <CheckIcon className="h-5 w-5" />}
                      {showWrong && <CloseIcon className="h-5 w-5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={selectedOption || ""}
                onChange={(e) => !submitted && setSelectedOption(e.target.value)}
                placeholder="Введи відповідь..."
                className={cn(
                  "w-full rounded-[20px] border-2 bg-white/5 px-4 py-3 font-semibold outline-none transition",
                  submitted
                    ? selectedOption === question.correctAnswer
                      ? "border-success text-success"
                      : "border-danger text-danger"
                    : "border-line/30 text-text placeholder:text-muted/50 focus:border-accent/50 focus:bg-white/10"
                )}
                disabled={submitted}
              />
              {submitted && selectedOption !== question.correctAnswer && (
                <p className="text-sm text-danger">
                  Правильна відповідь: <span className="font-semibold">{question.correctAnswer}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleAnswer}
        disabled={!selectedOption || submitted}
        className={cn(
          "w-full rounded-[26px] px-6 py-4 font-semibold transition",
          selectedOption && !submitted
            ? "primary-action text-slate-950"
            : "bg-white/5 text-muted cursor-not-allowed"
        )}
      >
        {submitted ? "Далі..." : "Проверити"}
      </button>
    </div>
  );
}
