// lib/i18n/backend.ts

export type Lang = "uz" | "en" | "ru";

export interface BackendTranslations {
  pageTitle: string;
  pageSubtitle: string;
  tabs: {
    basics: string;
    fs: string;
    eventloop: string;
    httpnative: string;
  };
  basicsTitle: string; basicsSubtitle: string; basicsExplain: Record<string, string>; basicsTips: { icon: string; title: string; desc: string }[];
  fsTitle: string; fsSubtitle: string; fsExplain: Record<string, string>; fsTips: { icon: string; title: string; desc: string }[];
  eventloopTitle: string; eventloopSubtitle: string; eventloopExplain: Record<string, string>; eventloopTips: { icon: string; title: string; desc: string }[];
  httpnativeTitle: string; httpnativeSubtitle: string; httpnativeExplain: Record<string, string>; httpnativeTips: { icon: string; title: string; desc: string }[];
}

// ─── ENGLISH ─────────────────────────────────────────────────────────────────

const en: BackendTranslations = {
  pageTitle: "Backend Visualizer",
  pageSubtitle: "Learn HTTP, REST API, databases, authentication and more — with animated diagrams and real Node.js code.",
  tabs: {
    basics: "Node.js Basics",
    fs: "FS Modules",
    eventloop: "Event Loop",
    httpnative: "Native HTTP & REST"
  },
  basicsTitle: "Node.js Basics & ES Modules",
  basicsSubtitle: "Compare CommonJS (require) and ES Modules (import) loading syntax and behaviors.",
  basicsExplain: {
    commonjs: "CommonJS (require/exports) loads modules synchronously. It evaluates files at runtime and caches the exported objects. Ideal for server-side operations where files are local.",
    esm: "ES Modules (import/export) is the modern standard. It parses modules statically before execution, allowing optimizations like tree-shaking. Execution is asynchronous."
  },
  basicsTips: [
    { icon: "📦", title: "CJS vs ESM", desc: "CommonJS is synchronous and uses require(). ESM is asynchronous and uses import." },
    { icon: "📁", title: "File extensions", desc: "Node.js treats .mjs files as ESM, .cjs as CommonJS, and looks at package.json type." },
    { icon: "⚡", title: "Dynamic imports", desc: "Both support dynamic importing at runtime: import() for ESM, require() dynamically for CJS." }
  ],
  fsTitle: "FS (File System) Operations",
  fsSubtitle: "Understand the difference between blocking Synchronous operations and non-blocking Asynchronous Thread Pool operations.",
  fsExplain: {
    sync: "fs.readFileSync() blocks the main thread (Call Stack) entirely. No other code can run until the file is read. Highly discouraged for high-traffic servers.",
    async: "fs.readFile() (Callback) offloads the file I/O task to libuv's Thread Pool, keeping the main thread free. Once read, the callback is pushed to the callback queue.",
    promises: "fs.promises.readFile() uses async/await or Promises. It still offloads task to libuv's Thread Pool, providing clean, readable code control."
  },
  fsTips: [
    { icon: "🧵", title: "Libuv Thread Pool", desc: "Node.js uses libuv's thread pool (default 4 threads) to run heavy file & crypto operations." },
    { icon: "🚫", title: "Never Block", desc: "Never use sync functions inside HTTP handlers. One user will freeze the app for all other active users." },
    { icon: "🔧", title: "Async/Await", desc: "Using fs.promises with async/await is the best practice for modern asynchronous coding." }
  ],
  eventloopTitle: "Event Loop Queue Priorities",
  eventloopSubtitle: "See how the Node.js Event Loop handles Call Stack, Microtasks (nextTick, Promises), and Macrotasks (Timers, I/O callbacks).",
  eventloopExplain: {
    synchronous: "Synchronous code runs immediately on the main Call Stack. Non-blocking tasks schedule callbacks and exit.",
    nexttick: "process.nextTick() queue has the highest priority. It is processed immediately after the current operation, before the Microtask queue.",
    promises: "Promises (Microtask queue) are processed after process.nextTick callbacks, but before any Macrotasks (like timers).",
    timers: "setTimeout/setInterval (Macrotask queue) run in the Timers phase of the Event Loop once the call stack and microtasks are empty."
  },
  eventloopTips: [
    { icon: "🔄", title: "Event Loop Phases", desc: "The Event Loop has phases: Timers, Pending Callbacks, Poll, Check, Close. Each phase has its own queue." },
    { icon: "🏎️", title: "nextTick Priority", desc: "process.nextTick() runs immediately after current call stack, which can starve I/O if overused." },
    { icon: "📦", title: "Micro vs Macro", desc: "Microtasks (Promises) run repeatedly until empty after stack. Macrotasks (Timers) run one by one in phases." }
  ],
  httpnativeTitle: "HTTP Server & REST Methods",
  httpnativeSubtitle: "Build a raw HTTP server using the native 'http' module and make mock client requests using GET, POST, PUT, and DELETE methods.",
  httpnativeExplain: {
    server: "Node.js's native 'http' module allows listening to incoming TCP requests. It exposes req (IncomingMessage) and res (ServerResponse).",
    postman: "Postman simulates client requests. It lets you send HTTP headers, query parameters, and JSON request bodies to test API endpoints."
  },
  httpnativeTips: [
    { icon: "🌐", title: "http.createServer", desc: "Native http server requires parsing request URLs and bodies manually, unlike Express." },
    { icon: "📡", title: "Port binding", desc: "The server binds to a port (e.g. 3000) on localhost to start listening for client connections." },
    { icon: "📦", title: "JSON response", desc: "Always set 'Content-Type: application/json' header when returning JSON stringified payloads." }
  ],
};

// ─── UZBEK ────────────────────────────────────────────────────────────────────

const uz: BackendTranslations = {
  pageTitle: "Backend Vizualizator",
  pageSubtitle: "HTTP, REST API, ma'lumotlar bazasi, autentifikatsiya va ko'proq narsani animatsiyali diagrammalar va real Node.js kodi bilan o'rganing.",
  tabs: {
    basics: "Node.js Asoslari",
    fs: "FS Modullari",
    eventloop: "Event Loop",
    httpnative: "Native HTTP va REST"
  },
  basicsTitle: "Node.js Asoslari & ES Modullari",
  basicsSubtitle: "CommonJS (require) va ES Modullari (import) yuklanish sintaksisi va ishlash usullarini solishtiring.",
  basicsExplain: {
    commonjs: "CommonJS (require/exports) modullarni sinxron tarzda yuklaydi. Kod bajarilish vaqtida tahlil qilinadi va natija keshlanadi. Mahalliy fayllar uchun juda mos.",
    esm: "ES Modullari (import/export) zamonaviy standart hisoblanadi. Kod bajarilishdan oldin statik tahlil qilinadi va asinxron ishlaydi."
  },
  basicsTips: [
    { icon: "📦", title: "CJS vs ESM", desc: "CommonJS sinxron va require() ishlatadi. ESM esa asinxron va import ishlatadi." },
    { icon: "📁", title: "Fayl kengaytmalari", desc: "Node.js .mjs fayllarni ESM, .cjs fayllarni esa CommonJS deb hisoblaydi." },
    { icon: "⚡", title: "Dinamik import", desc: "Ikkalasi ham dynamic importlarni qo'llaydi: ESM da import(), CJS da dinamik require()." }
  ],
  fsTitle: "FS (Fayl Tizimi) Operatsiyalari",
  fsSubtitle: "Sinxron (Call Stackni to'suvchi) va Asinxron (Libuv Thread Pool ga yuklanuvchi) operatsiyalar farqini tushuning.",
  fsExplain: {
    sync: "fs.readFileSync() asosiy oqimni (Call Stack) butunlay bloklaydi. Fayl o'qib bo'linguncha boshqa hech qanday kod ishlamaydi.",
    async: "fs.readFile() (Callback) fayl o'qish vazifasini libuv'ning Thread Pool oqimiga topshiradi va Call Stackni bo'sh qoldiradi.",
    promises: "fs.promises.readFile() asinxron/await yoki Promise ishlatadi. U ham Thread Pool dan foydalanadi, lekin kodni oson va toza yozish imkonini beradi."
  },
  fsTips: [
    { icon: "🧵", title: "Libuv Thread Pool", desc: "Node.js og'ir operatsiyalarni bajarish uchun libuv oqimlar to'plamidan foydalanadi." },
    { icon: "🚫", title: "Hech qachon bloklamang", desc: "HTTP controllerlar ichida sinxron funksiyalardan foydalanmang, aks holda dastur boshqalar uchun ham qotib qoladi." },
    { icon: "🔧", title: "Async/Await", desc: "fs.promises moduli va async/await dan foydalanish zamonaviy Node.js ning eng yaxshi amaliyotidir." }
  ],
  eventloopTitle: "Event Loop Navbatlari",
  eventloopSubtitle: "Node.js Event Loop oqimi Call Stack, Microtask (nextTick, Promise) va Macrotask (Timers, I/O) navbatlarini qanday boshqarishini ko'ring.",
  eventloopExplain: {
    synchronous: "Sinxron kodlar darhol Call Stackda bajariladi. Asinxron topshiriqlar esa callback rejalashtirib stackdan chiqib ketadi.",
    nexttick: "process.nextTick() navbati eng yuqori ustuvorlikka ega. U Microtask navbatidan ham oldin darhol bajariladi.",
    promises: "V'adalar (Promises - Microtask navbati) process.nextTick'dan keyin, lekin Macrotask (setTimeout) navbatidan oldin bajariladi.",
    timers: "setTimeout/setInterval (Macrotask navbati) call stack va microtasklar bo'sh bo'lgandagina Event Loop ning Timers fazasida ishlaydi."
  },
  eventloopTips: [
    { icon: "🔄", title: "Event Loop Fazalari", desc: "Event Loop fazalardan iborat: Timers, Pending, Poll, Check, Close. Har birining o'z navbati bor." },
    { icon: "🏎️", title: "nextTick Navbati", desc: "process.nextTick() joriy amaldan so'ng darhol ishlaydi. Ko'p ishlatilsa I/O och qolib ketishi mumkin." },
    { icon: "📦", title: "Mikro va Makro", desc: "Mikrotasklar (Promise) navbati bo'shaguncha qayta-qayta ishlaydi. Makrotasklar esa navbat bilan fazalarda bajariladi." }
  ],
  httpnativeTitle: "HTTP Server va REST Metodlari",
  httpnativeSubtitle: "Node.js ning mahalliy 'http' moduli yordamida server yarating va virtual Postman mijozi orqali GET, POST, PUT, DELETE metodlarini test qiling.",
  httpnativeExplain: {
    server: "Node.js 'http' moduli kiruvchi TCP so'rovlarni tinglash imkonini beradi. U req (so'rov) va res (javob) ob'ektlarini taqdim etadi.",
    postman: "Postman so'rovlarni simulyatsiya qiladi. U yordamida so'rov sarlavhalari, URL parametrlar va JSON body yuborishingiz mumkin."
  },
  httpnativeTips: [
    { icon: "🌐", title: "http.createServer", desc: "Express'dan farqli o'laroq, mahalliy http serverda so'rov URL va bodyni qo'lda tahlil qilish kerak." },
    { icon: "📡", title: "Port ulash", desc: "Server mijozlar ulanishini qabul qilishni boshlashi uchun localhost portiga (masalan 3000) ulanadi." },
    { icon: "📦", title: "JSON javob", desc: "JSON javob qaytarayotganda sarlavhada doim 'Content-Type: application/json' yozish kerak." }
  ],
};

// ─── RUSSIAN ──────────────────────────────────────────────────────────────────

const ru: BackendTranslations = {
  pageTitle: "Визуализатор Backend",
  pageSubtitle: "Изучайте HTTP, REST API, базы данных, аутентификацию и многое другое — с анимированными диаграммами и реальным кодом Node.js.",
  tabs: {
    basics: "Основы Node.js",
    fs: "FS Модули",
    eventloop: "Event Loop",
    httpnative: "Native HTTP & REST"
  },
  basicsTitle: "Основы Node.js & ES Модули",
  basicsSubtitle: "Сравните синтаксис и поведение загрузки CommonJS (require) и ES модулей (import).",
  basicsExplain: {
    commonjs: "CommonJS (require/exports) загружает модули синхронно. Код оценивается во время выполнения, а экспортируемый объект кэшируется.",
    esm: "ES модули (import/export) — это современный стандарт. Они анализируются статически перед выполнением и работают асинхронно."
  },
  basicsTips: [
    { icon: "📦", title: "CJS vs ESM", desc: "CommonJS работает синхронно и использует require(). ESM работает асинхронно через import." },
    { icon: "📁", title: "Расширения", desc: "Node.js распознает .mjs файлы как ESM, .cjs как CommonJS, основываясь на типе в package.json." },
    { icon: "⚡", title: "Динамический импорт", desc: "Оба формата поддерживают динамический импорт: import() для ESM, динамический require() для CJS." }
  ],
  fsTitle: "Операции FS (File System)",
  fsSubtitle: "Поймите разницу между блокирующими синхронными операциями и асинхронным Thread Pool (libuv).",
  fsExplain: {
    sync: "fs.readFileSync() полностью блокирует основной поток (Call Stack). Никакой другой код не выполнится, пока файл не прочитан.",
    async: "fs.readFile() (Callback) передает задачу ввода-вывода пулу потоков libuv, освобождая Call Stack.",
    promises: "fs.promises.readFile() использует async/await или Promise. Также использует пул потоков, обеспечивая чистый и читаемый код."
  },
  fsTips: [
    { icon: "🧵", title: "Пул потоков Libuv", desc: "Node.js использует пул потоков libuv (по умолчанию 4 потока) для фонового выполнения тяжелых файловых задач." },
    { icon: "🚫", title: "Не блокируйте поток", desc: "Никогда не используйте синхронные методы внутри обработчиков HTTP, иначе приложение зависнет для всех." },
    { icon: "🔧", title: "Async/Await", desc: "Использование fs.promises с async/await — лучший стандарт для современного асинхронного программирования." }
  ],
  eventloopTitle: "Очереди Event Loop",
  eventloopSubtitle: "Посмотрите, как Event Loop в Node.js управляет Call Stack, микрозадачами (nextTick, Promise) и макрозадачами (Timers, I/O).",
  eventloopExplain: {
    synchronous: "Синхронный код выполняется сразу в Call Stack. Асинхронные задачи регистрируют колбэки и освобождают стек.",
    nexttick: "Очередь process.nextTick() имеет наивысший приоритет. Она обрабатывается сразу после текущей задачи, перед микрозадачами.",
    promises: "Промисы (очередь микрозадач) обрабатываются после process.nextTick, но перед любыми макрозадачами.",
    timers: "setTimeout/setInterval (очередь макрозадач) запускаются в фазе Timers цикла событий, когда стек и микрозадачи пусты."
  },
  eventloopTips: [
    { icon: "🔄", title: "Фазы Event Loop", desc: "Event Loop имеет фазы: Timers, Pending, Poll, Check, Close. Каждая имеет свою очередь." },
    { icon: "🏎️", title: "Приоритет nextTick", desc: "process.nextTick() выполняется мгновенно. Чрезмерное использование может блокировать ввод-вывод." },
    { icon: "📦", title: "Микро и Макро", desc: "Микрозадачи выполняются до полного опустошения очереди. Макрозадачи выполняются поочередно по фазам." }
  ],
  httpnativeTitle: "HTTP Server & REST Methods",
  httpnativeSubtitle: "Создайте HTTP-сервер с помощью встроенного модуля 'http' и протестируйте запросы через виртуальный клиент Postman, используя GET, POST, PUT, DELETE.",
  httpnativeExplain: {
    server: "Встроенный модуль 'http' позволяет прослушивать входящие TCP-запросы. Предоставляет объекты req (запрос) и res (ответ).",
    postman: "Postman симулирует клиентские запросы. Позволяет отправлять заголовки, параметры URL и JSON тело запроса."
  },
  httpnativeTips: [
    { icon: "🌐", title: "http.createServer", desc: "В отличие от Express, во встроенном сервере парсить URL и тело запроса нужно вручную." },
    { icon: "📡", title: "Связывание портов", desc: "Сервер подключается к порту (например, 3000) на localhost для прослушивания соединений." },
    { icon: "📦", title: "JSON ответ", desc: "При возвращении JSON-данных всегда указывайте заголовок 'Content-Type: application/json'." }
  ],
};

export const BACKEND_I18N: Record<Lang, BackendTranslations> = { en, uz, ru };
