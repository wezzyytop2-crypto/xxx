// lib/anki.ts
import type { StudySet } from "@/lib/types";

export function exportSetToAnki(set: StudySet): string {
  // Anki TXT: term[TAB]translation per line
  return set.cards.map(card => `${card.term}\t${card.translation}`).join("\n");
}

export function importSetFromAnki(text: string): Omit<StudySet, "id" | "createdAt" | "updatedAt"> {
  const cards = text.split(/\r?\n/).map(line => {
    const [term, translation] = line.split("\t");
    return {
      term: term?.trim() || "",
      translation: translation?.trim() || "",
      example: "",
      note: "",
      partOfSpeech: "noun"
    };
  }).filter(card => card.term && card.translation);
  return {
    title: "Импорт из Anki",
    description: "",
    color: "teal",
    cards
  };
}
