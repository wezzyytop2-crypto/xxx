// lib/anki.ts
import type { StudySet, PartOfSpeech } from "@/lib/types";

function generateId() {
  return 'card-' + Math.random().toString(36).slice(2, 12);
}

export function exportSetToAnki(set: StudySet): string {
  // Anki TXT: term[TAB]translation per line
  return set.cards.map(card => `${card.term}\t${card.translation}`).join("\n");
}

export function importSetFromAnki(text: string): Omit<StudySet, "id" | "createdAt" | "updatedAt"> {
  const now = new Date().toISOString();
  const cards = text.split(/\r?\n/).map(line => {
    const [term, translation] = line.split("\t");
    return {
      id: generateId(),
      term: term?.trim() || "",
      translation: translation?.trim() || "",
      example: "",
      note: "",
      partOfSpeech: "noun" as PartOfSpeech,
      createdAt: now,
      updatedAt: now
    };
  }).filter(card => card.term && card.translation);
  return {
    title: "Импорт из Anki",
    description: "",
    color: "teal",
    cards
  };
}
