import type { PartOfSpeech } from "@/lib/types";

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
  entries: SeedEntry[];
};

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

export const EXPANDED_FAMILIES: DictionaryFamily[] = [
  {
    id: "communication",
    title: "Общение",
    description: "Фразы и слова для разговора, вопросов и общения.",
    entries: [
      e("a întreba", "спрашивать", "Mă pot întreba ceva?", "глагол", "verb"),
      e("a spune", "сказать", "Am spus o glumă.", "глагол", "verb"),
      e("a răspunde", "отвечать", "Trebuie să răspund la email.", "глагол", "verb"),
      e("a explica", "объяснять", "Pot să ți explic regulile?", "глагол", "verb"),
      e("a recomanda", "рекомендовать", "Ți recomand un restaurant bun.", "глагол", "verb"),
      e("a cere", "просить", "Pot ceva de la tine?", "глагол", "verb"),
      e("a invita", "приглашать", "Te invit la petrecere.", "глагол", "verb"),
      e("a confirma", "подтверждать", "Confirm prezenţa la ședință.", "глагол", "verb"),
      e("a comunica", "общаться", "Trbuie să comunic mai bine.", "глагол", "verb"),
      e("a negocia", "договариться", "Îi negotiez preţul.", "глагол", "verb"),
      e("o întrebare", "вопрос", "Am o întrebare pentru tine.", "существительное", "noun"),
      e("o idee", "идея", "Am o idee bună.", "существительное", "noun"),
      e("o informație", "информация", "Am nevoie de o informație.", "существительное", "noun"),
      e("un mesaj", "сообщение", "Am primit un mesaj.", "существительное", "noun"),
      e("o discuție", "обсуждение", "Avem o discuție importantă.", "существительное", "noun"),
      e("o conversație", "разговор", "O conversație lungă.", "существительное", "noun"),
      e("un dialog", "диалог", "Un dialog frumos.", "существительное", "noun"),
      e("o atitudine", "отношение", "O atitudine pozitivă.", "существительное", "noun"),
      e("o propunere", "предложение", "O propunere interesantă.", "существительное", "noun"),
      e("o rugăminte", "просьба", "O rugăminte de ajutor.", "существительное", "noun")
    ]
  },
  {
    id: "everyday-life",
    title: "Повседневная жизнь",
    description: "Частые действия и бытовые рутины.",
    entries: [
      e("a trezi", "будить", "Mă trezesc la 7 ore.", "глагол", "verb"),
      e("a mânca", "есть", "Mânânc prânzul la 12.", "глагол", "verb"),
      e("a bea", "пить", "Beau o ceașă de ceai.", "глагол", "verb"),
      e("a obosi", "уставать", "Obosesc după lucru.", "глагол", "verb"),
      e("a dormi", "спать", "Dorm 8 ore pe noapte.", "глагол", "verb"),
      e("a ie", "выходить", "Ies din casă la 8.", "глагол", "verb"),
      e("a intra", "входить", "Intru în birou.", "глагол", "verb"),
      e("a lucra", "работать", "Lucrez la birou.", "глагол", "verb"),
      e("a studia", "учиться", "Studiez limba română.", "глагол", "verb"),
      e("a juca", "играть", "Joc adesea fotbal.", "глагол", "verb"),
      e("a merge", "идти", "Merg la piață.", "глагол", "verb"),
      e("a veni", "приходить", "Vin acasă la 18 ore.", "глагол", "verb"),
      e("a sta", "стоять", "Stau în stație auto.", "глагол", "verb"),
      e("a șezi", "сидеть", "Șez pe canapea.", "глагол", "verb"),
      e("a cumpăra", "покупать", "Cumpăr după lucru.", "глагол", "verb"),
      e("a plăti", "платить", "Plătesc cu aplicația.", "глагол", "verb"),
      e("a găti", "готовить", "Gătesc cina seara.", "глагол", "verb"),
      e("a spăla", "мыть", "Spăl vasele.", "глагол", "verb"),
      e("a curăța", "убирать", "Curăț camera.", "глагол", "verb"),
      e("a odihni", "отдыхать", "Mă odihnesc în weekend.", "глагол", "verb")
    ]
  },
  {
    id: "clothing",
    title: "Одежда",
    description: "Слова об одежде, цветах и стиле.",
    entries: [
      e("tricou", "футболка", "Tricoul este roșu.", "существительное", "noun"),
      e("cămașă", "рубашка", "Camera albastră.", "существительное", "noun"),
      e("pantaloni", "штаны", "Pantalonii sunt negri.", "существительное", "noun"),
      e("fustă", "юбка", "Fusta este verde.", "существительное", "noun"),
      e("rochie", "платье", "Rochia este frumoasă.", "существительное", "noun"),
      e("geacă", "куртка", "Geaca de iarnă.", "существительное", "noun"),
      e("pulover", "свитер", "Puloaverul este cald.", "существительное", "noun"),
      e("pantofi", "туфли", "Pantofii sunt comod.", "существительное", "noun"),
      e("șosete", "носки", "Șosetele sunt albe.", "существительное", "noun"),
      e("căciulă", "шапка", "Căciula este din lână.", "существительное", "noun"),
      e("eșarfă", "шарф", "Eșarfa protejează de frig.", "существительное", "noun"),
      e("costum", "костюм", "Costumul este negru.", "существительное", "noun"),
      e("sacou", "пиджак", "Sacoul este elegant.", "существительное", "noun"),
      e("bluză", "блузка", "Bluzna este roz.", "существительное", "noun"),
      e("halat", "халат", "Halatul este confortabil.", "существительное", "noun"),
      e("roșu", "красный", "Culoarea roșie.", "прилагательное", "adjective"),
      e("albastru", "синий", "Albastrul este frumos.", "прилагательное", "adjective"),
      e("verde", "зеленый", "Verdele e natural.", "прилагательное", "adjective"),
      e("galben", "желтый", "Galbenenul este cald.", "прилагательное", "adjective"),
      e("negru", "черный", "Negrul e clasic.", "прилагательное", "adjective")
    ]
  },
  {
    id: "furniture",
    title: "Мебель",
    description: "Предметы интерьера и мебель для дома.",
    entries: [
      e("scaun", "стул", "Scaunul este confortabil.", "существительное", "noun"),
      e("masă", "стол", "Masa este mare.", "существительное", "noun"),
      e("pat", "кровать", "Patul este moale.", "существительное", "noun"),
      e("canapea", "диван", "Canapea este modernă.", "существительное", "noun"),
      e("dulap", "шкаф", "Dulapul este plin.", "существительное", "noun"),
      e("raft", "полка", "Raful are cărți.", "существительное", "noun"),
      e("lampă", "лампа", "Lampa este claramente.", "существительное", "noun"),
      e("covor", "ковер", "Covor este roșu.", "существительное", "noun"),
      e("oglindă", "зеркало", "Oglinda este mare.", "существительное", "noun"),
      e("perdea", "штора", "Perdeaua este albă.", "существительное", "noun"),
      e("birou", "письменный стол", "Biurul este solid.", "существительное", "noun"),
      e("noptieră", "тумбочка", "Nopţiera are sertar.", "существительное", "noun"),
      e("fotoliu", "кресло", "Fotoliuul este larg.", "существительное", "noun"),
      e("frigider", "холодильник", "Frigiderul este plin.", "существительное", "noun"),
      e("masă de bucătărie", "кухонный стол", "Masa de bucătărie.", "существительное", "noun"),
      e("mare", "большой", "Apartamentul este mare.", "прилагательное", "adjective"),
      e("mic", "маленький", "Camera este mică.", "прилагательное", "adjective"),
      e("confortabil", "удобный", "Scaunul este confortabil.", "прилагательное", "adjective"),
      e("modern", "современный", "Designul este modern.", "прилагательное", "adjective"),
      e("vechi", "старый", "Masa este veche.", "прилагательное", "adjective")
    ]
  },
  {
    id: "food",
    title: "Еда и напитки",
    description: "Лексика о продуктах питания и кулинарии.",
    entries: [
      e("apă", "вода", "Beau apă rece.", "существительное", "noun"),
      e("pâine", "хлеб", "Pâinea este proaspătă.", "существительное", "noun"),
      e("lapte", "молоко", "Laptele este cald.", "существительное", "noun"),
      e("brânză", "сыр", "Brânza e delicioasă.", "существительное", "noun"),
      e("unt", "масло", "Untul este gal.", "существительное", "noun"),
      e("carne", "мясо", "Carnea este suculentă.", "существительное", "noun"),
      e("pește", "рыба", "Peștele este proaspăt.", "существительное", "noun"),
      e("măr", "яблоко", "Mărul este dulce.", "существительное", "noun"),
      e("pară", "груша", "Pârul este suculentă.", "существительное", "noun"),
      e("portocală", "апельсин", "Portocala este acră.", "существительное", "noun"),
      e("lămâie", "лимон", "Lămâia este acid.", "существительное", "noun"),
      e("tomate", "помидор", "Tomate sunt roșii.", "существительное", "noun"),
      e("castravete", "огурец", "Castravelul este verde.", "существительное", "noun"),
      e("ciocolată", "шоколад", "Ciocolata este neagră.", "существительное", "noun"),
      e("zahăr", "сахар", "Zahărul e dulce.", "существительное", "noun"),
      e("sare", "соль", "Sarea este albă.", "существительное", "noun"),
      e("piper", "перец", "Pipertul e ascuțit.", "существительное", "noun"),
      e("cafea", "кофе", "Cafeaua este caldă.", "существительное", "noun"),
      e("ceai", "чай", "Ceaiul este verde.", "существительное", "noun"),
      e("vin", "вино", "Vinul este roșu.", "существительное", "noun")
    ]
  },
  {
    id: "health-body-large",
    title: "Здоровье и тело",
    description: "Части тела, здоровье и самочувствие.",
    entries: [
      e("cap", "голова", "Capul mă doare.", "существительное", "noun"),
      e("frunze", "лоб", "Am rănit fruntea.", "существительное", "noun"),
      e("ochi", "глаз", "Ochii mei sunt albaștri.", "существительное", "noun"),
      e("ureche", "ухо", "Urechea mă doare.", "существительное", "noun"),
      e("nas", "нос", "Nasul curge.", "существительное", "noun"),
      e("gură", "рот", "Gura este mare.", "существительное", "noun"),
      e("dinte", "зуб", "Dinții doare.", "существительное", "noun"),
      e("limbă", "язык", "Limba curge.", "существительное", "noun"),
      e("gât", "горло", "Gâtul doare.", "существительное", "noun"),
      e("umăr", "плечо", "Umerul doare.", "существительное", "noun"),
      e("braț", "рука", "Brațul stâng.", "существительное", "noun"),
      e("cot", "локоть", "Cotul rănit.", "существительное", "noun"),
      e("mână", "кисть руки", "Mâna este caldă.", "существительное", "noun"),
      e("deget", "палец", "Degetul este mic.", "существительное", "noun"),
      e("piept", "грудь", "Pieptul ridicat.", "существительное", "noun"),
      e("inimă", "сердце", "Inima bate rapid.", "существительное", "noun"),
      e("pulmă", "легкое", "Pulmă sănătoasă.", "существительное", "noun"),
      e("stomac", "желудок", "Stomacul doare.", "существительное", "noun"),
      e("ficat", "печень", "Ficatul lucrează bine.", "существительное", "noun"),
      e("rinichi", "почка", "Rinichii filtrează.", "существительное", "noun"),
      e("picior", "нога", "Piciorul doare.", "существительное", "noun"),
      e("genunchi", "колено", "Genunchiul este flexibil.", "существительное", "noun"),
      e("gleznă", "лодыжка", "Glezna este mică.", "существительное", "noun"),
      e("picioar", "стопа", "Picioarele sunt obosite.", "существительное", "noun"),
      e("piele", "кожа", "Pielea e sensibilă.", "существительное", "noun"),
      e("os", "кость", "Osul este solid.", "существительное", "noun"),
      e("mușchi", "мышца", "Mușchii sunt tari.", "существительное", "noun"),
      e("sânge", "кровь", "Sânge curge.", "существительное", "noun"),
      e("transpirație", "пот", "Transpirația curge.", "существительное", "noun"),
      e("lacrimi", "слезы", "Lacrimile curg.", "существительное", "noun")
    ]
  },
  {
    id: "work-study-large",
    title: "Работа и учеба",
    description: "Слова для работы, учебы и профессионального общения.",
    entries: [
      e("birou", "офис", "Lucrez la birou.", "существительное", "noun"),
      e("calculator", "компьютер", "Calculatorul merge bine.", "существительное", "noun"),
      e("email", "электронная почта", "Trimit un email.", "существительное", "noun"),
      e("ședință", "встреча", "Ședința este la 10.", "существительное", "noun"),
      e("proiect", "проект", "Lucrez la proiect.", "существительное", "noun"),
      e("document", "документ", "Iau documentul.", "существительное", "noun"),
      e("raport", "отчет", "Raportul este important.", "существительное", "noun"),
      e("contract", "контракт", "Semn contractul.", "существительное", "noun"),
      e("client", "клиент", "Clientul este fericit.", "существительное", "noun"),
      e("coleg", "коллега", "Colegul este amabil.", "существительное", "noun"),
      e("șef", "начальник", "Șeful meu e strict.", "существительное", "noun"),
      e("salariu", "зарплата", "Salariul e bun.", "существительное", "noun"),
      e("bonus", "бонус", "Primesc bonus.", "существительное", "noun"),
      e("venit", "доход", "Venitul crește.", "существительное", "noun"),
      e("impozit", "налог", "Impozit e obligatoriu.", "существительное", "noun"),
      e("pensie", "пенсия", "Pensia se calculează.", "существительное", "noun"),
      e("vacanță", "отпуск", "Voi luam vacanță.", "существительное", "noun"),
      e("curs", "курс", "Urmez un curs.", "существительное", "noun"),
      e("lecție", "урок", "Lecția dura 2 ore.", "существительное", "noun"),
      e("examen", "экзамен", "Examenul e ușor.", "существительное", "noun"),
      e("grad", "степень", "Am gradul pe diploma.", "существительное", "noun"),
      e("certificat", "сертификат", "Primesc certificat.", "существительное", "noun"),
      e("skill", "навык", "Dezvolt noi skill-uri.", "существительное", "noun"),
      e("responsabilitate", "ответственность", "Responsabilitatea e mare.", "существительное", "noun"),
      e("carieră", "карьера", "Cariera mea avansează.", "существительное", "noun"),
      e("a lucra", "работать", "Lucrez 8 ore.", "глаголл", "verb"),
      e("a studia", "учиться", "Studiez limba română.", "глагол", "verb"),
      e("a învăța", "изучать", "Învăț pe calculator.", "глагол", "verb"),
      e("a rezolva", "решать", "Rezolv problema.", "глагол", "verb"),
      e("a presenta", "представлять", "Prezint proiectul.", "глагол", "verb")
    ]
  },
  {
    id: "nature-weather-large",
    title: "Природа и погода",
    description: "Слова о погоде, сезонах и природе.",
    entries: [
      e("soare", "солнце", "Soarele strălucește.", "существительное", "noun"),
      e("lună", "луна", "Luna este plină.", "существительное", "noun"),
      e("stea", "звезда", "Stelele strălucesc.", "существительное", "noun"),
      e("nor", "облако", "Norii sunt albi.", "существительное", "noun"),
      e("ploaie", "дождь", "Ploaia cade ușor.", "существительное", "noun"),
      e("zăpadă", "снег", "Zăpada acoperă pământul.", "существительное", "noun"),
      e("grindină", "град", "Grindina distruge.", "существительное", "noun"),
      e("tunet", "гром", "Tunetu bate.", "существительное", "noun"),
      e("fulger", "молния", "Fulgeru iluminează.", "существительное", "noun"),
      e("vânt", "ветер", "Vântul suflă.", "существительное", "noun"),
      e("furtună", "буря", "Furtuna e puternică.", "существительное", "noun"),
      e("vapori", "туман", "Vaporu acoperă munții.", "существительное", "noun"),
      e("uscăciune", "засуха", "Uscăciunea distruge culturile.", "существительное", "noun"),
      e("primăvară", "весна", "Primăvara este frumoasă.", "существительное", "noun"),
      e("vară", "лето", "Vara e caldă.", "существительное", "noun"),
      e("toamnă", "осень", "Toamna cad frunzele.", "существительное", "noun"),
      e("iarnă", "зима", "Iarna e rece.", "существительное", "noun"),
      e("cald", "горячий", "Este cald azi.", "прилагательное", "adjective"),
      e("rece", "холодный", "Este rece afară.", "прилагательное", "adjective"),
      e("umed", "влажный", "Aerul e umed.", "прилагательное", "adjective"),
      e("uscăt", "сухой", "Ochii sunt uscați.", "прилагательное", "adjective"),
      e("înnorat", "облачный", "Este înnorat azi.", "прилагательное", "adjective"),
      e("senin", "ясный", "Cerul e senin.", "прилагательное", "adjective"),
      e("geros", "промерзший", "Este gerou.", "прилагательное", "adjective"),
      e("cețos", "туманный", "Dimineaţa e cețoasă.", "прилагательное", "adjective"),
      e("ploios", "дождливый", "Ziua e ploioasă.", "прилагательное", "adjective"),
      e("vrăjbă", "враг", "Vrăjba e rece.", "существительное", "noun")
    ]
  },
  {
    id: "feelings-large",
    title: "Чувства и эмоции",
    description: "Слова о настроении, эмоциях и чувствах.",
    entries: [
      e("bucurie", "радость", "Bucuria e în inimă.", "существительное", "noun"),
      e("tristețe", "грусть", "Tristețea e grea.", "существительное", "noun"),
      e("mânie", "злость", "Mânia explodează.", "существительное", "noun"),
      e("frică", "страх", "Frica paralizeaza.", "существительное", "noun"),
      e("surpriză", "удивление", "Surpriza e plăcută.", "существительное", "noun"),
      e("dezgust", "отвращение", "Degustul e clar.", "существительное", "noun"),
      e("jenă", "стыд", "Jena e cald.", "существительное", "noun"),
      e("mândrie", "гордость", "Mândria e nobilă.", "существительное", "noun"),
      e("iubire", "любовь", "Iubirea e eternă.", "существительное", "noun"),
      e("ură", "ненависть", "Ura distruge.", "существительное", "noun"),
      e("nădejde", "надежда", "Nădejde se-ntoarce.", "существительное", "noun"),
      e("deznădejde", "отчаяние", "Deznădejda e grea.", "существительное", "noun"),
      e("relaxare", "расслабление", "Relaxarea e necesară.", "существительное", "noun"),
      e("emoție", "эмоция", "Emoția e puternică.", "существительное", "noun"),
      e("pasiune", "страсть", "Pasiunea mă motivează.", "существительное", "noun"),
      e("fericire", "счастье", "Fericirea e greu.", "существительное", "noun"),
      e("nefericire", "несчастье", "Nefericirea doare.", "существительное", "noun"),
      e("entuziasm", "энтузиазм", "Entuziasmul e zarazitor.", "существительное", "noun"),
      e("apatie", "апатия", "Apatia paralizează.", "существительное", "noun"),
      e("curaj", "смелость", "Curajul e necesar.", "существительное", "noun"),
      e("laşitate", "трусость", "Lașitatea e rușinoasă.", "существительное", "noun"),
      e("bucuros", "радостный", "Sunt bucuros azi.", "прилагательное", "adjective"),
      e("trist", "грустный", "Sunt trist azi.", "прилагательное", "adjective"),
      e("furios", "разозленный", "Sunt furios pe tine.", "прилагательное", "adjective"),
      e("speriat", "испуганный", "Sunt speriat.", "прилагательное", "adjective"),
      e("surprins", "удивленный", "Sunt surprins!", "прилагательное", "adjective"),
      e("îngrijcat", "обеспокоенный", "Sunt îngrijcat.", "прилагательное", "adjective"),
      e("relaxat", "расслабленный", "Sunt relaxat.", "прилагательное", "adjective"),
      e("motivat", "мотивированный", "Sunt motivat.", "прилагательное", "adjective"),
      e("obosit", "усталый", "Sunt obosit.", "прилагательное", "adjective")
    ]
  },
  {
    id: "people-relations-large",
    title: "Люди и отношения",
    description: "Слова про семью, друзей и отношения.",
    entries: [
      e("mamă", "мама", "Mama e frumoasă.", "существительное", "noun"),
      e("tată", "папа", "Tata e tare.", "существительное", "noun"),
      e("fiică", "дочка", "Fiica este smardă.", "существительное", "noun"),
      e("fiu", "сын", "Fioul este gras.", "существительное", "noun"),
      e("soț", "муж", "Soțul meu e bun.", "существительное", "noun"),
      e("soție", "жена", "Soția mea e frumoasă.", "существительное", "noun"),
      e("frate", "брат", "Fratele meu e tânăr.", "существительное", "noun"),
      e("soră", "сестра", "Sora mea e frumoasă.", "существительное", "noun"),
      e("bunic", "дедушка", "Bunicul meu e bătrân.", "существительное", "noun"),
      e("bunică", "бабушка", "Bunica mea e dulce.", "существительное", "noun"),
      e("unchi", "дядя", "Unchiul meu e bogat.", "существительное", "noun"),
      e("mătuși", "тетя", "Mătușa mea e liniștiță.", "существительное", "noun"),
      e("verișor", "кузен", "Verișorul meu e caraghios.", "существительное", "noun"),
      e("prietenă", "подруга", "Prietena mea e dragă.", "существительное", "noun"),
      e("prieten", "друг", "Prietenul meu e loial.", "существительное", "noun"),
      e("vecin", "сосед", "Vecinul e tăcut.", "существительное", "noun"),
      e("coleg", "коллега", "Colegul meu e aiutor.", "существительное", "noun"),
      e("șef", "начальник", "Șeful meu e corect.", "существительное", "noun"),
      e("angajat", "сотрудник", "Angajații sunt diligent.", "существительное", "noun"),
      e("patron", "работодатель", "Patronul meu e justiții.", "существительное", "noun"),
      e("om", "мужчина/человек", "Omul este înțelept.", "существительное", "noun"),
      e("femeie", "женщина", "Femeia e elegantă.", "существительное", "noun"),
      e("copil", "ребёнок", "Copilul e vesel.", "существительное", "noun"),
      e("adolescent", "подросток", "Adolescentul e schimbător.", "существительное", "noun"),
      e("bătrân", "старик", "Bătrânul e calm.", "существительное", "noun"),
      e("străin", "незнакомец", "Străinul e poleit.", "существительное", "noun"),
      e("inim", "враг", "Inamicul e pericol.", "существительное", "noun"),
      e("rival", "соперник", "Rivalul meu e tare.", "существительное", "noun"),
      e("partener", "партнер", "Partenerul meu e fiabil.", "существительное", "noun"),
      e("social", "социальный", "Rețeaua socidă.", "прилагательное", "adjective")
    ]
  },
  {
    id: "expressions",
    title: "Устойчивые выражения",
    description: "Частые фразы, которые звучат естественно.",
    entries: [
      e("Bună!", "Привет!", "Bună, cum ești?", "приветствие", "expression"),
      e("Bună ziua!", "Добрый день!", "Bună ziua, doamnă!", "приветствие", "expression"),
      e("Bună seara!", "Добрый вечер!", "Bună seara, domn!", "приветствие", "expression"),
      e("Noapte bună!", "Спокойной ночи!", "Noapte bună, dormi bine!", "приветствие", "expression"),
      e("La revedere!", "До свидания!", "La revedere, salut!", "приветствие", "expression"),
      e("Pa!", "Пока!", "Pa, văd mai târziu!", "приветствие", "expression"),
      e("Mulțumesc!", "Спасибо!", "Mulțumesc mult!", "вежливость", "expression"),
      e("Nu, mulțumesc.", "Нет, спасибо.", "Nu, mulțumesc, sunt bine.", "вежливость", "expression"),
      e("Te rog.", "Пожалуйста.", "Te rog, vorbește ușor.", "вежливость", "expression"),
      e("Cu plăcere!", "Пожалуйста! / С удовольствием!", "Cu plăcere, nu e problemă.", "вежливость", "expression"),
      e("Scuze!", "Извини!", "Scuze, trebui cu atenție.", "вежливость", "expression"),
      e("Scuza-mă.", "Извини меня.", "Scuza-mă, nu era intenţie.", "вежливость", "expression"),
      e("Permis?", "Разрешишь?", "Permis, pot intra?", "вежливость", "expression"),
      e("De nada!", "Не за что!", "De nada, orice vreme.", "вежливость", "expression"),
      e("Bine ți-o mai.", "Хорошо тебе!", "Bine ți-o mai, succes!", "приветствие", "expression"),
      e("Succes!", "Удачи!", "Succes la examen!", "поощрение", "expression"),
      e("Felicitări!", "Поздравления!", "Felicitări cu ziua!", "поощрение", "expression"),
      e("Adevăr?", "Правда?", "Adevăr, nu știu!", "выражение", "expression"),
      e("Desigur!", "Конечно!", "Desigur, fără problemă!", "согласие", "expression"),
      e("Sigur nu?", "Вы уверены?", "Sigur nu vrei ceva?", "сомнение", "expression")
    ]
  },
  {
    id: "travel-city-large",
    title: "Путешествия и город",
    description: "Слова для путешествий, коридоров и ориентирования.",
    entries: [
      e("gară", "вокзал", "Gara e mare.", "существительное", "noun"),
      e("aeroport", "аэропорт", "Aeroportul e departe.", "существительное", "noun"),
      e("autobuz", "автобус", "Autobuzul e plin.", "существительное", "noun"),
      e("tramvai", "трамвай", "Tramvaiul merge lent.", "существительное", "noun"),
      e("metrou", "метро", "Metrou e rapid.", "существительное", "noun"),
      e("taxi", "такси", "Taxi e scump.", "существительное", "noun"),
      e("mașinăDulap", "машина", "Mașina e nouă.", "существительное", "noun"),
      e("bicicletă", "велосипед", "Bicicleta e ușoară.", "существительное", "noun"),
      e("motocicletă", "мотоцикл", "Motocicleta e rapidă.", "существительное", "noun"),
      e("tren", "поезд", "Trenul e rapid.", "существительное", "noun"),
      e("vapor", "корабль", "Vaporu e mare.", "существительное", "noun"),
      e("avion", "самолет", "Avionul e modern.", "существительное", "noun"),
      e("cale ferată", "железная дорога", "Calea ferată e lungă.", "существительное", "noun"),
      e("stație", "станция", "Stația e plină.", "существительное", "noun"),
      e("bilet", "билет", "Biletul costă 10 lei.", "существительное", "noun"),
      e("peron", "платформа", "Peronul e număru 3.", "существительное", "noun"),
      e("se-ngalej", "задержка", "Se-ngaleju de 30 min.", "существительное", "noun"),
      e("direcție", "направление", "Care e direcția?", "существительное", "noun"),
      e("hartă", "карта", "Harta e detaliată.", "существительное", "noun"),
      e("GPS", "GPS", "GPS e util.", "существительное", "noun"),
      e("hotel", "гостиница", "Hotel e confortabil.", "существительное", "noun"),
      e("cameră", "номер (в отеле)", "Camera e liniștie.", "существительное", "noun"),
      e("restaurant", "ресторан", "Restaurantul e bun.", "существительное", "noun"),
      e("cafenea", "кафе", "Cafeneaua e caldă.", "существительное", "noun"),
      e("muzeu", "музей", "Muzeu e interesant.", "существительное", "noun"),
      e("țară", "страна", "Țara e frumoasă.", "существительное", "noun"),
      e("oraš", "город", "Orașul e mic.", "существительное", "noun"),
      e("sat", "деревня", "Satul e liniștie.", "существительное", "noun"),
      e("plouem", "площадь", "Piața e centrală.", "существительное", "noun"),
      e("stradă", "улица", "Strada e lungă.", "существительное", "noun")
    ]
  }
];
