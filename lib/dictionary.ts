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

const DICTIONARY_FAMILIES = [...FAMILIES, SUPPLEMENTAL_FAMILY];
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
