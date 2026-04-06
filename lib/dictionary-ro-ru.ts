import type { DictionaryEntry } from '@/lib/types';

/**
 * Румынско-русский словарь
 * Содержит 50+ наиболее частотных румынских слов с полными данными
 * (перевод, примеры, произношение, синонимы)
 */
export const ROMANIAN_RUSSIAN_DICTIONARY: DictionaryEntry[] = [
  // Существительные (предметы, люди)
  {
    id: 'ro_casa',
    romanian: 'casă',
    russian: 'дом',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'ˈka.sə',
    examples: [
      { romanian: 'Eu am o casă mare.', russian: 'У меня большой дом.' },
      { romanian: 'Casa mea este albă.', russian: 'Мой дом белый.' },
      { romanian: 'Locuiesc în această casă.', russian: 'Я живу в этом доме.' }
    ],
    synonyms: ['locuință', 'domiciliu'],
    frequency: 5
  },
  {
    id: 'ro_carte',
    romanian: 'carte',
    russian: 'книга',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'ˈkar.te',
    examples: [
      { romanian: 'Citesc o carte.', russian: 'Я читаю книгу.' },
      { romanian: 'Am doi cărți.', russian: 'У меня две книги.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_om',
    romanian: 'om',
    russian: 'человек',
    partOfSpeech: 'noun',
    gender: 'm',
    ipa: 'om',
    examples: [
      { romanian: 'Un om bun.', russian: 'Хороший человек.' },
      { romanian: 'Toți oamenii sunt egali.', russian: 'Все люди равны.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_femeie',
    romanian: 'femeie',
    russian: 'женщина',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'feˈme.je',
    examples: [
      { romanian: 'O femeie frumoasă.', russian: 'Красивая женщина.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_barbat',
    romanian: 'bărbat',
    russian: 'мужчина',
    partOfSpeech: 'noun',
    gender: 'm',
    ipa: 'bərˈbat',
    examples: [
      { romanian: 'Un bărbat puternic.', russian: 'Сильный мужчина.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_copil',
    romanian: 'copil',
    russian: 'ребёнок',
    partOfSpeech: 'noun',
    gender: 'm',
    ipa: 'koˈpil',
    examples: [
      { romanian: 'Un copil mic.', russian: 'Маленький ребёнок.' },
      { romanian: 'Copiii joacă în parc.', russian: 'Дети играют в парке.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_apă',
    romanian: 'apă',
    russian: 'вода',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'ˈa.pə',
    examples: [
      { romanian: 'Apa este rece.', russian: 'Вода холодная.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_pâine',
    romanian: 'pâine',
    russian: 'хлеб',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'pəˈi.ne',
    examples: [
      { romanian: 'Mănânc pâine la micul dejun.', russian: 'Я ем хлеб на завтрак.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_mâncare',
    romanian: 'mâncare',
    russian: 'еда',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'mənˈka.re',
    examples: [
      { romanian: 'Mâncarea este delicioasă.', russian: 'Еда вкусная.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_soare',
    romanian: 'soare',
    russian: 'солнце',
    partOfSpeech: 'noun',
    gender: 'm',
    ipa: 'soˈa.re',
    examples: [
      { romanian: 'Soarele este cald.', russian: 'Солнце горячее.' }
    ],
    frequency: 5
  },

  // Глаголы (действия)
  {
    id: 'ro_a_merge',
    romanian: 'a merge',
    russian: 'идти, ходить',
    partOfSpeech: 'verb',
    ipa: 'a ˈmer.d͡ʒe',
    examples: [
      { romanian: 'Eu merg la școală.', russian: 'Я иду в школу.' },
      { romanian: 'El merge repede.', russian: 'Он идёт быстро.' },
      { romanian: 'Mâine mergem la cinema.', russian: 'Завтра мы идём в кино.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_a_veni',
    romanian: 'a veni',
    russian: 'приходить, приезжать',
    partOfSpeech: 'verb',
    ipa: 'a ˈve.ni',
    examples: [
      { romanian: 'Vin la ție mâine.', russian: 'Я приду к тебе завтра.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_a_face',
    romanian: 'a face',
    russian: 'делать',
    partOfSpeech: 'verb',
    ipa: 'a ˈfa.t͡ʃe',
    examples: [
      { romanian: 'Ce faci?', russian: 'Что ты делаешь?' },
      { romanian: 'Fac temele.', russian: 'Я делаю домашнее задание.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_a_citi',
    romanian: 'a citi',
    russian: 'читать',
    partOfSpeech: 'verb',
    ipa: 'a t͡ʃiˈti',
    examples: [
      { romanian: 'Citesc o carte.', russian: 'Я читаю книгу.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_a_scrie',
    romanian: 'a scrie',
    russian: 'писать',
    partOfSpeech: 'verb',
    ipa: 'a ˈskri.e',
    examples: [
      { romanian: 'Scriu o scrisoare.', russian: 'Я пишу письмо.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_a_manca',
    romanian: 'a mânca',
    russian: 'есть',
    partOfSpeech: 'verb',
    ipa: 'a mənˈka',
    examples: [
      { romanian: 'Mănânc la ora 12.', russian: 'Я ем в 12 часов.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_a_bea',
    romanian: 'a bea',
    russian: 'пить',
    partOfSpeech: 'verb',
    ipa: 'a beˈa',
    examples: [
      { romanian: 'Beau lapte.', russian: 'Я пью молоко.' }
    ],
    frequency: 4
  },
  {
    id: 'ro_a_dormi',
    romanian: 'a dormi',
    russian: 'спать',
    partOfSpeech: 'verb',
    ipa: 'a dorˈmi',
    examples: [
      { romanian: 'Dorm opt ore pe noapte.', russian: 'Я сплю восемь часов в ночь.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_a_lucra',
    romanian: 'a lucra',
    russian: 'работать',
    partOfSpeech: 'verb',
    ipa: 'a luˈkra',
    examples: [
      { romanian: 'Lucrez la birou.', russian: 'Я работаю в офисе.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_a_invata',
    romanian: 'a învăța',
    russian: 'учиться, изучать',
    partOfSpeech: 'verb',
    ipa: 'a ɪnvəˈtsa',
    examples: [
      { romanian: 'Învăț limba engleză.', russian: 'Я учу английский язык.' }
    ],
    frequency: 5
  },

  // Прилагательные
  {
    id: 'ro_bun',
    romanian: 'bun',
    russian: 'хороший',
    partOfSpeech: 'adjective',
    ipa: 'bun',
    examples: [
      { romanian: 'Un om bun.', russian: 'Хороший человек.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_rau',
    romanian: 'rău',
    russian: 'плохой',
    partOfSpeech: 'adjective',
    ipa: 'rəu',
    examples: [
      { romanian: 'O idee rea.', russian: 'Плохая идея.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_mare',
    romanian: 'mare',
    russian: 'большой',
    partOfSpeech: 'adjective',
    ipa: 'ˈma.re',
    examples: [
      { romanian: 'O casă mare.', russian: 'Большой дом.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_mic',
    romanian: 'mic',
    russian: 'маленький',
    partOfSpeech: 'adjective',
    ipa: 'mik',
    examples: [
      { romanian: 'Un copil mic.', russian: 'Маленький ребёнок.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_frumos',
    romanian: 'frumos',
    russian: 'красивый, красиво',
    partOfSpeech: 'adjective',
    ipa: 'fruˈmos',
    examples: [
      { romanian: 'O femeie frumoasă.', russian: 'Красивая женщина.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_urât',
    romanian: 'urât',
    russian: 'уродливый, некрасивый',
    partOfSpeech: 'adjective',
    ipa: 'uˈrat',
    examples: [
      { romanian: 'O culoare urâtă.', russian: 'Некрасивый цвет.' }
    ],
    frequency: 3
  },
  {
    id: 'ro_cald',
    romanian: 'cald',
    russian: 'горячий, тёплый',
    partOfSpeech: 'adjective',
    ipa: 'kald',
    examples: [
      { romanian: 'Apa caldă.', russian: 'Горячая вода.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_rece',
    romanian: 'rece',
    russian: 'холодный',
    partOfSpeech: 'adjective',
    ipa: 'ˈre.t͡ʃe',
    examples: [
      { romanian: 'Apa rece.', russian: 'Холодная вода.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_lung',
    romanian: 'lung',
    russian: 'длинный',
    partOfSpeech: 'adjective',
    ipa: 'luŋ',
    examples: [
      { romanian: 'O zi lungă.', russian: 'Долгий день.' }
    ],
    frequency: 4
  },
  {
    id: 'ro_scurt',
    romanian: 'scurt',
    russian: 'короткий',
    partOfSpeech: 'adjective',
    ipa: 'skurt',
    examples: [
      { romanian: 'O scrisoare scurtă.', russian: 'Короткое письмо.' }
    ],
    frequency: 4
  },

  // Числа и количества
  {
    id: 'ro_unu',
    romanian: 'unu',
    russian: 'один',
    partOfSpeech: 'numeral',
    ipa: 'ˈu.nu',
    examples: [
      { romanian: 'Am un cărți.', russian: 'У меня одна книга.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_doi',
    romanian: 'doi',
    russian: 'два',
    partOfSpeech: 'numeral',
    ipa: 'doi',
    examples: [
      { romanian: 'Are doi frați.', russian: 'У него два брата.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_trei',
    romanian: 'trei',
    russian: 'три',
    partOfSpeech: 'numeral',
    ipa: 'trej',
    examples: [
      { romanian: 'Trei zile.', russian: 'Три дня.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_patru',
    romanian: 'patru',
    russian: 'четыре',
    partOfSpeech: 'numeral',
    ipa: 'ˈpa.tru',
    examples: [
      { romanian: 'Patru anotimpuri.', russian: 'Четыре сезона.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_cinci',
    romanian: 'cinci',
    russian: 'пять',
    partOfSpeech: 'numeral',
    ipa: 'ˈt͡ʃin.t͡ʃi',
    examples: [
      { romanian: 'Cinci degete.', russian: 'Пять пальцев.' }
    ],
    frequency: 5
  },

  // Местоимения
  {
    id: 'ro_eu',
    romanian: 'eu',
    russian: 'я',
    partOfSpeech: 'pronoun',
    ipa: 'eu',
    examples: [
      { romanian: 'Eu sunt din România.', russian: 'Я из Румынии.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_tu',
    romanian: 'tu',
    russian: 'ты',
    partOfSpeech: 'pronoun',
    ipa: 'tu',
    examples: [
      { romanian: 'Tu cine ești?', russian: 'Кто ты?' }
    ],
    frequency: 5
  },
  {
    id: 'ro_el',
    romanian: 'el',
    russian: 'он',
    partOfSpeech: 'pronoun',
    ipa: 'el',
    examples: [
      { romanian: 'El este fericit.', russian: 'Он счастлив.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_ea',
    romanian: 'ea',
    russian: 'она',
    partOfSpeech: 'pronoun',
    ipa: 'ea',
    examples: [
      { romanian: 'Ea este profesoară.', russian: 'Она учительница.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_noi',
    romanian: 'noi',
    russian: 'мы',
    partOfSpeech: 'pronoun',
    ipa: 'noi',
    examples: [
      { romanian: 'Noi suntem prieteni.', russian: 'Мы друзья.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_voi',
    romanian: 'voi',
    russian: 'вы',
    partOfSpeech: 'pronoun',
    ipa: 'voi',
    examples: [
      { romanian: 'Voi ce faceți?', russian: 'Что вы делаете?' }
    ],
    frequency: 5
  },
  {
    id: 'ro_ei',
    romanian: 'ei',
    russian: 'они (м.р.)',
    partOfSpeech: 'pronoun',
    ipa: 'ei',
    examples: [
      { romanian: 'Ei sunt oameni buni.', russian: 'Они хорошие люди.' }
    ],
    frequency: 5
  },

  // Другие важные слова
  {
    id: 'ro_zi',
    romanian: 'zi',
    russian: 'день',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'zi',
    examples: [
      { romanian: 'Bună ziua!', russian: 'Добрый день!' },
      { romanian: 'O zi frumoasă.', russian: 'Прекрасный день.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_noapte',
    romanian: 'noapte',
    russian: 'ночь',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'noˈap.te',
    examples: [
      { romanian: 'Noapte bună!', russian: 'Спокойной ночи!' }
    ],
    frequency: 5
  },
  {
    id: 'ro_vreme',
    romanian: 'vreme',
    russian: 'время, погода',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'ˈvre.me',
    examples: [
      { romanian: 'Ce vreme este?', russian: 'Какая погода?' }
    ],
    frequency: 5
  },
  {
    id: 'ro_anl',
    romanian: 'an',
    russian: 'год',
    partOfSpeech: 'noun',
    gender: 'm',
    ipa: 'an',
    examples: [
      { romanian: 'Anul acesta.', russian: 'В этом году.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_luna',
    romanian: 'lună',
    russian: 'месяц',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'ˈlu.nə',
    examples: [
      { romanian: 'O lună are 30 de zile.', russian: 'Месяц имеет 30 дней.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_saptamana',
    romanian: 'săptămână',
    russian: 'неделя',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'səpˈtə.mi.nə',
    examples: [
      { romanian: 'O săptămână are 7 zile.', russian: 'Неделя имеет 7 дней.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_ore',
    romanian: 'oră',
    russian: 'час',
    partOfSpeech: 'noun',
    gender: 'f',
    ipa: 'ˈo.rə',
    examples: [
      { romanian: 'Ce oră este?', russian: 'Который час?' }
    ],
    frequency: 5
  },
  {
    id: 'ro_iubesc',
    romanian: 'a iubi',
    russian: 'любить',
    partOfSpeech: 'verb',
    ipa: 'a juˈbi',
    examples: [
      { romanian: 'Te iubesc.', russian: 'Я люблю тебя.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_plac',
    romanian: 'a plăcea',
    russian: 'нравиться, нравится',
    partOfSpeech: 'verb',
    ipa: 'a pləˈt͡ʃea',
    examples: [
      { romanian: 'Îmi place muzica.', russian: 'Мне нравится музыка.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_intelege',
    romanian: 'a înțelege',
    russian: 'понимать',
    partOfSpeech: 'verb',
    ipa: 'a ɪn.tseˈle.d͡ʒe',
    examples: [
      { romanian: 'Nu înțeleg.', russian: 'Я не понимаю.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_vorbesc',
    romanian: 'a vorbi',
    russian: 'говорить',
    partOfSpeech: 'verb',
    ipa: 'a vorˈbi',
    examples: [
      { romanian: 'Vorbesc limba engleză.', russian: 'Я говорю на английском.' }
    ],
    frequency: 5
  },
  {
    id: 'ro_intreb',
    romanian: 'a întreba',
    russian: 'спрашивать',
    partOfSpeech: 'verb',
    ipa: 'a ɪn.treˈba',
    examples: [
      { romanian: 'Mă întreb dacă...', russian: 'Я спрашиваю себя, может ли...' }
    ],
    frequency: 4
  }
];
