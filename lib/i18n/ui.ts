import type { Lang } from "./index";

export interface UITranslations {
  // Buttons
  run: string;
  step: string;
  back: string;
  play: string;
  pause: string;
  reset: string;
  goToStart: string;

  // Panel headers
  editor: string;
  visualizer: string;
  stepInfo: string;
  timeline: string;
  memory: string;
  console: string;
  condition: string;
  flow: string;
  callStack: string;
  explanation: string;
  loopLabel: string;

  // Status
  stepOf: (current: number, total: number) => string;
  variable: (count: number) => string;
  lines: (count: number) => string;

  // Idle state
  readyTitle: string;
  readyDesc: string;
  readyHint: string;

  // Panels
  noVariables: string;
  noVariablesDesc: string;
  noOutput: string;
  noStepSelected: string;
  timelineEmpty: string;
  explanationEmpty: string;

  // Labels in condition
  condLeft: string;
  condRight: string;
  condResult: string;

  // Memory snapshot
  memSnapshot: string;
  consoleLines: (n: number) => string;

  // Step type labels
  stepType_program_start: string;
  stepType_program_end: string;
  stepType_declare_variable: string;
  stepType_assign_variable: string;
  stepType_update_variable: string;
  stepType_evaluate_condition: string;
  stepType_enter_if: string;
  stepType_enter_else: string;
  stepType_skip_if: string;
  stepType_skip_else: string;
  stepType_console_output: string;
  stepType_loop_iteration: (n: number) => string;
  stepType_loop_condition: string;
  stepType_loop_end: string;
  stepType_function_declare: string;
  stepType_function_call: (name: string) => string;
  stepType_function_return: (name: string) => string;
  stepType_step_limit: string;

  // Detail labels
  detailName: string;
  detailBefore: string;
  detailValue: string;
  detailType: string;
  detailOp: string;
  detailExpr: string;
  detailResult: string;
  detailLoop: string;
  detailIteration: string;
  detailTotalRuns: string;
  detailParams: string;
  detailArgs: string;
  detailFrom: string;
  detailNone: string;
  detailLoopFor: string;
  detailLoopWhile: string;
  detailLoopDoWhile: string;
  detailLoopForOf: string;
  detailLoopForIn: string;

  // Next step hint
  next: string;
  onLine: (n: number) => string;

  // Program complete
  programComplete: string;
  programCompleteDesc: string;

  // Error
  errorTitle: string;
  errorHint: string;

  // Iteration badge
  iterationLabel: string;

  // Function entering
  enteringFunction: string;

  // Presets
  presets: string;
  presetBasicIf: string;
  presetForLoop: string;
  presetWhileLoop: string;
  presetFunctions: string;
  presetArrays: string;
  presetObjects: string;
  presetNestedIf: string;
  presetFibonacci: string;

  // Landing
  heroTag: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  openPlayground: string;
  learnMore: string;

  // Footer
  footerDesc: string;

  // Home page
  homeBadge: string;
  homeTitle1: string;
  homeTitle2: string;
  homeSubtitle: string;
  homeJsSubtitle: string;
  homeCssTitle: string;
  homeCssSubtitle: string;
  homeOpen: string;
  homeFeaturesTitle: string;
  homeFeaturesSubtitle: string;
  homeHowTitle: string;
  homeHowSubtitle: string;
  homeCtaTitle: string;
  homeCtaSubtitle: string;
  homeFooterDesc2: string;
  homeFeatures: { title: string; desc: string }[];
  homeSteps: { title: string; description: string }[];
}

const en: UITranslations = {
  run: "Run",
  step: "Step",
  back: "Back",
  play: "Play",
  pause: "Pause",
  reset: "Reset",
  goToStart: "Go to start",

  editor: "Editor",
  visualizer: "Visualizer",
  stepInfo: "Step Info",
  timeline: "Timeline",
  memory: "Memory",
  console: "Console",
  condition: "Condition",
  flow: "Flow",
  callStack: "Call Stack",
  explanation: "Explanation",
  loopLabel: "Loop",

  stepOf: (c, t) => `Step ${c} of ${t}`,
  variable: (n) => `${n} var${n !== 1 ? "s" : ""}`,
  lines: (n) => `${n} line${n !== 1 ? "s" : ""}`,

  readyTitle: "Ready to visualize",
  readyDesc: "Write your code and click Run",
  readyHint: "Supports loops, functions, arrays, objects…",

  noVariables: "No variables yet",
  noVariablesDesc: "Run code to see memory",
  noOutput: "No output yet...",
  noStepSelected: "No step selected",
  timelineEmpty: "Timeline will appear after running code",
  explanationEmpty: "Run code to see step explanations",

  condLeft: "Left",
  condRight: "Right",
  condResult: "Result",

  memSnapshot: "Memory snapshot",
  consoleLines: (n) => `Console (${n} line${n !== 1 ? "s" : ""})`,

  stepType_program_start: "Program Start",
  stepType_program_end: "Program End",
  stepType_declare_variable: "Variable Declaration",
  stepType_assign_variable: "Variable Assignment",
  stepType_update_variable: "Variable Update",
  stepType_evaluate_condition: "Condition Evaluation",
  stepType_enter_if: "Enter IF Block",
  stepType_enter_else: "Enter ELSE Block",
  stepType_skip_if: "Skip IF Block",
  stepType_skip_else: "Skip ELSE Block",
  stepType_console_output: "Console Output",
  stepType_loop_iteration: (n) => `Loop — Iteration ${n}`,
  stepType_loop_condition: "Loop Condition",
  stepType_loop_end: "Loop Finished",
  stepType_function_declare: "Function Defined",
  stepType_function_call: (name) => `Calling ${name}()`,
  stepType_function_return: (name) => `Return from ${name}()`,
  stepType_step_limit: "Execution Stopped",

  detailName: "name",
  detailBefore: "before",
  detailValue: "value",
  detailType: "type",
  detailOp: "op",
  detailExpr: "expr",
  detailResult: "result",
  detailLoop: "loop",
  detailIteration: "iteration",
  detailTotalRuns: "total runs",
  detailParams: "params",
  detailArgs: "args",
  detailFrom: "from",
  detailNone: "none",
  detailLoopFor: "for",
  detailLoopWhile: "while",
  detailLoopDoWhile: "do-while",
  detailLoopForOf: "for-of",
  detailLoopForIn: "for-in",

  next: "Next →",
  onLine: (n) => ` on line ${n}`,

  programComplete: "Program complete!",
  programCompleteDesc:
    "Step backward to review, or modify the code and run again.",

  errorTitle: "Error",
  errorHint: "Check your syntax and try again.",

  iterationLabel: "Loop iteration",
  enteringFunction: "Entering function",

  presets: "Presets",
  presetBasicIf: "If / Else",
  presetForLoop: "For Loop",
  presetWhileLoop: "While Loop",
  presetFunctions: "Functions",
  presetArrays: "Arrays",
  presetObjects: "Objects",
  presetNestedIf: "Nested If",
  presetFibonacci: "Fibonacci",

  heroTag: "JavaScript Execution Visualizer",
  heroTitle1: "See exactly how",
  heroTitle2: "JavaScript runs",
  heroSubtitle:
    "LogicJS visualizes your code execution step by step. Watch variables come to life, conditions get evaluated, and branches get chosen — all in real time.",
  openPlayground: "Open Playground",
  learnMore: "Learn more",

  footerDesc: "Built for JavaScript learners everywhere",

  homeBadge: "Interactive learning platform",
  homeTitle1: "Learn by",
  homeTitle2: "seeing code",
  homeSubtitle: "Understand JavaScript and CSS visually and interactively. See exactly what happens at every single step.",
  homeJsSubtitle: "Watch your code execute step by step. Variables, conditions, loops, functions — all visible in real time.",
  homeCssTitle: "Layout Visualizer",
  homeCssSubtitle: "Learn Flexbox, Grid and animations by clicking buttons. Every property updates live — no setup needed.",
  homeOpen: "Open",
  homeFeaturesTitle: "Why LogicLab?",
  homeFeaturesSubtitle: "Couldn't understand by reading? Learn by seeing — it's much easier.",
  homeHowTitle: "How does it work?",
  homeHowSubtitle: "3 steps — that's all",
  homeCtaTitle: "Start learning",
  homeCtaSubtitle: "Everything you need to learn JavaScript and CSS in a clear and interactive way is right here.",
  homeFooterDesc2: "For JavaScript and CSS learners",
  homeFeatures: [
    { title: "Visual execution", desc: "See how code works with your own eyes. Every step is shown with animation." },
    { title: "Memory state", desc: "See how variables are stored in memory and how their values change over time." },
    { title: "Conditions & branches", desc: "See how if/else conditions are checked and which block gets executed." },
    { title: "Flexbox visualizer", desc: "flex-direction, justify-content, align-items — change them live with a click." },
    { title: "Grid visualizer", desc: "Columns, gaps, span — understand CSS Grid by interacting with it." },
    { title: "CSS animations", desc: "@keyframes, timing-function, duration — learn by watching real animations." },
    { title: "Console output", desc: "See when and with which value console.log is called, at that exact moment." },
    { title: "Plain explanations", desc: "Each step has a simple description — what happened, when and why." },
    { title: "Step-by-step control", desc: "Forward, back, speed control — learn at your own pace. Auto-play included." },
  ],
  homeSteps: [
    { title: "Choose a tool", description: "Open the JavaScript playground or CSS visualizer." },
    { title: "Write or pick code", description: "Write your own code or choose from ready-made examples." },
    { title: "See it visually", description: "Press Run → each step is explained with animation." },
  ],
};

const uz: UITranslations = {
  run: "Ishga tushirish",
  step: "Qadam",
  back: "Orqaga",
  play: "Ijro",
  pause: "To'xtatish",
  reset: "Qayta boshlash",
  goToStart: "Boshiga o'tish",

  editor: "Muharrir",
  visualizer: "Vizualizator",
  stepInfo: "Qadam ma'lumoti",
  timeline: "Vaqt o'qi",
  memory: "Xotira",
  console: "Konsol",
  condition: "Shart",
  flow: "Oqim",
  callStack: "Chaqiruv stek",
  explanation: "Tushuntirish",
  loopLabel: "Tsikl",

  stepOf: (c, t) => `Qadam ${c} / ${t}`,
  variable: (n) => `${n} o'zgaruvchi`,
  lines: (n) => `${n} satr`,

  readyTitle: "Vizualizatsiyaga tayyor",
  readyDesc: "Kodni yozing va «Ishga tushirish»ni bosing",
  readyHint: "Tsikllar, funksiyalar, massivlar, obyektlar...",

  noVariables: "Hali o'zgaruvchilar yo'q",
  noVariablesDesc: "Xotirani ko'rish uchun kodni ishga tushiring",
  noOutput: "Hali chiqish yo'q...",
  noStepSelected: "Qadam tanlanmagan",
  timelineEmpty: "Vaqt o'qi kodni ishga tushirgandan so'ng ko'rinadi",
  explanationEmpty: "Qadam tushuntirishlarini ko'rish uchun kodni ishga tushiring",

  condLeft: "Chap",
  condRight: "O'ng",
  condResult: "Natija",

  memSnapshot: "Xotira holati",
  consoleLines: (n) => `Konsol (${n} satr)`,

  stepType_program_start: "Dastur boshlanmoqda",
  stepType_program_end: "Dastur tugadi",
  stepType_declare_variable: "O'zgaruvchi e'lon qilish",
  stepType_assign_variable: "Qiymat berish",
  stepType_update_variable: "O'zgaruvchini yangilash",
  stepType_evaluate_condition: "Shartni tekshirish",
  stepType_enter_if: "IF blokiga kirish",
  stepType_enter_else: "ELSE blokiga kirish",
  stepType_skip_if: "IF blokini o'tkazib yuborish",
  stepType_skip_else: "ELSE blokini o'tkazib yuborish",
  stepType_console_output: "Konsol chiqishi",
  stepType_loop_iteration: (n) => `Tsikl — ${n}-iteratsiya`,
  stepType_loop_condition: "Tsikl sharti",
  stepType_loop_end: "Tsikl tugadi",
  stepType_function_declare: "Funksiya aniqlandi",
  stepType_function_call: (name) => `${name}() chaqirilmoqda`,
  stepType_function_return: (name) => `${name}() dan qaytish`,
  stepType_step_limit: "Bajarish to'xtatildi",

  detailName: "nomi",
  detailBefore: "avval",
  detailValue: "qiymati",
  detailType: "turi",
  detailOp: "amal",
  detailExpr: "ifoda",
  detailResult: "natija",
  detailLoop: "tsikl",
  detailIteration: "iteratsiya",
  detailTotalRuns: "jami bajarildi",
  detailParams: "parametrlar",
  detailArgs: "argumentlar",
  detailFrom: "qayerdan",
  detailNone: "yo'q",
  detailLoopFor: "for",
  detailLoopWhile: "while",
  detailLoopDoWhile: "do-while",
  detailLoopForOf: "for-of",
  detailLoopForIn: "for-in",

  next: "Keyingi →",
  onLine: (n) => ` ${n}-qatorda`,

  programComplete: "Dastur tugadi!",
  programCompleteDesc:
    "Ko'rib chiqish uchun orqaga qadamlab keting yoki kodni o'zgartirib qayta ishga tushiring.",

  errorTitle: "Xato",
  errorHint: "Sintaksisni tekshirib qayta urinib ko'ring.",

  iterationLabel: "Tsikl iteratsiyasi",
  enteringFunction: "Funksiyaga kirish",

  presets: "Namunalar",
  presetBasicIf: "If / Else",
  presetForLoop: "For tsikl",
  presetWhileLoop: "While tsikl",
  presetFunctions: "Funksiyalar",
  presetArrays: "Massivlar",
  presetObjects: "Obyektlar",
  presetNestedIf: "Ichma-ich shart",
  presetFibonacci: "Fibonachchi",

  heroTag: "JavaScript Bajarilish Vizualizatori",
  heroTitle1: "JavaScriptning ichida",
  heroTitle2: "nima bo'lishini ko'ring",
  heroSubtitle:
    "LogicJS kodni qadam-baqadam vizualizatsiya qiladi. O'zgaruvchilar qanday yaratilishini, shartlar qanday tekshirilishini va qaysi yo'nalish tanlanishini real vaqtda kuzating.",
  openPlayground: "Maydonni ochish",
  learnMore: "Ko'proq bilish",

  footerDesc: "JavaScript o'rganuvchilar uchun yaratilgan",

  homeBadge: "Interaktiv o'rganish platformasi",
  homeTitle1: "Kodni ko'rib",
  homeTitle2: "o'rgan",
  homeSubtitle: "JavaScript va CSS ni vizual, interaktiv tarzda tushuning. Har bir qadamda nima bo'lishini ko'ring.",
  homeJsSubtitle: "Kodingiz qadam-qadam qanday bajarilishini koring. O'zgaruvchilar, shartlar, tsikllar, funksiyalar — barchasi ko'z oldingizda.",
  homeCssTitle: "Layout Vizualizator",
  homeCssSubtitle: "Flexbox, Grid va animatsiyalarni bosib-ko'rib o'rganing. Har bir xususiyat live ko'rinadi — hech narsa yozmasangiz ham.",
  homeOpen: "Ochish",
  homeFeaturesTitle: "Nima uchun LogicLab?",
  homeFeaturesSubtitle: "Kitob o'qib tushunmadingizmi? Ko'rib o'rganing — tushunish ancha oson.",
  homeHowTitle: "Qanday ishlaydi?",
  homeHowSubtitle: "3 ta qadam — hammasi shu",
  homeCtaTitle: "O'rganishni boshlang",
  homeCtaSubtitle: "JavaScript va CSS ni tushunarli tarzda o'rganish uchun hamma narsa shu yerda.",
  homeFooterDesc2: "JavaScript va CSS o'rganuvchilar uchun",
  homeFeatures: [
    { title: "Vizual bajarish", desc: "Kod qanday ishlashini ko'z bilan ko'ring. Har bir qadam animatsiya bilan ko'rsatiladi." },
    { title: "Xotira holati", desc: "O'zgaruvchilar xotirada qanday saqlanishini, qiymatlar qanday o'zgarishini koring." },
    { title: "Shart va tarmoqlar", desc: "if/else shartlari qanday tekshirilishini va qaysi blok bajarilishini koring." },
    { title: "Flexbox vizualizator", desc: "flex-direction, justify-content, align-items — tugmani bosib live o'zgaring." },
    { title: "Grid vizualizator", desc: "Ustunlar, bo'shliqlar, span — CSS Grid ni interaktiv tarzda tushunib oling." },
    { title: "CSS animatsiyalar", desc: "@keyframes, timing-function, duration — real animatsiyalarni ko'rib o'rgan." },
    { title: "Konsol natijasi", desc: "console.log qachon va qaysi qiymat bilan chaqirilishini aynan shu lahzada koring." },
    { title: "Oson tushuntirish", desc: "Har bir qadam uchun sodda tilda izoh beriladi — qachon va nima uchun tushuntiriladi." },
    { title: "Qadam-qadam boshqaruv", desc: "Oldinga, orqaga, tezlik tanlash — o'z sur'atda o'rgan. Auto-play ham bor." },
  ],
  homeSteps: [
    { title: "Vositani tanlang", description: "JavaScript playground yoki CSS vizualizatorni oching." },
    { title: "Kod yozing yoki tanlang", description: "O'z kodingizni yozing yoki tayyor misollardan birini tanlang." },
    { title: "Vizual koring", description: "Run tugmasi → har bir qadam animatsiya bilan tushuntiriladi." },
  ],
};

const ru: UITranslations = {
  run: "Запустить",
  step: "Шаг",
  back: "Назад",
  play: "Воспроизвести",
  pause: "Пауза",
  reset: "Сброс",
  goToStart: "В начало",

  editor: "Редактор",
  visualizer: "Визуализатор",
  stepInfo: "Информация о шаге",
  timeline: "Временная шкала",
  memory: "Память",
  console: "Консоль",
  condition: "Условие",
  flow: "Поток",
  callStack: "Стек вызовов",
  explanation: "Объяснение",
  loopLabel: "Цикл",

  stepOf: (c, t) => `Шаг ${c} из ${t}`,
  variable: (n) => `${n} перем.`,
  lines: (n) => `${n} стр.`,

  readyTitle: "Готов к визуализации",
  readyDesc: "Напишите код и нажмите «Запустить»",
  readyHint: "Поддерживаются циклы, функции, массивы, объекты…",

  noVariables: "Переменных пока нет",
  noVariablesDesc: "Запустите код, чтобы увидеть память",
  noOutput: "Вывода пока нет...",
  noStepSelected: "Шаг не выбран",
  timelineEmpty: "Временная шкала появится после запуска кода",
  explanationEmpty: "Запустите код, чтобы увидеть объяснения шагов",

  condLeft: "Левое",
  condRight: "Правое",
  condResult: "Результат",

  memSnapshot: "Снимок памяти",
  consoleLines: (n) => `Консоль (${n} строк)`,

  stepType_program_start: "Начало программы",
  stepType_program_end: "Конец программы",
  stepType_declare_variable: "Объявление переменной",
  stepType_assign_variable: "Присваивание значения",
  stepType_update_variable: "Обновление переменной",
  stepType_evaluate_condition: "Вычисление условия",
  stepType_enter_if: "Вход в блок IF",
  stepType_enter_else: "Вход в блок ELSE",
  stepType_skip_if: "Пропуск блока IF",
  stepType_skip_else: "Пропуск блока ELSE",
  stepType_console_output: "Вывод в консоль",
  stepType_loop_iteration: (n) => `Цикл — итерация ${n}`,
  stepType_loop_condition: "Условие цикла",
  stepType_loop_end: "Цикл завершён",
  stepType_function_declare: "Функция определена",
  stepType_function_call: (name) => `Вызов ${name}()`,
  stepType_function_return: (name) => `Возврат из ${name}()`,
  stepType_step_limit: "Выполнение остановлено",

  detailName: "имя",
  detailBefore: "до",
  detailValue: "значение",
  detailType: "тип",
  detailOp: "операция",
  detailExpr: "выражение",
  detailResult: "результат",
  detailLoop: "цикл",
  detailIteration: "итерация",
  detailTotalRuns: "всего выполнено",
  detailParams: "параметры",
  detailArgs: "аргументы",
  detailFrom: "откуда",
  detailNone: "нет",
  detailLoopFor: "for",
  detailLoopWhile: "while",
  detailLoopDoWhile: "do-while",
  detailLoopForOf: "for-of",
  detailLoopForIn: "for-in",

  next: "Далее →",
  onLine: (n) => ` на строке ${n}`,

  programComplete: "Программа завершена!",
  programCompleteDesc:
    "Шагайте назад для обзора или измените код и запустите снова.",

  errorTitle: "Ошибка",
  errorHint: "Проверьте синтаксис и попробуйте снова.",

  iterationLabel: "Итерация цикла",
  enteringFunction: "Вход в функцию",

  presets: "Примеры",
  presetBasicIf: "If / Else",
  presetForLoop: "Цикл for",
  presetWhileLoop: "Цикл while",
  presetFunctions: "Функции",
  presetArrays: "Массивы",
  presetObjects: "Объекты",
  presetNestedIf: "Вложенные условия",
  presetFibonacci: "Фибоначчи",

  heroTag: "Визуализатор выполнения JavaScript",
  heroTitle1: "Смотрите, как именно",
  heroTitle2: "работает JavaScript",
  heroSubtitle:
    "LogicJS визуализирует выполнение кода шаг за шагом. Наблюдайте, как создаются переменные, вычисляются условия и выбираются ветви — в реальном времени.",
  openPlayground: "Открыть площадку",
  learnMore: "Узнать больше",

  footerDesc: "Создано для изучающих JavaScript",

  homeBadge: "Интерактивная платформа обучения",
  homeTitle1: "Учись видя",
  homeTitle2: "код в действии",
  homeSubtitle: "Понимайте JavaScript и CSS визуально и интерактивно. Смотрите, что происходит на каждом шаге.",
  homeJsSubtitle: "Смотрите, как ваш код выполняется шаг за шагом. Переменные, условия, циклы, функции — всё на виду.",
  homeCssTitle: "Визуализатор Layout",
  homeCssSubtitle: "Изучайте Flexbox, Grid и анимации нажатием кнопок. Каждое свойство обновляется в реальном времени.",
  homeOpen: "Открыть",
  homeFeaturesTitle: "Почему LogicLab?",
  homeFeaturesSubtitle: "Не понимаете по книге? Учитесь видя — так намного проще.",
  homeHowTitle: "Как это работает?",
  homeHowSubtitle: "3 шага — и всё",
  homeCtaTitle: "Начните учиться",
  homeCtaSubtitle: "Всё необходимое для понятного изучения JavaScript и CSS прямо здесь.",
  homeFooterDesc2: "Для изучающих JavaScript и CSS",
  homeFeatures: [
    { title: "Визуальное выполнение", desc: "Смотрите, как работает код своими глазами. Каждый шаг показан с анимацией." },
    { title: "Состояние памяти", desc: "Смотрите, как переменные хранятся в памяти и как изменяются их значения." },
    { title: "Условия и ветки", desc: "Смотрите, как проверяются if/else условия и какой блок выполняется." },
    { title: "Визуализатор Flexbox", desc: "flex-direction, justify-content, align-items — меняйте в реальном времени." },
    { title: "Визуализатор Grid", desc: "Колонки, отступы, span — понимайте CSS Grid интерактивно." },
    { title: "CSS анимации", desc: "@keyframes, timing-function, duration — учитесь на реальных анимациях." },
    { title: "Вывод консоли", desc: "Смотрите, когда и с каким значением вызывается console.log." },
    { title: "Простые объяснения", desc: "Каждый шаг имеет простое описание — что произошло, когда и почему." },
    { title: "Пошаговое управление", desc: "Вперёд, назад, выбор скорости — учитесь в своём темпе. Есть авто-воспроизведение." },
  ],
  homeSteps: [
    { title: "Выберите инструмент", description: "Откройте JavaScript playground или CSS визуализатор." },
    { title: "Напишите или выберите код", description: "Напишите свой код или выберите из готовых примеров." },
    { title: "Смотрите визуально", description: "Нажмите Run → каждый шаг объясняется с анимацией." },
  ],
};

export const UI: Record<Lang, UITranslations> = { en, uz, ru };
