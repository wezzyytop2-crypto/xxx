import type { PartOfSpeech } from "@/lib/types";

export type SupplementalVocabularyEntry = {
  id: string;
  term: string;
  translation: string;
  example: string;
  partOfSpeech: PartOfSpeech;
  gender?: "m" | "f" | "n";
  ipa?: string;
  synonyms?: string[];
  frequency?: number;
};

export const SUPPLEMENTAL_VOCABULARY: SupplementalVocabularyEntry[] = [
  {
    id: "ro_carte",
    term: "carte",
    translation: "книга",
    example: "Citesc o carte.",
    partOfSpeech: "noun",
    gender: "f",
    ipa: "ˈkar.te",
    frequency: 5
  },
  {
    id: "ro_om",
    term: "om",
    translation: "человек",
    example: "Un om bun.",
    partOfSpeech: "noun",
    gender: "m",
    ipa: "om",
    frequency: 5
  },
  {
    id: "ro_femeie",
    term: "femeie",
    translation: "женщина",
    example: "O femeie frumoasă.",
    partOfSpeech: "noun",
    gender: "f",
    ipa: "feˈme.je",
    frequency: 5
  },
  {
    id: "ro_barbat",
    term: "bărbat",
    translation: "мужчина",
    example: "Un bărbat puternic.",
    partOfSpeech: "noun",
    gender: "m",
    ipa: "bərˈbat",
    frequency: 5
  },
  {
    id: "ro_mancare",
    term: "mâncare",
    translation: "еда",
    example: "Mâncarea este delicioasă.",
    partOfSpeech: "noun",
    gender: "f",
    ipa: "mənˈka.re",
    frequency: 5
  },
  {
    id: "ro_bun",
    term: "bun",
    translation: "хороший",
    example: "Un om bun.",
    partOfSpeech: "adjective",
    ipa: "bun",
    frequency: 5
  },
  {
    id: "ro_mic",
    term: "mic",
    translation: "маленький",
    example: "Un copil mic.",
    partOfSpeech: "adjective",
    ipa: "mik",
    frequency: 5
  },
  {
    id: "ro_urat",
    term: "urât",
    translation: "уродливый, некрасивый",
    example: "O culoare urâtă.",
    partOfSpeech: "adjective",
    ipa: "uˈrat",
    frequency: 3
  },
  {
    id: "ro_lung",
    term: "lung",
    translation: "длинный",
    example: "O zi lungă.",
    partOfSpeech: "adjective",
    ipa: "luŋ",
    frequency: 4
  },
  {
    id: "ro_scurt",
    term: "scurt",
    translation: "короткий",
    example: "O scrisoare scurtă.",
    partOfSpeech: "adjective",
    ipa: "skurt",
    frequency: 4
  },
  {
    id: "ro_unu",
    term: "unu",
    translation: "один",
    example: "Am o singură carte, nu două.",
    partOfSpeech: "numeral",
    ipa: "ˈu.nu",
    frequency: 5
  },
  {
    id: "ro_doi",
    term: "doi",
    translation: "два",
    example: "Are doi frați.",
    partOfSpeech: "numeral",
    ipa: "doi",
    frequency: 5
  },
  {
    id: "ro_trei",
    term: "trei",
    translation: "три",
    example: "Trei zile trec repede.",
    partOfSpeech: "numeral",
    ipa: "trej",
    frequency: 5
  },
  {
    id: "ro_patru",
    term: "patru",
    translation: "четыре",
    example: "Patru anotimpuri formează anul.",
    partOfSpeech: "numeral",
    ipa: "ˈpa.tru",
    frequency: 5
  },
  {
    id: "ro_cinci",
    term: "cinci",
    translation: "пять",
    example: "Cinci minute sunt suficiente.",
    partOfSpeech: "numeral",
    ipa: "ˈt͡ʃin.t͡ʃi",
    frequency: 5
  },
  {
    id: "ro_eu",
    term: "eu",
    translation: "я",
    example: "Eu sunt gata.",
    partOfSpeech: "pronoun",
    ipa: "eu",
    frequency: 5
  },
  {
    id: "ro_tu",
    term: "tu",
    translation: "ты",
    example: "Tu cine ești?",
    partOfSpeech: "pronoun",
    ipa: "tu",
    frequency: 5
  },
  {
    id: "ro_el",
    term: "el",
    translation: "он",
    example: "El este fericit astăzi.",
    partOfSpeech: "pronoun",
    ipa: "el",
    frequency: 5
  },
  {
    id: "ro_ea",
    term: "ea",
    translation: "она",
    example: "Ea este profesoară.",
    partOfSpeech: "pronoun",
    ipa: "ea",
    frequency: 5
  },
  {
    id: "ro_noi",
    term: "noi",
    translation: "мы",
    example: "Noi învățăm împreună.",
    partOfSpeech: "pronoun",
    ipa: "noi",
    frequency: 5
  },
  {
    id: "ro_voi",
    term: "voi",
    translation: "вы",
    example: "Voi ce faceți azi?",
    partOfSpeech: "pronoun",
    ipa: "voi",
    frequency: 5
  },
  {
    id: "ro_ei",
    term: "ei",
    translation: "они",
    example: "Ei sunt oameni buni.",
    partOfSpeech: "pronoun",
    ipa: "ei",
    frequency: 5
  },
  {
    id: "ro_zi",
    term: "zi",
    translation: "день",
    example: "Bună ziua!",
    partOfSpeech: "noun",
    gender: "f",
    ipa: "zi",
    frequency: 5
  },
  {
    id: "ro_vreme",
    term: "vreme",
    translation: "время, погода",
    example: "Ce vreme este afară?",
    partOfSpeech: "noun",
    gender: "f",
    ipa: "ˈvre.me",
    frequency: 5
  },
  {
    id: "ro_an",
    term: "an",
    translation: "год",
    example: "Anul acesta vreau să vorbesc mai bine.",
    partOfSpeech: "noun",
    gender: "m",
    ipa: "an",
    frequency: 5
  },
  {
    id: "ro_iubi",
    term: "a iubi",
    translation: "любить",
    example: "Te iubesc.",
    partOfSpeech: "verb",
    ipa: "a juˈbi",
    frequency: 5
  },
  {
    id: "ro_placea",
    term: "a plăcea",
    translation: "нравиться",
    example: "Îmi place muzica românească.",
    partOfSpeech: "verb",
    ipa: "a pləˈt͡ʃea",
    frequency: 5
  },
  {
    id: "ro_intelege",
    term: "a înțelege",
    translation: "понимать",
    example: "Nu înțeleg întrebarea.",
    partOfSpeech: "verb",
    ipa: "a ɪn.tseˈle.d͡ʒe",
    frequency: 5
  },
  {
    id: "ro_vorbi",
    term: "a vorbi",
    translation: "говорить",
    example: "Vorbesc mai bine când exersez zilnic.",
    partOfSpeech: "verb",
    ipa: "a vorˈbi",
    frequency: 5
  },
  {
    id: "ro_intreba",
    term: "a întreba",
    translation: "спрашивать",
    example: "Poți să întrebi încă o dată?",
    partOfSpeech: "verb",
    ipa: "a ɪn.treˈba",
    frequency: 4
  }
];
