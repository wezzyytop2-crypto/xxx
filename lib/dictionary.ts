import type { PartOfSpeech, SetTone, StudySet } from "@/lib/types";
import {
  SUPPLEMENTAL_VOCABULARY,
  type SupplementalVocabularyEntry
} from "@/lib/supplemental-vocabulary";
import { normalizeAnswer } from "@/lib/utils";

type SeedEntry = {
  key: string;
  term: string;
  translation: string;
  example: string;
  note: string;
  partOfSpeech: PartOfSpeech;
};

type DictionaryFamily = {
  id: string;
  title: string;
  description: string;
  color: SetTone;
  entries: SeedEntry[];
};

type StudySetBlueprint = {
  id: string;
  title: string;
  description: string;
  color: SetTone;
  familyIds: string[];
};

export type DictionaryEntry = SeedEntry & {
  id: string;
  familyId: string;
  familyTitle: string;
  lookup: string[];
};

const seedTime = "2026-04-03T00:15:00.000Z";

const SET_BLUEPRINTS: StudySetBlueprint[] = [
  {
    id: "basics-routine",
    title: "База общения и рутина",
    description: "Приветствия, вежливые формулы, части дня и слова для ежедневного темпа общения.",
    color: "teal",
    familyIds: ["greetings", "time"]
  },
  {
    id: "study-work",
    title: "Учеба и работа",
    description: "Базовая лексика для уроков, объяснений, офиса и коротких рабочих диалогов.",
    color: "indigo",
    familyIds: ["study-work"]
  },
  {
    id: "travel-city",
    title: "Путешествие и город",
    description: "Транспорт, ориентирование и полезные слова для дороги и городской среды.",
    color: "sky",
    familyIds: ["travel-city"]
  },
  {
    id: "home-daily",
    title: "Дом и повседневность",
    description: "Комнаты, бытовые предметы и простая домашняя лексика на каждый день.",
    color: "emerald",
    familyIds: ["home"]
  },
  {
    id: "food-money",
    title: "Еда, покупки и деньги",
    description: "Все, что пригодится в магазине, кафе, на кассе и в бытовых покупках.",
    color: "amber",
    familyIds: ["food", "shopping"]
  },
  {
    id: "health-body",
    title: "Тело и здоровье",
    description: "Самочувствие, части тела, отдых и слова, которые нужны для заботы о себе.",
    color: "teal",
    familyIds: ["health"]
  },
  {
    id: "nature-weather",
    title: "Погода и природа",
    description: "Сезоны, улица, природные явления и базовые слова для описания окружающего мира.",
    color: "sky",
    familyIds: ["weather"]
  },
  {
    id: "people-relations",
    title: "Люди и отношения",
    description: "Семья, друзья, знакомые и слова для разговоров о людях вокруг.",
    color: "emerald",
    familyIds: ["people"]
  },
  {
    id: "feelings-actions",
    title: "Чувства, качества и действия",
    description: "Прилагательные, состояния и частые глаголы для живой повседневной речи.",
    color: "rose",
    familyIds: ["emotions", "common-verbs"]
  },
  {
    id: "expanded-vocabulary",
    title: "Расширенный словарь",
    description: "Дополнительные базовые слова из встроенного переводчика, чтобы запас рос быстрее.",
    color: "indigo",
    familyIds: ["supplemental-core"]
  },
  {
    id: "communication",
    title: "Общение",
    description: "Фразы и слова для разговора, вопросов и общения.",
    color: "rose",
    familyIds: ["communication"]
  },
  {
    id: "expressions",
    title: "Устойчивые фразы",
    description: "Частые фразы и выражения, которые звучат естественно.",
    color: "sky",
    familyIds: ["expressions"]
  },
  {
    id: "everyday-life",
    title: "Повседневная жизнь",
    description: "Частые действия и бытовые рутины, полезные в доме и на улице.",
    color: "indigo",
    familyIds: ["everyday-life"]
  },
  {
    id: "clothing",
    title: "Одежда",
    description: "Описания одежды, цветов и моды для каждого дня.",
    color: "sky",
    familyIds: ["clothing"]
  },
  {
    id: "furniture",
    title: "Мебель",
    description: "Вещи для дома, мебели, комнат и интерьера.",
    color: "emerald",
    familyIds: ["furniture"]
  },
  {
    id: "shopping-life",
    title: "Покупки",
    description: "Лексика для магазинов, цены, оплат и товаров.",
    color: "amber",
    familyIds: ["shopping-life"]
  },
  {
    id: "travel-city-large",
    title: "Путешествия и город",
    description: "Транспорт, поездки, направления и городская навигация.",
    color: "sky",
    familyIds: ["travel-city-large"]
  },
  {
    id: "health-body-large",
    title: "Здоровье и тело",
    description: "Слова о частях тела, самочувствии и медицине.",
    color: "teal",
    familyIds: ["health-body-large"]
  },
  {
    id: "work-study-large",
    title: "Работа и учеба",
    description: "Слова и фразы для офиса, учебы и деловых задач.",
    color: "indigo",
    familyIds: ["work-study-large"]
  },
  {
    id: "nature-weather-large",
    title: "Природа и погода",
    description: "Природные явления, погода и окружающий мир.",
    color: "sky",
    familyIds: ["nature-weather-large"]
  },
  {
    id: "feelings-large",
    title: "Чувства и эмоции",
    description: "Слова о настроении, эмоциях и внутреннем состоянии.",
    color: "rose",
    familyIds: ["feelings-large"]
  },
  {
    id: "people-relations-large",
    title: "Люди и отношения",
    description: "Слова про семью, друзей, коллег и отношения.",
    color: "emerald",
    familyIds: ["people-relations-large"]
  }
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function e(
  term: string,
  translation: string,
  example: string,
  note: string,
  partOfSpeech: PartOfSpeech
): SeedEntry {
  return {
    key: slugify(term),
    term,
    translation,
    example,
    note,
    partOfSpeech
  };
}

function genderLabel(gender: "m" | "f" | "n") {
  const labels = {
    m: "мужской род",
    f: "женский род",
    n: "средний род"
  };

  return labels[gender];
}

function createSupplementalNote(entry: SupplementalVocabularyEntry) {
  const parts = [
    entry.ipa ? `IPA: /${entry.ipa}/` : null,
    entry.gender ? genderLabel(entry.gender) : null,
    entry.frequency ? `частотность ${entry.frequency}/5` : null,
    entry.synonyms?.length ? `синонимы: ${entry.synonyms.join(", ")}` : null
  ].filter(Boolean);

  return parts.join(" · ");
}

function createSupplementalSeedEntry(entry: SupplementalVocabularyEntry): SeedEntry {
  return {
    key: slugify(entry.term),
    term: entry.term,
    translation: entry.translation,
    example: entry.example,
    note: createSupplementalNote(entry),
    partOfSpeech: entry.partOfSpeech
  };
}

type QuickWord = {
  term: string;
  translation: string;
  gender?: "m" | "f" | "n" | "pl";
  translationFem?: string;
  translationNeut?: string;
  translationPl?: string;
};

function getTranslationForGender(word: QuickWord, gender?: "m" | "f" | "n" | "pl") {
  if (gender === "f" && word.translationFem) {
    return word.translationFem;
  }

  if (gender === "n" && word.translationNeut) {
    return word.translationNeut;
  }

  if (gender === "pl" && word.translationPl) {
    return word.translationPl;
  }

  return word.translation;
}

function createPhraseEntries(
  leftWords: QuickWord[],
  rightWords: QuickWord[],
  note: string,
  exampleTemplate: (left: QuickWord, right: QuickWord) => string,
  partOfSpeech: PartOfSpeech = "phrase",
  translationOrder: "left-first" | "right-first" = "left-first"
) {
  return leftWords.flatMap((left) =>
    rightWords.map((right) =>
      e(
        `${left.term} ${right.term}`,
        translationOrder === "left-first"
          ? `${getTranslationForGender(left, left.gender)} ${getTranslationForGender(right, right.gender)}`
          : `${getTranslationForGender(right, right.gender)} ${getTranslationForGender(left, left.gender)}`,
        exampleTemplate(left, right),
        note,
        partOfSpeech
      )
    )
  );
}

function createNounAdjectivePhrases(
  nouns: QuickWord[],
  adjectives: QuickWord[],
  note: string,
  exampleTemplate: (noun: QuickWord, adjective: QuickWord) => string
) {
  return nouns.flatMap((noun) =>
    adjectives.map((adjective) =>
      e(
        `${noun.term} ${adjective.term}`,
        `${getTranslationForGender(adjective, noun.gender)} ${getTranslationForGender(noun, noun.gender)}`,
        exampleTemplate(noun, adjective),
        note,
        "phrase"
      )
    )
  );
}

function createVerbObjectPhrases(
  verbs: QuickWord[],
  objects: QuickWord[],
  note: string,
  exampleTemplate: (verb: QuickWord, object: QuickWord) => string
) {
  return createPhraseEntries(verbs, objects, note, exampleTemplate, "phrase", "left-first");
}

const COMMUNICATION_VERBS: QuickWord[] = [
  { term: "a întreba", translation: "спрашивать" },
  { term: "a spune", translation: "сказать" },
  { term: "a răspunde", translation: "отвечать" },
  { term: "a explica", translation: "объяснять" },
  { term: "a recomanda", translation: "рекомендовать" },
  { term: "a cere", translation: "просить" },
  { term: "a invita", translation: "приглашать" },
  { term: "a confirma", translation: "подтверждать" },
  { term: "a întreține", translation: "поддерживать" },
  { term: "a organiza", translation: "организовывать" },
  { term: "a comunica", translation: "общаться" },
  { term: "a negocia", translation: "договариваться" },
  { term: "a propune", translation: "предлагать" },
  { term: "a întreține", translation: "поддерживать" },
  { term: "a exprima", translation: "выражать" }
];

const COMMUNICATION_OBJECTS: QuickWord[] = [
  { term: "o întrebare", translation: "вопрос" },
  { term: "o idee", translation: "идею" },
  { term: "o informație", translation: "информацию" },
  { term: "o rugăminte", translation: "просьбу" },
  { term: "o părere", translation: "мнение" },
  { term: "o soluție", translation: "решение" },
  { term: "un plan", translation: "план" },
  { term: "un eveniment", translation: "событие" },
  { term: "o ofertă", translation: "предложение" },
  { term: "o idee", translation: "идею" },
  { term: "un mesaj", translation: "сообщение" },
  { term: "un raport", translation: "отчет" },
  { term: "o întâlnire", translation: "встречу" },
  { term: "un termen", translation: "срок" },
  { term: "o decizie", translation: "решение" }
];

const COMMUNICATION_ENTRIES = createVerbObjectPhrases(
  COMMUNICATION_VERBS,
  COMMUNICATION_OBJECTS,
  "Полезные фразы для общения.",
  (verb, object) => `Te rog, ${verb.term} ${object.term}.`
);

const EVERYDAY_VERBS: QuickWord[] = [
  { term: "a trezi", translation: "будить" },
  { term: "a mânca", translation: "есть" },
  { term: "a bea", translation: "пить" },
  { term: "a găti", translation: "готовить" },
  { term: "a curăța", translation: "убирать" },
  { term: "a spăla", translation: "мыть" },
  { term: "a purta", translation: "носить" },
  { term: "a porni", translation: "включать" },
  { term: "a opri", translation: "выключать" },
  { term: "a citi", translation: "читать" },
  { term: "a scrie", translation: "писать" },
  { term: "a plăti", translation: "платить" },
  { term: "a aștepta", translation: "ждать" },
  { term: "a ieși", translation: "выходить" },
  { term: "a intra", translation: "входить" }
];

const EVERYDAY_OBJECTS: QuickWord[] = [
  { term: "micul dejun", translation: "завтрак" },
  { term: "o cafea", translation: "кофе" },
  { term: "masa", translation: "стол" },
  { term: "hainele", translation: "одежду" },
  { term: "casa", translation: "дом" },
  { term: "baia", translation: "ванную" },
  { term: "camera", translation: "комнату" },
  { term: "telefonul", translation: "телефон" },
  { term: "laptopul", translation: "ноутбук" },
  { term: "lista", translation: "список" },
  { term: "lumina", translation: "свет" },
  { term: "ușa", translation: "дверь" },
  { term: "fereastra", translation: "окно" },
  { term: "mașina", translation: "машину" },
  { term: "munca", translation: "работу" }
];

const EVERYDAY_ENTRIES = createVerbObjectPhrases(
  EVERYDAY_VERBS,
  EVERYDAY_OBJECTS,
  "Действия и бытовые задачи в повседневной жизни.",
  (verb, object) => `Trebuie să ${verb.term} ${object.term} azi.`
);

const CLOTHING_NOUNS: QuickWord[] = [
  { term: "tricou", translation: "футболка", gender: "f" },
  { term: "cămașă", translation: "рубашка", gender: "f" },
  { term: "pantaloni", translation: "штаны", gender: "pl" },
  { term: "fustă", translation: "юбка", gender: "f" },
  { term: "rochie", translation: "платье", gender: "f" },
  { term: "geacă", translation: "куртка", gender: "f" },
  { term: "pulover", translation: "свитер", gender: "m" },
  { term: "pantofi", translation: "туфли", gender: "pl" },
  { term: "șosete", translation: "носки", gender: "pl" },
  { term: "căciulă", translation: "шапка", gender: "f" },
  { term: "eșarfă", translation: "шарф", gender: "m" },
  { term: "costum", translation: "костюм", gender: "m" },
  { term: "sacou", translation: "пиджак", gender: "m" },
  { term: "bluză", translation: "блузка", gender: "f" },
  { term: "rochie", translation: "платье", gender: "f" }
];

const COLORS: QuickWord[] = [
  { term: "roșu", translation: "красный", translationFem: "красная", translationPl: "красные" },
  { term: "albastru", translation: "синий", translationFem: "синяя", translationPl: "синие" },
  { term: "verde", translation: "зеленый", translationFem: "зелёная", translationPl: "зелёные" },
  { term: "galben", translation: "жёлтый", translationFem: "жёлтая", translationPl: "жёлтые" },
  { term: "negru", translation: "черный", translationFem: "чёрная", translationPl: "чёрные" },
  { term: "alb", translation: "белый", translationFem: "белая", translationPl: "белые" },
  { term: "maro", translation: "коричневый", translationFem: "коричневая", translationPl: "коричневые" },
  { term: "portocaliu", translation: "оранжевый", translationFem: "оранжевая", translationPl: "оранжевые" },
  { term: "mov", translation: "фиолетовый", translationFem: "фиолетовая", translationPl: "фиолетовые" },
  { term: "roz", translation: "розовый", translationFem: "розовая", translationPl: "розовые" },
  { term: "gri", translation: "серый", translationFem: "серая", translationPl: "серые" },
  { term: "bej", translation: "бежевый", translationFem: "бежевая", translationPl: "бежевые" },
  { term: "auriu", translation: "золотой", translationFem: "золотая", translationPl: "золотые" },
  { term: "argintiu", translation: "серебристый", translationFem: "серебристая", translationPl: "серебристые" },
  { term: "deschis", translation: "светлый", translationFem: "светлая", translationPl: "светлые" },
  { term: "închis", translation: "тёмный", translationFem: "тёмная", translationPl: "тёмные" },
  { term: "cu dungi", translation: "в полоску", translationFem: "в полоску", translationPl: "в полоску" },
  { term: "cu buline", translation: "в горошек", translationFem: "в горошек", translationPl: "в горошек" },
  { term: "din lână", translation: "шерстяной", translationFem: "шерстяная", translationPl: "шерстяные" },
  { term: "din bumbac", translation: "хлопковый", translationFem: "хлопковая", translationPl: "хлопковые" }
];

const CLOTHING_ENTRIES = createNounAdjectivePhrases(
  CLOTHING_NOUNS,
  COLORS,
  "Одежда, цвета и стили для повседневной одежды.",
  (noun, color) => `Am cumpărat un ${noun.term} ${color.term}.`
);

const FURNITURE_NOUNS: QuickWord[] = [
  { term: "scaun", translation: "стул", gender: "m" },
  { term: "masă", translation: "стол", gender: "m" },
  { term: "pat", translation: "кровать", gender: "f" },
  { term: "canapea", translation: "диван", gender: "m" },
  { term: "dulap", translation: "шкаф", gender: "m" },
  { term: "raft", translation: "полка", gender: "f" },
  { term: "lampă", translation: "лампа", gender: "f" },
  { term: "covor", translation: "ковер", gender: "m" },
  { term: "oglindă", translation: "зеркало", gender: "n" },
  { term: "perdea", translation: "штора", gender: "f" },
  { term: "bibliotecă", translation: "библиотека", gender: "f" },
  { term: "birou", translation: "письменный стол", gender: "m" },
  { term: "noptieră", translation: "тумбочка", gender: "f" },
  { term: "fotoliu", translation: "кресло", gender: "n" },
  { term: "frigider", translation: "холодильник", gender: "m" }
];

const FURNITURE_ADJECTIVES: QuickWord[] = [
  { term: "mare", translation: "большой", translationFem: "большая", translationNeut: "большое", translationPl: "большие" },
  { term: "mic", translation: "маленький", translationFem: "маленькая", translationNeut: "маленькое", translationPl: "маленькие" },
  { term: "confortabil", translation: "удобный", translationFem: "удобная", translationNeut: "удобное", translationPl: "удобные" },
  { term: "modern", translation: "современный", translationFem: "современная", translationNeut: "современное", translationPl: "современные" },
  { term: "vechi", translation: "старый", translationFem: "старая", translationNeut: "старое", translationPl: "старые" },
  { term: "nou", translation: "новый", translationFem: "новая", translationNeut: "новое", translationPl: "новые" },
  { term: "elegant", translation: "элегантный", translationFem: "элегантная", translationNeut: "элегантное", translationPl: "элегантные" },
  { term: "solid", translation: "прочный", translationFem: "прочная", translationNeut: "прочное", translationPl: "прочные" },
  { term: "din lemn", translation: "деревянный", translationFem: "деревянная", translationNeut: "деревянное", translationPl: "деревянные" },
  { term: "metallic", translation: "металлический", translationFem: "металлическая", translationNeut: "металлическое", translationPl: "металлические" },
  { term: "alb", translation: "белый", translationFem: "белая", translationNeut: "белое", translationPl: "белые" },
  { term: "negru", translation: "черный", translationFem: "чёрная", translationNeut: "чёрное", translationPl: "чёрные" },
  { term: "moale", translation: "мягкий", translationFem: "мягкая", translationNeut: "мягкое", translationPl: "мягкие" },
  { term: "tare", translation: "жёсткий", translationFem: "жёсткая", translationNeut: "жёсткое", translationPl: "жёсткие" },
  { term: "simplu", translation: "простой", translationFem: "простая", translationNeut: "простое", translationPl: "простые" },
  { term: "spațios", translation: "просторный", translationFem: "просторная", translationNeut: "просторное", translationPl: "просторные" },
  { term: "îngust", translation: "узкий", translationFem: "узкая", translationNeut: "узкое", translationPl: "узкие" },
  { term: "decorativ", translation: "декоративный", translationFem: "декоративная", translationNeut: "декоративное", translationPl: "декоративные" },
  { term: "practic", translation: "практичный", translationFem: "практичная", translationNeut: "практичное", translationPl: "практичные" },
  { term: "luminos", translation: "светлый", translationFem: "светлая", translationNeut: "светлое", translationPl: "светлые" }
];

const FURNITURE_ENTRIES = createNounAdjectivePhrases(
  FURNITURE_NOUNS,
  FURNITURE_ADJECTIVES,
  "Мебель, интерьер и бытовые предметы.",
  (noun, adjective) => `În camera mea este un ${noun.term} ${adjective.term}.`
);

const FOOD_VERBS: QuickWord[] = [
  { term: "a mânca", translation: "есть" },
  { term: "a bea", translation: "пить" },
  { term: "a găti", translation: "готовить" },
  { term: "a cumpăra", translation: "покупать" },
  { term: "a pregăti", translation: "готовить" },
  { term: "a gusta", translation: "пробовать" },
  { term: "a tăia", translation: "резать" },
  { term: "a fierbe", translation: "варить" },
  { term: "a coace", translation: "печь" },
  { term: "a prăji", translation: "жарить" },
  { term: "a adăuga", translation: "добавлять" },
  { term: "a amesteca", translation: "мешать" },
  { term: "a condimenta", translation: "приправлять" },
  { term: "a servi", translation: "подавать" },
  { term: "a gusta", translation: "пробовать" }
];

const FOOD_NOUNS: QuickWord[] = [
  { term: "apă", translation: "воду" },
  { term: "pâine", translation: "хлеб" },
  { term: "lapte", translation: "молоко" },
  { term: "cafea", translation: "кофе" },
  { term: "ceai", translation: "чай" },
  { term: "măr", translation: "яблоко" },
  { term: "supă", translation: "суп" },
  { term: "carne", translation: "мясо" },
  { term: "salată", translation: "салат" },
  { term: "brânză", translation: "сыр" },
  { term: "ouă", translation: "яйца" },
  { term: "orez", translation: "рис" },
  { term: "pește", translation: "рыбу" },
  { term: "fructe", translation: "фрукты" },
  { term: "legume", translation: "овощи" }
];

const FOOD_ENTRIES = createVerbObjectPhrases(
  FOOD_VERBS,
  FOOD_NOUNS,
  "Еда, напитки и кулинарные действия.",
  (verb, object) => `Îmi place să ${verb.term} ${object.term}.`
);

const SHOPPING_ITEMS: QuickWord[] = [
  { term: "magazin", translation: "магазин", gender: "m" },
  { term: "preț", translation: "цена", gender: "f" },
  { term: "reducere", translation: "скидка", gender: "f" },
  { term: "card", translation: "карту", gender: "m" },
  { term: "numerar", translation: "наличные", gender: "pl" },
  { term: "raft", translation: "полку", gender: "m" },
  { term: "produs", translation: "товар", gender: "m" },
  { term: "client", translation: "клиента", gender: "m" },
  { term: "casă de marcat", translation: "кассу", gender: "f" },
  { term: "cumpărătură", translation: "покупку", gender: "f" },
  { term: "catalog", translation: "каталог", gender: "m" },
  { term: "cadou", translation: "подарок", gender: "m" },
  { term: "pantofi", translation: "туфли", gender: "pl" },
  { term: "haine", translation: "одежду", gender: "f" },
  { term: "parfum", translation: "парфюм", gender: "m" }
];

const SHOPPING_ADJECTIVES: QuickWord[] = [
  { term: "ieftin", translation: "дешёвый", translationFem: "дешевая", translationPl: "дешёвые" },
  { term: "scump", translation: "дорогой", translationFem: "дорогая", translationPl: "дорогие" },
  { term: "nou", translation: "новый", translationFem: "новая", translationPl: "новые" },
  { term: "folosit", translation: "использованный", translationFem: "использованная", translationPl: "использованные" },
  { term: "disponibil", translation: "доступный", translationFem: "доступная", translationPl: "доступные" },
  { term: "potrivit", translation: "подходящий", translationFem: "подходящая", translationPl: "подходящие" },
  { term: "elegant", translation: "элегантный", translationFem: "элегантная", translationPl: "элегантные" },
  { term: "popular", translation: "популярный", translationFem: "популярная", translationPl: "популярные" },
  { term: "special", translation: "специальный", translationFem: "специальная", translationPl: "специальные" },
  { term: "digital", translation: "цифровой", translationFem: "цифровая", translationPl: "цифровые" },
  { term: "local", translation: "местный", translationFem: "местная", translationPl: "местные" },
  { term: "importat", translation: "импортный", translationFem: "импортная", translationPl: "импортные" },
  { term: "ecologic", translation: "экологичный", translationFem: "экологичная", translationPl: "экологичные" },
  { term: "modern", translation: "современный", translationFem: "современная", translationPl: "современные" },
  { term: "tradițional", translation: "традиционный", translationFem: "традиционная", translationPl: "традиционные" },
  { term: "confortabil", translation: "комфортный", translationFem: "комфортная", translationPl: "комфортные" }
];

const SHOPPING_ENTRIES = createNounAdjectivePhrases(
  SHOPPING_ITEMS,
  SHOPPING_ADJECTIVES,
  "Товары и покупки: описания, цены и выбор.",
  (item, adjective) => `Este un ${item.term} ${adjective.term}.`
);

const TRAVEL_NOUNS: QuickWord[] = [
  { term: "autobuz", translation: "автобус", gender: "m" },
  { term: "tren", translation: "поезд", gender: "m" },
  { term: "aeroport", translation: "аэропорт", gender: "m" },
  { term: "hotel", translation: "отель", gender: "m" },
  { term: "gară", translation: "вокзал", gender: "m" },
  { term: "taxi", translation: "такси", gender: "m" },
  { term: "bagaj", translation: "багаж", gender: "m" },
  { term: "hartă", translation: "карту", gender: "f" },
  { term: "stradă", translation: "улицу", gender: "f" },
  { term: "stație", translation: "остановку", gender: "f" },
  { term: "mașină", translation: "машину", gender: "f" },
  { term: "bilet", translation: "билет", gender: "m" },
  { term: "valiză", translation: "чемодан", gender: "f" },
  { term: "peron", translation: "платформу", gender: "m" },
  { term: "ghid", translation: "гид", gender: "m" }
];

const TRAVEL_ADJECTIVES: QuickWord[] = [
  { term: "rapid", translation: "быстрый", translationFem: "быстрая", translationPl: "быстрые" },
  { term: "lent", translation: "медленный", translationFem: "медленная", translationPl: "медленные" },
  { term: "scump", translation: "дорогой", translationFem: "дорогая", translationPl: "дорогие" },
  { term: "ieftin", translation: "дешёвый", translationFem: "дешевая", translationPl: "дешёвые" },
  { term: "confortabil", translation: "комфортный", translationFem: "комфортная", translationPl: "комфортные" },
  { term: "modern", translation: "современный", translationFem: "современная", translationPl: "современные" },
  { term: "foarte mare", translation: "очень большой", translationFem: "очень большая", translationPl: "очень большие" },
  { term: "mic", translation: "маленький", translationFem: "маленькая", translationPl: "маленькие" },
  { term: "aproape", translation: "близкий", translationFem: "близкая", translationPl: "близкие" },
  { term: "distanțat", translation: "удалённый", translationFem: "удалённая", translationPl: "удалённые" },
  { term: "nou", translation: "новый", translationFem: "новая", translationPl: "новые" },
  { term: "vechi", translation: "старый", translationFem: "старая", translationPl: "старые" },
  { term: "public", translation: "общественный", translationFem: "общественная", translationPl: "общественные" },
  { term: "privat", translation: "частный", translationFem: "частная", translationPl: "частные" },
  { term: "curat", translation: "чистый", translationFem: "чистая", translationPl: "чистые" }
];

const TRAVEL_ENTRIES = createNounAdjectivePhrases(
  TRAVEL_NOUNS,
  TRAVEL_ADJECTIVES,
  "Путешествия и город: транспорт, места и маршруты.",
  (noun, adjective) => `Am mers cu ${noun.term} ${adjective.term}.`
);

const HEALTH_NOUNS: QuickWord[] = [
  { term: "cap", translation: "голову", gender: "f" },
  { term: "mână", translation: "руку", gender: "f" },
  { term: "ochi", translation: "глаз", gender: "m" },
  { term: "stomac", translation: "желудок", gender: "m" },
  { term: "picior", translation: "ногу", gender: "f" },
  { term: "nas", translation: "нос", gender: "m" },
  { term: "gură", translation: "рот", gender: "m" },
  { term: "spate", translation: "спину", gender: "f" },
  { term: "gât", translation: "горло", gender: "n" },
  { term: "dinți", translation: "зубы", gender: "pl" },
  { term: "inimă", translation: "сердце", gender: "n" },
  { term: "ureche", translation: "ухо", gender: "n" },
  { term: "dureri", translation: "боли", gender: "pl" },
  { term: "febră", translation: "лихорадку", gender: "f" },
  { term: "tuse", translation: "кашель", gender: "m" }
];

const HEALTH_ADJECTIVES: QuickWord[] = [
  { term: "durere", translation: "болезненный", translationFem: "болезненная", translationNeut: "болезненное", translationPl: "болезненные" },
  { term: "fierbinte", translation: "горячий", translationFem: "горячая", translationNeut: "горячее", translationPl: "горячие" },
  { term: "rece", translation: "холодный", translationFem: "холодная", translationNeut: "холодное", translationPl: "холодные" },
  { term: "obosit", translation: "усталый", translationFem: "усталая", translationNeut: "усталое", translationPl: "усталые" },
  { term: "slăbit", translation: "слабый", translationFem: "слабая", translationNeut: "слабое", translationPl: "слабые" },
  { term: "sănătos", translation: "здоровый", translationFem: "здоровая", translationNeut: "здоровое", translationPl: "здоровые" },
  { term: "inflamat", translation: "воспалённый", translationFem: "воспалённая", translationNeut: "воспалённое", translationPl: "воспалённые" },
  { term: "uleios", translation: "жирный", translationFem: "жирная", translationNeut: "жирное", translationPl: "жирные" },
  { term: "curat", translation: "чистый", translationFem: "чистая", translationNeut: "чистое", translationPl: "чистые" },
  { term: "uscat", translation: "сухой", translationFem: "сухая", translationNeut: "сухое", translationPl: "сухие" },
  { term: "umed", translation: "влажный", translationFem: "влажная", translationNeut: "влажное", translationPl: "влажные" },
  { term: "confuz", translation: "смущённый", translationFem: "смущённая", translationNeut: "смущённое", translationPl: "смущённые" },
  { term: "durere", translation: "болезненный", translationFem: "болезненная", translationNeut: "болезненное", translationPl: "болезненные" },
  { term: "grav", translation: "серьёзный", translationFem: "серьёзная", translationNeut: "серьёзное", translationPl: "серьёзные" },
  { term: "uşor", translation: "лёгкий", translationFem: "лёгкая", translationNeut: "лёгкое", translationPl: "лёгкие" }
];

const HEALTH_ENTRIES = createNounAdjectivePhrases(
  HEALTH_NOUNS,
  HEALTH_ADJECTIVES,
  "Здоровье, тело, симптомы и самочувствие.",
  (noun, adjective) => `Am ${noun.term} ${adjective.term}.`
);

const WORK_VERBS: QuickWord[] = [
  { term: "a lucra", translation: "работать" },
  { term: "a studia", translation: "учиться" },
  { term: "a organiza", translation: "организовывать" },
  { term: "a trimite", translation: "отправлять" },
  { term: "a primi", translation: "получать" },
  { term: "a citi", translation: "читать" },
  { term: "a scrie", translation: "писать" },
  { term: "a explica", translation: "объяснять" },
  { term: "a planifica", translation: "планировать" },
  { term: "a semna", translation: "подписывать" },
  { term: "a analiza", translation: "анализировать" },
  { term: "a preda", translation: "преподавать" },
  { term: "a învăța", translation: "изучать" },
  { term: "a raporta", translation: "докладывать" },
  { term: "a întâlni", translation: "встречаться" }
];

const WORK_OBJECTS: QuickWord[] = [
  { term: "un raport", translation: "отчет" },
  { term: "o sarcină", translation: "задачу" },
  { term: "o întâlnire", translation: "встречу" },
  { term: "un proiect", translation: "проект" },
  { term: "un client", translation: "клиента" },
  { term: "un document", translation: "документ" },
  { term: "o scrisoare", translation: "письмо" },
  { term: "un termen", translation: "срок" },
  { term: "o factură", translation: "счет" },
  { term: "o prezentare", translation: "презентацию" },
  { term: "o carte", translation: "книгу" },
  { term: "un curs", translation: "курс" },
  { term: "o lecție", translation: "урок" },
  { term: "un calculator", translation: "компьютер" },
  { term: "un telefon", translation: "телефон" }
];

const WORK_ENTRIES = createVerbObjectPhrases(
  WORK_VERBS,
  WORK_OBJECTS,
  "Слова и фразы для работы, учебы и офиса.",
  (verb, object) => `Trebuie să ${verb.term} ${object.term}.`
);

const NATURE_NOUNS: QuickWord[] = [
  { term: "soare", translation: "солнце", gender: "n" },
  { term: "ploaie", translation: "дождь", gender: "m" },
  { term: "vânt", translation: "ветер", gender: "m" },
  { term: "zăpadă", translation: "снег", gender: "m" },
  { term: "nor", translation: "облако", gender: "n" },
  { term: "copac", translation: "дерево", gender: "n" },
  { term: "floare", translation: "цветок", gender: "m" },
  { term: "munte", translation: "гора", gender: "f" },
  { term: "mare", translation: "море", gender: "n" },
  { term: "lac", translation: "озеро", gender: "n" },
  { term: "pădure", translation: "лес", gender: "m" },
  { term: "râu", translation: "река", gender: "f" },
  { term: "plajă", translation: "пляж", gender: "m" },
  { term: "anotimp", translation: "сезон", gender: "m" },
  { term: "temperatură", translation: "температура", gender: "f" }
];

const NATURE_ADJECTIVES: QuickWord[] = [
  { term: "cald", translation: "тёплый", translationFem: "тёплая", translationNeut: "тёплое", translationPl: "тёплые" },
  { term: "rece", translation: "холодный", translationFem: "холодная", translationNeut: "холодное", translationPl: "холодные" },
  { term: "senin", translation: "ясный", translationFem: "ясная", translationNeut: "ясное", translationPl: "ясные" },
  { term: "înnorat", translation: "пасмурный", translationFem: "пасмурная", translationNeut: "пасмурное", translationPl: "пасмурные" },
  { term: "ploios", translation: "дождливый", translationFem: "дождливая", translationNeut: "дождливое", translationPl: "дождливые" },
  { term: "zăpăzos", translation: "снежный", translationFem: "снежная", translationNeut: "снежное", translationPl: "снежные" },
  { term: "vântos", translation: "ветреный", translationFem: "ветреная", translationNeut: "ветреное", translationPl: "ветреные" },
  { term: "verde", translation: "зелёный", translationFem: "зелёная", translationNeut: "зелёное", translationPl: "зелёные" },
  { term: "uscat", translation: "сухой", translationFem: "сухая", translationNeut: "сухое", translationPl: "сухие" },
  { term: "umed", translation: "влажный", translationFem: "влажная", translationNeut: "влажное", translationPl: "влажные" },
  { term: "frumos", translation: "красивый", translationFem: "красивая", translationNeut: "красивое", translationPl: "красивые" },
  { term: "împădurit", translation: "лесной", translationFem: "лесная", translationNeut: "лесное", translationPl: "лесные" },
  { term: "înalt", translation: "высокий", translationFem: "высокая", translationNeut: "высокое", translationPl: "высокие" },
  { term: "adânc", translation: "глубокий", translationFem: "глубокая", translationNeut: "глубокое", translationPl: "глубокие" },
  { term: "calm", translation: "спокойный", translationFem: "спокойная", translationNeut: "спокойное", translationPl: "спокойные" }
];

const NATURE_ENTRIES = createNounAdjectivePhrases(
  NATURE_NOUNS,
  NATURE_ADJECTIVES,
  "Природа и погода: описания окружающего мира.",
  (noun, adjective) => `Este un ${noun.term} ${adjective.term}.`
);

const FEELINGS_ADVERBS: QuickWord[] = [
  { term: "foarte", translation: "очень" },
  { term: "puțin", translation: "немного" },
  { term: "destul de", translation: "довольно" },
  { term: "aproape", translation: "почти" },
  { term: "complet", translation: "полностью" },
  { term: "uneori", translation: "иногда" },
  { term: "mereu", translation: "всегда" },
  { term: "rar", translation: "редко" },
  { term: "în mod natural", translation: "естественно" },
  { term: "foarte puțin", translation: "очень мало" },
  { term: "aproape întotdeauna", translation: "почти всегда" },
  { term: "destul de mult", translation: "довольно много" }
];

const FEELINGS_ADJECTIVES: QuickWord[] = [
  { term: "fericit", translation: "счастливый" },
  { term: "trist", translation: "грустный" },
  { term: "obosit", translation: "усталый" },
  { term: "nervos", translation: "нервный" },
  { term: "calm", translation: "спокойный" },
  { term: "curios", translation: "любопытный" },
  { term: "îngrijorat", translation: "обеспокоенный" },
  { term: "entuziasmat", translation: "взволнованный" },
  { term: "speriat", translation: "испуганный" },
  { term: "relaxat", translation: "расслабленный" },
  { term: "mândru", translation: "гордый" },
  { term: "jenat", translation: "смущённый" },
  { term: "iubit", translation: "влюблённый" },
  { term: "dezamăgit", translation: "разочарованный" },
  { term: "surprins", translation: "удивлённый" }
];

const FEELINGS_ENTRIES = createPhraseEntries(
  FEELINGS_ADVERBS,
  FEELINGS_ADJECTIVES,
  "Эмоции и состояния: описания самочувствия.",
  (adverb, adjective) => `Mă simt ${adverb.term} ${adjective.term}.`
);

const PEOPLE_NOUNS: QuickWord[] = [
  { term: "mamă", translation: "мама", gender: "f" },
  { term: "tată", translation: "папа", gender: "m" },
  { term: "frate", translation: "брат", gender: "m" },
  { term: "soră", translation: "сестра", gender: "f" },
  { term: "prieten", translation: "друг", gender: "m" },
  { term: "coleg", translation: "коллега", gender: "m" },
  { term: "vecin", translation: "сосед", gender: "m" },
  { term: "copil", translation: "ребенок", gender: "m" },
  { term: "bunică", translation: "бабушка", gender: "f" },
  { term: "bunic", translation: "дедушка", gender: "m" },
  { term: "soț", translation: "муж", gender: "m" },
  { term: "soție", translation: "жена", gender: "f" },
  { term: "șef", translation: "начальник", gender: "m" },
  { term: "student", translation: "студент", gender: "m" },
  { term: "profesor", translation: "преподаватель", gender: "m" }
];

const PEOPLE_ADJECTIVES: QuickWord[] = [
  { term: "bun", translation: "хороший", translationFem: "хорошая", translationPl: "хорошие" },
  { term: "rău", translation: "плохой", translationFem: "плохая", translationPl: "плохие" },
  { term: "fericit", translation: "счастливый", translationFem: "счастливая", translationPl: "счастливые" },
  { term: "trist", translation: "грустный", translationFem: "грустная", translationPl: "грустные" },
  { term: "ocupat", translation: "занятый", translationFem: "занятая", translationPl: "занятые" },
  { term: "prietenos", translation: "дружелюбный", translationFem: "дружелюбная", translationPl: "дружелюбные" },
  { term: "amabil", translation: "вежливый", translationFem: "вежливая", translationPl: "вежливые" },
  { term: "tânăr", translation: "молодой", translationFem: "молодая", translationPl: "молодые" },
  { term: "bătrân", translation: "старый", translationFem: "старая", translationPl: "старые" },
  { term: "energetic", translation: "энергичный", translationFem: "энергичная", translationPl: "энергичные" },
  { term: "calm", translation: "спокойный", translationFem: "спокойная", translationPl: "спокойные" },
  { term: "serios", translation: "серьёзный", translationFem: "серьёзная", translationPl: "серьёзные" },
  { term: "talentat", translation: "талантливый", translationFem: "талантливая", translationPl: "талантливые" },
  { term: "gentil", translation: "милый", translationFem: "милая", translationPl: "милые" },
  { term: "curajos", translation: "смелый", translationFem: "смелая", translationPl: "смелые" }
];

const PEOPLE_ENTRIES = createNounAdjectivePhrases(
  PEOPLE_NOUNS,
  PEOPLE_ADJECTIVES,
  "Слова о людях, родстве, профессиях и отношениях.",
  (noun, adjective) => `Este un ${noun.term} ${adjective.term}.`
);

const EXPRESSIONS_ENTRIES: SeedEntry[] = [
  e("a avea nevoie de", "нуждаться в", "Am nevoie de un sfat bun.", "Частая устойчивость с инфинитивом.", "phrase"),
  e("a se descurca", "справляться", "Mă descurc cu sarcinile de azi.", "Глагол возвратный.", "verb"),
  e("a pune întrebări", "задавать вопросы", "Pun întrebări atunci când nu înțeleg.", "Употребляется в учебном и общении.", "phrase"),
  e("a da o mână de ajutor", "помочь", "Îi dau o mână de ajutor la mutare.", "Устойчивое выражение помощи.", "expression"),
  e("a face o plimbare", "прогуляться", "Fac o plimbare în parc după-amiaza.", "Широко используется в разговоре.", "phrase"),
  e("a face cunoscuta", "знакомить", "Îl fac cunoscut pe colegul meu.", "Разговорный оборот.", "phrase"),
  e("a se simți bine", "чувствовать себя хорошо", "Mă simt bine astăzi.", "Частое выражение настроения.", "phrase"),
  e("a avea grijă", "заботиться", "Am grijă de plantele din casă.", "Устойчивый оборот заботы.", "phrase"),
  e("a avea timp", "иметь время", "Am timp să repet înainte de curs.", "Шаблон для рутинной речи.", "phrase"),
  e("a fi de acord", "соглашаться", "Sunt de acord cu ideea ta.", "Частое выражение согласия.", "phrase"),
  e("a lua legătura", "связаться", "O să iau legătura cu profesorul.", "Полезно для деловой и учебной речи.", "phrase"),
  e("a face o rezervare", "забронировать", "Fac o rezervare la restaurant.", "Фраза для путешествий и еды.", "phrase"),
  e("a ajunge la timp", "прийти вовремя", "Am ajuns la timp la întâlnire.", "Распространенное выражение для расписания.", "phrase"),
  e("a avea chef", "иметь настроение", "Am chef să ies în oraș.", "Устойчивый оборот 'иметь желание'.", "phrase"),
  e("a ține minte", "запомнить", "Ține minte această regulă.", "Устойчивое выражение памяти.", "phrase"),
  e("a da un exemplu", "привести пример", "Dă-mi un exemplu simplu.", "Полезно для объяснений.", "phrase"),
  e("a vorbi deschis", "говорить открыто", "Vorbește deschis despre planuri.", "Частое выражение общения.", "phrase"),
  e("a trage o concluzie", "сделать вывод", "Trage o concluzie după discuție.", "Устойчивое выражение для обобщений.", "phrase")
];

const GENERATED_FAMILIES: DictionaryFamily[] = [
  {
    id: "communication",
    title: "Общение",
    description: "Фразы и слова для разговоров, вопросов и общения.",
    color: "rose",
    entries: COMMUNICATION_ENTRIES
  },
  {
    id: "expressions",
    title: "Устойчивые фразы",
    description: "Частые фразы и выражения, которые звучат естественно.",
    color: "sky",
    entries: EXPRESSIONS_ENTRIES
  },
  {
    id: "everyday-life",
    title: "Повседневная жизнь",
    description: "Частые действия и бытовые задачи для дня за днём.",
    color: "indigo",
    entries: EVERYDAY_ENTRIES
  },
  {
    id: "clothing",
    title: "Одежда",
    description: "Описания одежды, цвета и стиля в повседневных образах.",
    color: "sky",
    entries: CLOTHING_ENTRIES
  },
  {
    id: "furniture",
    title: "Мебель",
    description: "Слова для мебели, интерьера и домашнего пространства.",
    color: "emerald",
    entries: FURNITURE_ENTRIES
  },
  {
    id: "shopping-life",
    title: "Покупки",
    description: "Лексика для магазинов, оплаты и выбора товаров.",
    color: "amber",
    entries: SHOPPING_ENTRIES
  },
  {
    id: "travel-city-large",
    title: "Путешествия и город",
    description: "Транспорт, маршруты и слова для передвижения по городу.",
    color: "sky",
    entries: TRAVEL_ENTRIES
  },
  {
    id: "health-body-large",
    title: "Здоровье и тело",
    description: "Слова о самочувствии, частях тела и симптомах.",
    color: "teal",
    entries: HEALTH_ENTRIES
  },
  {
    id: "work-study-large",
    title: "Работа и учеба",
    description: "Офисная и учебная лексика для повседневных задач.",
    color: "indigo",
    entries: WORK_ENTRIES
  },
  {
    id: "nature-weather-large",
    title: "Природа и погода",
    description: "Описание окружающего мира, погоды и природных явлений.",
    color: "sky",
    entries: NATURE_ENTRIES
  },
  {
    id: "feelings-large",
    title: "Чувства и эмоции",
    description: "Эмоции, состояние, настроение и описания самочувствия.",
    color: "rose",
    entries: FEELINGS_ENTRIES
  },
  {
    id: "people-relations-large",
    title: "Люди и отношения",
    description: "Слова о семье, друзьях, отношениях и людях.",
    color: "emerald",
    entries: PEOPLE_ENTRIES
  }
];

function lookupVariants(term: string) {
  const normalized = normalizeAnswer(term);
  const variants = new Set<string>([normalized]);

  if (normalized.startsWith("a ")) {
    variants.add(normalized.slice(2));
  }

  return [...variants].filter(Boolean);
}

const FAMILIES: DictionaryFamily[] = [
  {
    id: "greetings",
    title: "Приветствия и вежливость",
    description: "Базовые формулы общения для начала любого разговора.",
    color: "teal",
    entries: [
      e("bună", "привет", "Bună, ce faci?", "Нейтральное приветствие в разговоре.", "expression"),
      e("bună dimineața", "доброе утро", "Bună dimineața, ai dormit bine?", "Утреннее приветствие.", "expression"),
      e("bună seara", "добрый вечер", "Bună seara, bine ați venit.", "Подходит для формального общения.", "expression"),
      e("bună noapte", "спокойной ночи", "Bună noapte! Somn ușor.", "Перед сном.", "expression"),
      e("la revedere", "до свидания", "La revedere și drum bun!", "Нейтральное прощание.", "expression"),
      e("pa!", "пока!", "Pa! Vorbesc cu tine curând.", "Неформальное, быстрое прощание.", "expression"),
      e("mulțumesc", "спасибо", "Mulțumesc pentru ajutor.", "Часто сокращают до mersi.", "expression"),
      e("mersi", "спасибо (сокращено)", "Mersi mult!", "Разговорная сокращенная форма.", "expression"),
      e("cu plăcere", "пожалуйста, не за что", "Cu plăcere, oricând.", "Стандартный ответ на благодарность.", "expression"),
      e("pentru nimic", "не за что", "Pentru nimic, e o plăcere.", "Более неформальный ответ.", "expression"),
      e("scuze", "извини", "Scuze, am întârziat.", "Разговорная форма извинения.", "expression"),
      e("îmi pare rău", "мне жаль (извини)", "Îmi pare rău, nu eram atent.", "Более формальное извинение.", "expression"),
      e("te rog", "пожалуйста", "Te rog, repetă încă o dată.", "Используется в просьбах.", "expression"),
      e("vă rog", "пожалуйста (вежливо)", "Vă rog să așteptați.", "Формальное обращение.", "expression"),
      e("ce mai faci?", "как дела?", "Ce mai faci în ultima vreme?", "Частый вопрос в неформальном общении.", "phrase"),
      e("cum te simți?", "как ты себя чувствуешь?", "Cum te simți azi?", "Вопрос о самочувствии.", "phrase"),
      e("bine", "хорошо", "Sunt bine, mulțumesc.", "Частый короткий ответ.", "adverb"),
      e("rău", "плохо", "Mă simt rău astazi.", "Когда что-то не в порядке.", "adverb"),
      e("mai mult sau mai puțin", "более или менее", "Mă simt mai mult sau mai puțin bine.", "Нейтральный ответ.", "adverb"),
      e("îmi pare bine", "приятно познакомиться", "Îmi pare bine să te cunosc.", "Формула знакомства.", "expression"),
      e("ne vedem", "увидимся", "Ne vedem mâine dimineață.", "Неформальное прощание.", "expression"),
      e("noroc", "удачи", "Noroc la test!", "Желание успеха.", "expression"),
      e("sănătate", "здоровья", "Sănătate! Să nu mă mai gândesc la asta.", "Пожелание здоровья при чихании.", "expression"),
      e("bravo", "браво, молодец", "Bravo! Ai făcut o treabă bună.", "Похвала за действие.", "expression"),
      e("înțeles", "понял", "Înțeles, voi fi atent.", "Подтверждение понимания.", "expression"),
      e("sigur", "конечно", "Sigur, pot ajuta.", "Согласие или подтверждение.", "adverb")
    ]
  },
  {
    id: "study-work",
    title: "Учеба и работа",
    description: "Слова для занятий, офиса, объяснений и повседневной учебной рутины.",
    color: "indigo",
    entries: [
      e("a învăța", "учить, изучать", "Învăț româna în fiecare seară.", "Инфинитив с частицей a.", "verb"),
      e("lecție", "урок", "Astăzi avem o lecție scurtă.", "Женский род.", "noun"),
      e("caiet", "тетрадь", "Scriu totul în caiet.", "Полезно для школы и курсов.", "noun"),
      e("profesor", "преподаватель", "Profesorul explică foarte clar.", "Женская форма: profesoară.", "noun"),
      e("student", "студент", "Studentul repetă înainte de test.", "Женская форма: studentă.", "noun"),
      e("exercițiu", "упражнение", "Fac un exercițiu de vocabular.", "Часто в заданиях и учебниках.", "noun"),
      e("cuvânt", "слово", "Acest cuvânt este nou pentru mine.", "Диакритика â в корне.", "noun"),
      e("întrebare", "вопрос", "Am o întrebare despre temă.", "Полезно в классе и на встречах.", "noun"),
      e("răspuns", "ответ", "Răspunsul tău este corect.", "Сочетается с verbul a răspunde.", "noun"),
      e("a explica", "объяснять", "Poți explica regula aceasta?", "Часто используется в учебе.", "verb"),
      e("temă", "домашнее задание", "Îmi fac tema după cină.", "Также может означать тему разговора.", "noun"),
      e("birou", "офис, письменный стол", "Lucrez la birou până la șase.", "Значение зависит от контекста.", "noun")
    ]
  },
  {
    id: "travel-city",
    title: "Путешествие и город",
    description: "Транспорт, направления, багаж и слова для ориентирования в городе.",
    color: "sky",
    entries: [
      e("gară", "вокзал", "Unde este gara centrală?", "Чаще всего железнодорожный вокзал.", "noun"),
      e("bilet", "билет", "Am cumpărat un bilet dus.", "Также для концертов и кино.", "noun"),
      e("autobuz", "автобус", "Autobuzul vine peste cinci minute.", "Распространенный городской транспорт.", "noun"),
      e("stație", "остановка, станция", "Cobor la următoarea stație.", "Женский род.", "noun"),
      e("aeroport", "аэропорт", "Aeroportul este departe de centru.", "Частое слово в поездках.", "noun"),
      e("stradă", "улица", "Strada aceasta este foarte aglomerată.", "Женский род.", "noun"),
      e("hartă", "карта", "Privesc harta înainte să plec.", "И бумажная, и цифровая карта.", "noun"),
      e("stânga", "налево, левая сторона", "La colț faci la stânga.", "Антоним dreapta.", "adverb"),
      e("dreapta", "направо, правая сторона", "Farmacia este pe dreapta.", "Антоним stânga.", "adverb"),
      e("a ajunge", "добраться, прибыть", "Ajung la hotel în zece minute.", "Полезно в дороге.", "verb"),
      e("bagaj", "багаж", "Bagajul meu este destul de greu.", "Часто в поездках и аэропорту.", "noun"),
      e("hotel", "отель", "Hotelul nostru este lângă centru.", "Международное слово.", "noun")
    ]
  },
  {
    id: "home",
    title: "Дом и комнаты",
    description: "Базовые бытовые слова для квартиры, мебели и пространства дома.",
    color: "emerald",
    entries: [
      e("casă", "дом", "Casa noastră este mică și luminoasă.", "Одно из самых частых бытовых слов.", "noun"),
      e("cameră", "комната", "Camera mea este foarte liniștită.", "Женский род.", "noun"),
      e("bucătărie", "кухня", "Bucătăria este lângă hol.", "Диакритика ă обязательна.", "noun"),
      e("baie", "ванная", "Baia este ocupată acum.", "Также означает купание в другом контексте.", "noun"),
      e("dormitor", "спальня", "Dormitorul este la etaj.", "Средний род.", "noun"),
      e("ușă", "дверь", "Închide ușa, te rog.", "Диакритика ș обязательна.", "noun"),
      e("fereastră", "окно", "Deschid fereastra dimineața.", "Женский род.", "noun"),
      e("masă", "стол", "Cartea este pe masă.", "Также может значить прием пищи.", "noun"),
      e("scaun", "стул", "Ia un scaun și stai aici.", "Средний род.", "noun"),
      e("pat", "кровать", "Patul este foarte comod.", "Короткое и частое слово.", "noun"),
      e("cheie", "ключ", "Unde este cheia de la ușă?", "Женский род.", "noun"),
      e("curat", "чистый", "Apartamentul este curat și ordonat.", "Женская форма: curată.", "adjective")
    ]
  },
  {
    id: "food",
    title: "Еда и напитки",
    description: "Ежедневная лексика для кафе, магазина и домашних приемов пищи.",
    color: "amber",
    entries: [
      e("apă", "вода", "Vreau un pahar cu apă rece.", "Одна из базовых бытовых единиц.", "noun"),
      e("pâine", "хлеб", "Cumpăr pâine proaspătă dimineața.", "Женский род.", "noun"),
      e("lapte", "молоко", "Beau lapte cu cafea.", "Средний род.", "noun"),
      e("cafea", "кофе", "Cafeaua este prea fierbinte.", "Очень частое слово.", "noun"),
      e("ceai", "чай", "Prefer ceaiul verde seara.", "Мужской род.", "noun"),
      e("măr", "яблоко", "Mărul acesta este dulce.", "Множественное число: mere.", "noun"),
      e("supă", "суп", "Supa de legume este gustoasă.", "Женский род.", "noun"),
      e("carne", "мясо", "Nu mănânc multă carne.", "Употребляется и в общем значении.", "noun"),
      e("mic dejun", "завтрак", "Iau micul dejun la șapte.", "Устойчивое сочетание.", "phrase"),
      e("prânz", "обед", "La prânz ies cu colegii.", "Диакритика â в корне.", "noun"),
      e("cină", "ужин", "Pregătim cina acasă.", "Женский род.", "noun"),
      e("foame", "голод", "Mi-e foame după curs.", "Часто в конструкции mi-e foame.", "noun")
    ]
  },
  {
    id: "shopping",
    title: "Покупки и деньги",
    description: "Слова для магазина, оплаты, скидок и бытовых покупок.",
    color: "rose",
    entries: [
      e("magazin", "магазин", "Magazinul se închide la nouă.", "Частое повседневное слово.", "noun"),
      e("preț", "цена", "Prețul acesta mi se pare bun.", "Диакритика ț обязательна.", "noun"),
      e("ieftin", "дешевый", "Produsul este destul de ieftin.", "Антоним scump.", "adjective"),
      e("scump", "дорогой", "Telefonul este prea scump.", "И о цене, и об отношении.", "adjective"),
      e("reducere", "скидка", "Astăzi este reducere la haine.", "Женский род.", "noun"),
      e("bani", "деньги", "Nu am destui bani acum.", "Чаще во множественном числе.", "noun"),
      e("card", "карта", "Plătesc cu cardul.", "Банковская карта.", "noun"),
      e("numerar", "наличные", "Ai numerar sau plătești cu telefonul?", "Используется как существительное и прилагательное.", "noun"),
      e("a cumpăra", "покупать", "Vreau să cumpăr o carte nouă.", "Частый глагол для магазина.", "verb"),
      e("a plăti", "платить", "Plătesc imediat la casă.", "Полезен в кафе и магазинах.", "verb"),
      e("chitanță", "чек, квитанция", "Păstrez chitanța pentru garanție.", "Женский род.", "noun"),
      e("deschis", "открытый", "Magazinul este încă deschis.", "Женская форма: deschisă.", "adjective")
    ]
  },
  {
    id: "health",
    title: "Тело и здоровье",
    description: "Слова для самочувствия, тела, отдыха и обращения за помощью.",
    color: "teal",
    entries: [
      e("cap", "голова", "Mă doare capul astăzi.", "Короткое базовое слово.", "noun"),
      e("mână", "рука", "Spal mâinile înainte de masă.", "Форма множественного числа: mâini.", "noun"),
      e("ochi", "глаз", "Am nisip în ochi.", "Часто встречается во множественном числе.", "noun"),
      e("stomac", "желудок", "Stomacul meu nu se simte bine.", "Мужской род.", "noun"),
      e("medic", "врач", "Medicul vine la ora zece.", "Женская форма: doctoriță в разговорной речи реже.", "noun"),
      e("farmacie", "аптека", "Unde este farmacia de gardă?", "Полезно в путешествиях.", "noun"),
      e("durere", "боль", "Durerea trece după odihnă.", "Часто в конструкции am o durere.", "noun"),
      e("răceală", "простуда", "Cred că am o răceală ușoară.", "Женский род.", "noun"),
      e("sănătos", "здоровый", "Micul dejun acesta este sănătos.", "Женская форма: sănătoasă.", "adjective"),
      e("bolnav", "больной", "Astăzi mă simt puțin bolnav.", "Женская форма: bolnavă.", "adjective"),
      e("odihnă", "отдых", "Am nevoie de puțină odihnă.", "Женский род.", "noun"),
      e("a dormi", "спать", "Dorm mai bine când este liniște.", "Базовый глагол повседневности.", "verb")
    ]
  },
  {
    id: "time",
    title: "Время и рутина",
    description: "Ориентиры по времени, части дня и привычный ритм недели.",
    color: "indigo",
    entries: [
      e("astăzi", "сегодня", "Astăzi lucrez de acasă.", "Часто встречается и форма azi.", "adverb"),
      e("mâine", "завтра", "Mâine avem test.", "Диакритика â обязательна.", "adverb"),
      e("ieri", "вчера", "Ieri am fost foarte ocupat.", "Частое наречие времени.", "adverb"),
      e("dimineață", "утро", "Dimineața beau cafea.", "Женский род.", "noun"),
      e("seară", "вечер", "Seara repet vocabularele.", "Женский род.", "noun"),
      e("noapte", "ночь", "Noaptea orașul este liniștit.", "Женский род.", "noun"),
      e("devreme", "рано", "Mă trezesc devreme în timpul săptămânii.", "Часто в рутине.", "adverb"),
      e("târziu", "поздно", "Nu mânca prea târziu.", "Диакритика â обязательна.", "adverb"),
      e("săptămână", "неделя", "Săptămâna aceasta este aglomerată.", "Женский род.", "noun"),
      e("lună", "месяц", "Luna viitoare plec în vacanță.", "Также означает луна.", "noun"),
      e("oră", "час", "Am doar o oră liberă.", "Женский род.", "noun"),
      e("minut", "минута", "Așteaptă un minut, te rog.", "Мужской род.", "noun")
    ]
  },
  {
    id: "weather",
    title: "Погода и природа",
    description: "Частотная лексика для описания улицы, сезонов и природной среды.",
    color: "sky",
    entries: [
      e("soare", "солнце", "Astăzi este mult soare.", "Женский род.", "noun"),
      e("ploaie", "дождь", "Ploaia începe după prânz.", "Женский род.", "noun"),
      e("vânt", "ветер", "Vântul este rece dimineața.", "Диакритика â обязательна.", "noun"),
      e("zăpadă", "снег", "Iarna avem multă zăpadă aici.", "Женский род.", "noun"),
      e("cald", "тепло, тёплый", "Afară este foarte cald.", "Антоним rece.", "adjective"),
      e("rece", "холодный, холодно", "Apa aceasta este prea rece.", "Антоним cald.", "adjective"),
      e("nor", "облако", "Un nor mare acoperă soarele.", "Мужской род.", "noun"),
      e("parc", "парк", "Ne plimbăm în parc seara.", "Частое городское слово.", "noun"),
      e("copac", "дерево", "Copacul din față este foarte înalt.", "Мужской род.", "noun"),
      e("floare", "цветок", "Floarea aceasta miroase frumos.", "Женский род.", "noun"),
      e("munte", "гора", "Muntele este acoperit de ceață.", "Средний род.", "noun"),
      e("mare", "море", "Vara mergem la mare.", "Также прилагательное большой.", "noun")
    ]
  },
  {
    id: "people",
    title: "Люди и отношения",
    description: "Слова о семье, друзьях, коллегах и повседневных связях между людьми.",
    color: "emerald",
    entries: [
      e("familie", "семья", "Familia mea locuiește în Chișinău.", "Женский род.", "noun"),
      e("mamă", "мама", "Mama gătește foarte bine.", "Одно из базовых семейных слов.", "noun"),
      e("tată", "папа", "Tatăl meu lucrează acasă.", "Частая форма в разговоре.", "noun"),
      e("frate", "брат", "Fratele meu este mai mare.", "Женская пара: soră.", "noun"),
      e("soră", "сестра", "Sora mea învață limbi străine.", "Женский род.", "noun"),
      e("prieten", "друг", "Prietenul meu vine diseară.", "Женская форма: prietenă.", "noun"),
      e("coleg", "коллега", "Colegul meu vorbește româna bine.", "Женская форма: colegă.", "noun"),
      e("copil", "ребенок", "Copilul râde în parc.", "Может значить и сын/дочь в широком смысле.", "noun"),
      e("vecin", "сосед", "Vecinul nostru este foarte liniștit.", "Женская форма: vecină.", "noun"),
      e("cunoscut", "знакомый", "Este doar un cunoscut, nu un prieten apropiat.", "Часто как существительное и прилагательное.", "noun"),
      e("singur", "один, одинокий", "Astăzi merg singur la magazin.", "Женская форма: singură.", "adjective"),
      e("împreună", "вместе", "Învățăm împreună în fiecare weekend.", "Частотное наречие.", "adverb")
    ]
  },
  {
    id: "emotions",
    title: "Эмоции и качества",
    description: "Прилагательные и состояния для описания себя, людей и впечатлений.",
    color: "amber",
    entries: [
      e("fericit", "счастливый", "Astăzi sunt foarte fericit.", "Женская форма: fericită.", "adjective"),
      e("trist", "грустный", "Pare puțin trist după știre.", "Женская форма: tristă.", "adjective"),
      e("obosit", "уставший", "Sunt obosit după lucru.", "Женская форма: obosită.", "adjective"),
      e("liniștit", "спокойный", "Camera este liniștită seara.", "Женская форма: liniștită.", "adjective"),
      e("nervos", "нервный", "El devine nervos în trafic.", "Женская форма: nervoasă.", "adjective"),
      e("curios", "любопытный", "Sunt curios ce înseamnă asta.", "Женская форма: curioasă.", "adjective"),
      e("frumos", "красивый", "Orașul vechi este foarte frumos.", "Женская форма: frumoasă.", "adjective"),
      e("important", "важный", "Acest detaliu este foarte important.", "Женская форма: importantă.", "adjective"),
      e("ușor", "легкий, легко", "Exercițiul acesta este ușor.", "Может быть и наречием.", "adjective"),
      e("greu", "трудный, тяжёлый", "Testul a fost greu pentru mulți.", "Может значить и тяжело.", "adjective"),
      e("rapid", "быстрый", "Ai un răspuns foarte rapid.", "Женская форма: rapidă.", "adjective"),
      e("încet", "медленно", "Vorbește mai încet, te rog.", "Часто употребляется как наречие.", "adverb")
    ]
  },
  {
    id: "common-verbs",
    title: "Базовые глаголы",
    description: "Частые действия для разговорной речи, письма и повседневных задач.",
    color: "rose",
    entries: [
      e("a merge", "идти, ехать", "Merg la curs după prânz.", "Один из самых частых глаголов.", "verb"),
      e("a veni", "приходить", "Vii cu noi diseară?", "Частый разговорный глагол.", "verb"),
      e("a vedea", "видеть", "Văd munții de la fereastră.", "Основной глагол восприятия.", "verb"),
      e("a auzi", "слышать", "Nu aud bine în autobuz.", "Полезно в повседневной речи.", "verb"),
      e("a spune", "говорить, сказать", "Spune-mi adevărul.", "Часто в просьбах и вопросах.", "verb"),
      e("a face", "делать", "Fac exerciții în fiecare zi.", "Очень частотный глагол.", "verb"),
      e("a lucra", "работать", "Lucrez la birou toată ziua.", "Часто в теме работы.", "verb"),
      e("a mânca", "есть", "Mănânc repede înainte de curs.", "Диакритика â важна.", "verb"),
      e("a bea", "пить", "Beau apă după sport.", "Базовый глагол быта.", "verb"),
      e("a citi", "читать", "Citesc un text scurt seara.", "Часто в учебе.", "verb"),
      e("a scrie", "писать", "Scriu cuvintele noi în caiet.", "Полезен для режима Write.", "verb"),
      e("a căuta", "искать", "Caut o adresă pe hartă.", "Часто в городе и в интернете.", "verb")
    ]
  }
];

function createDictionaryEntry(family: DictionaryFamily, entry: SeedEntry): DictionaryEntry {
  return {
    ...entry,
    id: `dict-${family.id}-${entry.key}`,
    familyId: family.id,
    familyTitle: family.title,
    lookup: lookupVariants(entry.term)
  };
}

function createStudySet(
  setKey: string,
  color: SetTone,
  title: string,
  description: string,
  entries: SeedEntry[],
  setIndex: number
): StudySet {
  const setId = `seed-${setKey}`;
  const timestamp = new Date(new Date(seedTime).getTime() + setIndex * 60_000).toISOString();

  return {
    id: setId,
    title,
    description,
    color,
    createdAt: timestamp,
    updatedAt: timestamp,
    cards: entries.map((entry) => ({
      id: `${setId}-${entry.key}`,
      term: entry.term,
      translation: entry.translation,
      example: entry.example,
      note: entry.note,
      partOfSpeech: entry.partOfSpeech,
      createdAt: timestamp,
      updatedAt: timestamp
    }))
  };
}

function uniqueEntries(entries: SeedEntry[]) {
  const unique = new Map<string, SeedEntry>();

  for (const entry of entries) {
    if (!unique.has(entry.key)) {
      unique.set(entry.key, entry);
    }
  }

  return [...unique.values()];
}

const SUPPLEMENTAL_FAMILY: DictionaryFamily = {
  id: "supplemental-core",
  title: "Расширенный словарь",
  description: "Дополнительные базовые слова из встроенного переводчика.",
  color: "indigo",
  entries: SUPPLEMENTAL_VOCABULARY.map(createSupplementalSeedEntry)
};

const DICTIONARY_FAMILIES = [...FAMILIES, ...GENERATED_FAMILIES, SUPPLEMENTAL_FAMILY];
const FAMILY_BY_ID = new Map(DICTIONARY_FAMILIES.map((family) => [family.id, family]));

function collectEntriesForSet(blueprint: StudySetBlueprint) {
  return uniqueEntries(blueprint.familyIds.flatMap((familyId) => FAMILY_BY_ID.get(familyId)?.entries ?? []));
}

export const BUILT_IN_DICTIONARY: DictionaryEntry[] = DICTIONARY_FAMILIES.flatMap((family) =>
  family.entries.map((entry) => createDictionaryEntry(family, entry))
);

export const BUILT_IN_SETS: StudySet[] = SET_BLUEPRINTS.map((blueprint, index) =>
  createStudySet(
    blueprint.id,
    blueprint.color,
    blueprint.title,
    blueprint.description,
    collectEntriesForSet(blueprint),
    index
  )
);

const cardsPerSet = BUILT_IN_SETS.map((set) => set.cards.length);

export const BUILT_IN_LIBRARY_STATS = {
  families: DICTIONARY_FAMILIES.length,
  categories: BUILT_IN_SETS.length,
  words: BUILT_IN_DICTIONARY.length,
  cardsPerCategory: Math.round(cardsPerSet.reduce((sum, count) => sum + count, 0) / cardsPerSet.length),
  minCardsPerSet: Math.min(...cardsPerSet),
  maxCardsPerSet: Math.max(...cardsPerSet),
  totalPreparedCards: BUILT_IN_SETS.reduce((sum, set) => sum + set.cards.length, 0)
};

export function getDictionarySuggestions(query: string, limit = 6) {
  const normalizedQuery = normalizeAnswer(query);

  if (normalizedQuery.length < 2) {
    return [];
  }

  return BUILT_IN_DICTIONARY.filter((entry) => entry.lookup.some((item) => item.startsWith(normalizedQuery))).slice(0, limit);
}
