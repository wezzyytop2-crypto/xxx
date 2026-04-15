// Грамматические правила и теория румынского языка с русскими пояснениями

export type GrammarRule = {
  id: string;
  title: string;
  descriptionRu: string;
  examples: Array<{
    romanian: string;
    russian: string;
    explanation?: string;
  }>;
  tip: string;
  category: string;
};

export type GrammarCategory =
  | "articles"
  | "gender"
  | "number"
  | "adjectives"
  | "pronouns"
  | "verbs"
  | "tenses"
  | "negation"
  | "questions"
  | "word-order"
  | "possessives"
  | "numerals"
  | "comparison"
  | "particles"
  | "expressions";

export const GRAMMAR_RULES: GrammarRule[] = [
  // АРТИКЛИ
  {
    id: "articles-1",
    title: "Неопределённый артикль",
    descriptionRu:
      "В румынском неопределённый артикль (как 'a' или 'an' в английском) ставится ПЕРЕД существительным. Используется для первого упоминания предмета. Формы: un (мужчина), o (женщина), un (средний род).",
    examples: [
      {
        romanian: "un băiat",
        russian: "один мальчик / мальчик",
        explanation: "Мужской род — неопределённый артикль un"
      },
      {
        romanian: "o fată",
        russian: "одна девочка / девочка",
        explanation: "Женский род — неопределённый артикль o"
      },
      {
        romanian: "un pom",
        russian: "одно дерево / дерево",
        explanation: "Средний род — артикль un"
      }
    ],
    tip: "Неопределённый артикль (un, o) используй при первом упоминании, когда ещё не известно конкретно о каком предмете речь.",
    category: "articles"
  },

  {
    id: "articles-2",
    title: "Определённый артикль",
    descriptionRu:
      "Определённый артикль в румынском стоит ПОСЛЕ существительного (это главное отличие от русского). Используется, когда речь идёт о конкретном, уже известном предмете. Формы зависят от рода и числа.",
    examples: [
      {
        romanian: "băiatul",
        russian: "мальчик (конкретный, известный)",
        explanation: "Мужской род единственное число: существительное + суффикс -ul"
      },
      {
        romanian: "fata",
        russian: "девочка (конкретная, известная)",
        explanation: "Женский род единственное число: существительное + суффикс -a"
      },
      {
        romanian: "copacul",
        russian: "дерево (конкретное, известное)",
        explanation: "Средний род единственное число: существительное + суффикс -ul"
      },
      {
        romanian: "baieti",
        russian: "мальчики (конкретные, известные)",
        explanation: "Множественное число: существительное во множественном числе, артикль опускается или интегрирован"
      }
    ],
    tip: "Помни: в румынском артикль идёт ПОСЛЕ, а не ДО существительного. При множественном числе артикль часто опускается или становится частью окончания.",
    category: "articles"
  },

  // РОД
  {
    id: "gender-1",
    title: "Род существительных",
    descriptionRu:
      "Каждое существительное в румынском имеет род: мужской, женский или средний. Род влияет на артикль, прилагательные и местоимения. Обычно в словаре указан род (m, f, n).",
    examples: [
      {
        romanian: "om (m) — omul",
        russian: "человек (мужчина) — мужской род",
        explanation: "Мужской род, артикль -ul"
      },
      {
        romanian: "casă (f) — casa",
        russian: "дом (как существительное неживое) — женский род",
        explanation: "Женский род, артикль -a"
      },
      {
        romanian: "copil (n) — copilul",
        russian: "ребёнок — средний род",
        explanation: "Средний род, артикль -ul"
      }
    ],
    tip: "При изучении новых слов обязательно запоминай род! Он определяет, как будут согласовываться прилагательные и местоимения.",
    category: "gender"
  },

  // МНОЖЕСТВЕННОЕ ЧИСЛО
  {
    id: "number-1",
    title: "Множественное число",
    descriptionRu:
      "Во множественном числе существительные и прилагательные меняют окончания. Нет единого правила, но есть основные типы. Артикль часто опускается или становится частью окончания слова.",
    examples: [
      {
        romanian: "masă — mese",
        russian: "стол — столы",
        explanation: "Женский род: -ă становится -e"
      },
      {
        romanian: "om — oameni",
        russian: "человек — люди",
        explanation: "Мужской род: часто непредсказуемые формы"
      },
      {
        romanian: "copil — copii",
        russian: "ребёнок — дети",
        explanation: "Средний род: -il становится -ii"
      },
      {
        romanian: "casă — case",
        russian: "дом — дома",
        explanation: "Женский род -ă в конце: -ă → -e"
      }
    ],
    tip: "Множественное число часто непредсказуемо. Лучше запоминать формы вместе с новым словом.",
    category: "number"
  },

  // СОГЛАСОВАНИЕ ПРИЛАГАТЕЛЬНЫХ
  {
    id: "adjectives-1",
    title: "Согласование прилагательных",
    descriptionRu:
      "Прилагательное должно согласовываться с существительным по роду и числу. Прилагательное обычно стоит перед существительным. Окончание прилагательного меняется в зависимости от рода и числа существительного.",
    examples: [
      {
        romanian: "băiat frumos",
        russian: "красивый мальчик",
        explanation: "Мужской род единственное число: frumos"
      },
      {
        romanian: "fată frumoasă",
        russian: "красивая девочка",
        explanation: "Женский род единственное число: frumoasă (для женского рода добавляют -ă)"
      },
      {
        romanian: "copil frumos",
        russian: "красивое ребёнок",
        explanation: "Средний род единственное число: frumos (как мужской)"
      },
      {
        romanian: "băieți frumoși",
        russian: "красивые мальчики",
        explanation: "Множественное число: frumoși"
      }
    ],
    tip: "Когда прилагательное оканчивается на -os, -o, оно меняет -os на -oasă для женского рода. Запоминай эту пару форм.",
    category: "adjectives"
  },

  // ГЛАГОЛЫ И СПРЯЖЕНИЯ
  {
    id: "verbs-1",
    title: "Основное спряжение: глагол a fi (быть)",
    descriptionRu:
      "Глагол 'a fi' (быть) — один из самых важных глаголов. Он спрягается очень нерегулярно. Это основа для построения других времён и состояний.",
    examples: [
      {
        romanian: "eu sunt",
        russian: "я (есть)/я есмь",
        explanation: "1-е лицо единственное число"
      },
      {
        romanian: "tu ești",
        russian: "ты есть",
        explanation: "2-е лицо единственное число"
      },
      {
        romanian: "el/ea/ono este",
        russian: "он/она/оно есть",
        explanation: "3-е лицо единственное число (форма одна для всех родов)"
      },
      {
        romanian: "noi suntem",
        russian: "мы есть",
        explanation: "1-е лицо множественное число"
      },
      {
        romanian: "voi sunteți",
        russian: "вы есть",
        explanation: "2-е лицо множественное число (вежливое или множественное)"
      },
      {
        romanian: "ei/ele sunt",
        russian: "они есть",
        explanation: "3-е лицо множественное число"
      }
    ],
    tip: "Запомни все формы глагола 'a fi'. Они используются везде: в вопросах, отрицаниях, для обозначения состояния.",
    category: "verbs"
  },

  {
    id: "verbs-2",
    title: "Спряжение глаголов I группы: a vorbi (говорить)",
    descriptionRu:
      "Глаголы на -a обычно следуют регулярному паттерну спряжения. Основа остаётся неизменной, а окончания показывают лицо и число.",
    examples: [
      {
        romanian: "eu vorbesc",
        russian: "я говорю",
        explanation: "1-е лицо единственное число: основа + -esc"
      },
      {
        romanian: "tu vorbești",
        russian: "ты говоришь",
        explanation: "2-е лицо единственное число: основа + -ești"
      },
      {
        romanian: "el vorbește",
        russian: "он говорит",
        explanation: "3-е лицо единственное число: основа + -ește"
      },
      {
        romanian: "noi vorbim",
        russian: "мы говорим",
        explanation: "1-е лицо множественное число: основа + -im"
      },
      {
        romanian: "voi vorbiți",
        russian: "вы говорите",
        explanation: "2-е лицо множественное число: основа + -iți"
      },
      {
        romanian: "ei vorbesc",
        russian: "они говорят",
        explanation: "3-е лицо множественное число: основа + -esc"
      }
    ],
    tip: "Запоминай окончания. Тип спряжения глагола 'a vorbi' (говорить) часто подразумевает -esc для 1-го и 3-го лица.",
    category: "verbs"
  },

  // ВРЕМЕНА
  {
    id: "tenses-1",
    title: "Презент (настоящее время)",
    descriptionRu:
      "Настоящее время используется для описания действий, которые происходят прямо сейчас, или для общих истин. Форма глагола показывает лицо и число.",
    examples: [
      {
        romanian: "Eu mănânc pâine.",
        russian: "Я ем хлеб. (сейчас или каждый день)",
        explanation: "Презент, 1-е лицо единственное число"
      },
      {
        romanian: "Tu lucrezi la birou.",
        russian: "Ты работаешь в офисе.",
        explanation: "Презент, 2-е лицо единственное число"
      },
      {
        romanian: "El citește o carte.",
        russian: "Он читает книгу.",
        explanation: "Презент, 3-е лицо единственное число"
      }
    ],
    tip: "Презент в румынском используется часто. Это основное время для повседневного общения.",
    category: "tenses"
  },

  {
    id: "tenses-2",
    title: "Претеритум (простое прошедшее время)",
    descriptionRu:
      "Претеритум используется для описания завершённых действий в прошлом, как правило, недавних. Образуется из вспомогательного глагола am/ai/a + причастие прошедшего времени.",
    examples: [
      {
        romanian: "Am mâncat pâine.",
        russian: "Я поел хлеб. (недавно)",
        explanation: "Претеритум: am (вспомогательный) + mâncat (причастие)"
      },
      {
        romanian: "Ai lucrat bine.",
        russian: "Ты хорошо поработал.",
        explanation: "Претеритум: ai (вспомогательный) + lucrat (причастие)"
      },
      {
        romanian: "A citit cartea.",
        russian: "Он прочитал книгу.",
        explanation: "Претеритум: a (вспомогательный) + citit (причастие)"
      }
    ],
    tip: "Претеритум — беглое прошедшее. Если говорить о событии, которое произошло давно, используй имперфект.",
    category: "tenses"
  },

  {
    id: "tenses-3",
    title: "Будущее время (Futurul)",
    descriptionRu:
      "Будущее время используется для действий, которые произойдут в будущем. Образуется из вспомогательного глагола voi/vei/va + инфинитив.",
    examples: [
      {
        romanian: "Voi merge la piață.",
        russian: "Я пойду на рынок.",
        explanation: "Будущее: voi (вспомогательный) + merge (инфинитив)"
      },
      {
        romanian: "Vei lucra mâine.",
        russian: "Ты будешь работать завтра.",
        explanation: "Будущее: vei (вспомогательный) + lucra (инфинитив)"
      },
      {
        romanian: "Va veni la 5 ore.",
        russian: "Он придёт в 5 часов.",
        explanation: "Будущее: va (вспомогательный) + veni (инфинитив)"
      }
    ],
    tip: "Будущее время образуется довольно просто. Помни вспомогательный глагол va- и добавь инфинитив.",
    category: "tenses"
  },

  // ОТРИЦАНИЕ
  {
    id: "negation-1",
    title: "Отрицание: частица nu",
    descriptionRu:
      "Отрицание в румынском образуется с помощью частицы 'nu', которая ставится перед глаголом. Это просто и логично, как в русском 'не'.",
    examples: [
      {
        romanian: "Nu vorbesc română.",
        russian: "Я не говорю по-румынски.",
        explanation: "nu + глагол действительного залога"
      },
      {
        romanian: "Tu nu lucrezi azi.",
        russian: "Ты не работаешь сегодня.",
        explanation: "nu + глагол (вторая форма лица)"
      },
      {
        romanian: "El nu este acasă.",
        russian: "Он не дома.",
        explanation: "nu + глагол 'a fi' (быть)"
      }
    ],
    tip: "Просто ставь 'nu' перед глаголом. Никаких дополнительных форм, как в русском двойном отрицании.",
    category: "negation"
  },

  // ВОПРОСИТЕЛЬНЫЕ СЛОВА
  {
    id: "questions-1",
    title: "Вопросительные слова",
    descriptionRu:
      "Вопросительные слова в румынском: ce (что), cine (кто), unde (где), cum (как), când (когда), cât (сколько).",
    examples: [
      {
        romanian: "Ce faci?",
        russian: "Что ты делаешь?",
        explanation: "'ce' — что"
      },
      {
        romanian: "Cine ești tu?",
        russian: "Кто ты?",
        explanation: "'cine' — кто"
      },
      {
        romanian: "Unde locuiești?",
        russian: "Где ты живёшь?",
        explanation: "'unde' — где"
      },
      {
        romanian: "Cum te numești?",
        russian: "Как тебя зовут?",
        explanation: "'cum' — как"
      },
      {
        romanian: "Când vii?",
        russian: "Когда ты придёшь?",
        explanation: "'când' — когда"
      },
      {
        romanian: "Cât costă?",
        russian: "Сколько это стоит?",
        explanation: "'cât' — сколько"
      }
    ],
    tip: "Вопросительные слова ставятся в начале вопроса, а глагол остаётся на втором месте (как в английском) или иногда третьем (для более вежливого тона).",
    category: "questions"
  },

  // ПОРЯДОК СЛОВ
  {
    id: "word-order-1",
    title: "Основной порядок слов",
    descriptionRu:
      "Основной порядок в румынском: Subject-Verb-Object (SVO). Это как в русском, но порядок стабильнее. Можно менять для интонации, но базовая структура всегда SVO.",
    examples: [
      {
        romanian: "Eu iau un pahar de apă.",
        russian: "Я беру стакан воды.",
        explanation: "Subject (eu) — Verb (iau) — Object (un pahar de apă)"
      },
      {
        romanian: "Tu citești o cărată.",
        russian: "Ты читаешь книгу.",
        explanation: "Subject (tu) — Verb (citești) — Object (o carte)"
      },
      {
        romanian: "Noi cumpărăm flori.",
        russian: "Мы покупаем цветы.",
        explanation: "Subject (noi) — Verb (cumpărăm) — Object (flori)"
      }
    ],
    tip: "Придерживайся порядка SVO при построении предложений. Так русскоязычному ученику будет легче.",
    category: "word-order"
  },

  // ПРИТЯЖАТЕЛЬНЫЕ КОНСТРУКЦИИ
  {
    id: "possessives-1",
    title: "Притяжательные прилагательные",
    descriptionRu:
      "В румынском есть притяжательные прилагательные: meu (мой), tău (твой), al său (его), al/a ei (её) и т.д. Они идут после существительного или перед ним, в зависимости от контекста.",
    examples: [
      {
        romanian: "cartea mea",
        russian: "моя книга",
        explanation: "притяжательное прилагательное 'meu' (мой) + женское окончание -a = mea"
      },
      {
        romanian: "băiatul tău",
        russian: "твой мальчик",
        explanation: "притяжательное 'tău' (твой) согласуется с мужским родом"
      },
      {
        romanian: "casa lui",
        russian: "его дом / его дома",
        explanation: "'lui' — генитив 'он'; конструкция 'casa lui' более традиционна, чем 'sa sa'"
      }
    ],
    tip: "Простой способ: притяжательные прилагательные согласуются с существительным, как и все остальные прилагательные.",
    category: "possessives"
  },

  // ЧИСЛИТЕЛЬНЫЕ
  {
    id: "numerals-1",
    title: "Базовые числительные",
    descriptionRu: "Основные числа от 0 до 10 и их форма. Эти числа нужно запомнить наизусть.",
    examples: [
      { romanian: "zero", russian: "0" },
      { romanian: "unu", russian: "1" },
      { romanian: "doi (m), două (f)", russian: "2 (мужской род, женский род)" },
      { romanian: "trei", russian: "3" },
      { romanian: "patru", russian: "4" },
      { romanian: "cinci", russian: "5" },
      { romanian: "șase", russian: "6" },
      { romanian: "șapte", russian: "7" },
      { romanian: "opt", russian: "8" },
      { romanian: "nouă", russian: "9" },
      { romanian: "zece", russian: "10" }
    ],
    tip: "Запомни первые 10 чисел. Число 'doi'/'două' меняется по родам!",
    category: "numerals"
  },

  // СТЕПЕНИ СРАВНЕНИЯ
  {
    id: "comparison-1",
    title: "Сравнительная и превосходная степени",
    descriptionRu:
      "Для сравнения используют слова 'mai' (более) и 'cel mai' (самый). Например: 'mai frumos' (более красивый), 'cel mai frumos' (самый красивый).",
    examples: [
      {
        romanian: "Această casă este frumoasă.",
        russian: "Этот дом красивый.",
        explanation: "Положительная степень"
      },
      {
        romanian: "Aceasta casă este mai frumoasă.",
        russian: "Этот дом более красивый / красивее.",
        explanation: "Сравнительная степень: mai + прилагательное"
      },
      {
        romanian: "Aceasta casă este cea mai frumoasă.",
        russian: "Этот дом самый красивый.",
        explanation: "Превосходная степень: cea mai + прилагательное"
      }
    ],
    tip: "Используй 'mai' для сравнения и 'cel mai' (или 'cea mai', 'cel mai', взависимости от рода) для превосходной степени.",
    category: "comparison"
  },

  // ЧАСТИЦЫ
  {
    id: "particles-1",
    title: "Возвратная частица 'se'",
    descriptionRu:
      "Частица 'se' (себя) используется в возвратных глаголах и показывает, что действие направлено на само действующее лицо. Пример: 'a se spălá' (мыться), 'a se gândi' (думать).",
    examples: [
      {
        romanian: "Mă spăl.",
        russian: "Я моюсь.",
        explanation: "'mă' (себя в 1-м лице) + глагол 'a spălá'"
      },
      {
        romanian: "Te gândești prea mult.",
        russian: "Ты думаешь слишком много.",
        explanation: "'te' (себя во 2-м лице) + глагол 'a gândi'"
      },
      {
        romanian: "Se joacă în parc.",
        russian: "Они играют в парке (букв. 'играются').",
        explanation: "'se' (себя в 3-м лице) + глагол"
      }
    ],
    tip: "Возвратные глаголы часто используются в румынском. Запоминай их вместе с частицей 'se'.",
    category: "particles"
  },

  // УСТОЙЧИВЫЕ ВЫРАЖЕНИЯ
  {
    id: "expressions-1",
    title: "Приветствия и вежливые фразы",
    descriptionRu:
      "Базовые приветствия, которые используются при встречах и разговоре. Они имеют культурный смысл и должны быть заучены.",
    examples: [
      { romanian: "Bună!", russian: "Привет!" },
      { romanian: "Bună ziua!", russian: "Добрый день!" },
      { romanian: "Bună seara!", russian: "Добрый вечер!" },
      { romanian: "Noapte bună!", russian: "Спокойной ночи!" },
      { romanian: "La revedere!", russian: "До свидания!" },
      { romanian: "Cu plăcere!", russian: "Пожалуйста! / С удовольствием!" }
    ],
    tip: "Выучи базовые приветствия для успешного общения. Они показывают уважение к культуре.",
    category: "expressions"
  },

  {
    id: "expressions-2",
    title: "Фразы вежливости",
    descriptionRu:
      "Вежливые слова и выражения используются в любом общении. Они обязательны для грамотного общения на румынском.",
    examples: [
      { romanian: "Mulțumesc!", russian: "Спасибо!" },
      { romanian: "Nu, mulțumesc.", russian: "Нет, спасибо." },
      { romanian: "Te rog.", russian: "Пожалуйста. / Прошу." },
      { romanian: "Scuze / Scuză-mă.", russian: "Извини / Извините." },
      { romanian: "Permis?", russian: "Разрешишь? / Можно?" },
      { romanian: "De nada!", russian: "Не за что!" }
    ],
    tip: "Вежливость — основа общения. Используй эти фразы постоянно.",
    category: "expressions"
  }
];

export function getGrammarRulesByCategory(category: GrammarCategory): GrammarRule[] {
  return GRAMMAR_RULES.filter((rule) => rule.category === category);
}

export function getGrammarRuleById(id: string): GrammarRule | undefined {
  return GRAMMAR_RULES.find((rule) => rule.id === id);
}

export function getAllGrammarCategories(): GrammarCategory[] {
  const categories = new Set<GrammarCategory>();
  GRAMMAR_RULES.forEach((rule) => categories.add(rule.category as GrammarCategory));
  return Array.from(categories);
}

