// lib/i18n/backend.ts

export type Lang = "uz" | "en" | "ru";

export interface BackendTranslations {
  pageTitle: string;
  pageSubtitle: string;
  tabs: { http: string; rest: string; database: string; auth: string; middleware: string; websocket: string; cors: string; };
  httpTitle: string; httpSubtitle: string; httpMethod: string; httpEndpoint: string;
  httpSend: string; httpStatus: string; httpTime: string;
  httpRequest: string; httpResponse: string; httpClient: string; httpServer: string; httpDatabase: string;
  httpExplain: Record<string, string>;
  httpTips: { icon: string; title: string; desc: string }[];
  restTitle: string; restSubtitle: string;
  restExplain: Record<string, string>;
  restBody: string; restParams: string; restHeaders: string;
  restTips: { icon: string; title: string; desc: string }[];
  dbTitle: string; dbSubtitle: string; dbTable: string; dbResult: string; dbRows: string;
  dbExplain: Record<string, string>;
  dbTips: { icon: string; title: string; desc: string }[];
  authTitle: string; authSubtitle: string; authLogin: string; authVerify: string;
  authToken: string; authPayload: string; authHeader: string; authSignature: string;
  authValid: string; authInvalid: string; authExpired: string;
  authExplain: Record<string, string>;
  authTips: { icon: string; title: string; desc: string }[];
  mwTitle: string; mwSubtitle: string; mwRequest: string; mwResponse: string; mwNext: string; mwBlocked: string;
  mwExplain: Record<string, string>;
  mwTips: { icon: string; title: string; desc: string }[];
  wsTitle: string; wsSubtitle: string; wsConnect: string; wsDisconnect: string; wsSend: string;
  wsClient: string; wsServer: string; wsConnected: string; wsDisconnected: string; wsExplain: string;
  wsTips: { icon: string; title: string; desc: string }[];
  corsTitle: string; corsSubtitle: string; corsAllowed: string; corsBlocked: string; corsOrigin: string;
  corsExplain: Record<string, string>;
  corsTips: { icon: string; title: string; desc: string }[];
}

// ─── ENGLISH ─────────────────────────────────────────────────────────────────

const en: BackendTranslations = {
  pageTitle: "Backend Visualizer",
  pageSubtitle: "Learn HTTP, REST API, databases, authentication and more — with animated diagrams and real Node.js code.",
  tabs: { http: "HTTP", rest: "REST API", database: "Database", auth: "Auth (JWT)", middleware: "Middleware", websocket: "WebSocket", cors: "CORS" },
  httpTitle: "HTTP Request / Response",
  httpSubtitle: "See how a browser request travels to the server and back. Every step is animated.",
  httpMethod: "Method", httpEndpoint: "Endpoint", httpSend: "Send Request",
  httpStatus: "Status", httpTime: "Response time",
  httpRequest: "Request", httpResponse: "Response",
  httpClient: "Client", httpServer: "Server", httpDatabase: "Database",
  httpExplain: {
    GET: "GET fetches data. No body. Safe and idempotent — calling it multiple times gives the same result.",
    POST: "POST creates a new resource. Sends data in the request body. Not idempotent.",
    PUT: "PUT replaces a resource completely. If it doesn't exist, it may create it.",
    DELETE: "DELETE removes a resource. Usually returns 200 OK or 204 No Content.",
  },
  httpTips: [
    { icon: "🔵", title: "Stateless protocol", desc: "Each HTTP request is independent. The server doesn't remember previous requests." },
    { icon: "📦", title: "Headers", desc: "Headers carry metadata: Content-Type, Authorization, Accept, Cache-Control and more." },
    { icon: "⚡", title: "Status codes", desc: "2xx = success, 3xx = redirect, 4xx = client error, 5xx = server error." },
  ],
  restTitle: "REST API Methods",
  restSubtitle: "GET, POST, PUT, DELETE — the four pillars of REST. Click each to see the code and response.",
  restExplain: {
    GET: "Read data. No request body. Returns 200 OK with the requested resource.",
    POST: "Create a new record. Body contains JSON data. Returns 201 Created.",
    PUT: "Update an existing record completely. Returns 200 OK.",
    DELETE: "Remove a record. Returns 200 OK or 204 No Content.",
  },
  restBody: "Request Body", restParams: "URL Params", restHeaders: "Headers",
  restTips: [
    { icon: "🟢", title: "GET is safe", desc: "GET never changes data on the server. Always use it for reading." },
    { icon: "📝", title: "POST vs PUT", desc: "POST creates new records, PUT replaces existing ones. Use PATCH for partial updates." },
    { icon: "🗑️", title: "DELETE carefully", desc: "Once deleted, data is gone. Return 404 if the resource doesn't exist." },
  ],
  dbTitle: "Database Queries",
  dbSubtitle: "See how SQL queries interact with a table — SELECT, INSERT, UPDATE, DELETE — animated row by row.",
  dbTable: "users table", dbResult: "Query result", dbRows: "rows affected",
  dbExplain: {
    SELECT: "SELECT reads rows from the table. Use WHERE to filter, ORDER BY to sort, LIMIT to paginate.",
    INSERT: "INSERT adds a new row. Auto-increment ID is assigned by the database.",
    UPDATE: "UPDATE modifies existing rows. Without WHERE it updates every row — be careful!",
    DELETE: "DELETE removes rows. Without WHERE it deletes everything. Always use WHERE!",
  },
  dbTips: [
    { icon: "🔍", title: "Always use WHERE", desc: "UPDATE and DELETE without WHERE affect all rows. Always filter your queries." },
    { icon: "🔑", title: "Primary Key", desc: "Every table should have a unique PRIMARY KEY (usually id) for fast lookups." },
    { icon: "📊", title: "Indexes", desc: "Add indexes to columns you search or sort by frequently to speed up queries." },
  ],
  authTitle: "Authentication — JWT",
  authSubtitle: "See how JSON Web Tokens are created, signed, sent and verified between client and server.",
  authLogin: "Login", authVerify: "Verify Token",
  authToken: "JWT Token", authPayload: "Payload", authHeader: "Header", authSignature: "Signature",
  authValid: "✅ Token valid — access granted",
  authInvalid: "❌ Token invalid — access denied",
  authExpired: "⏰ Token expired — please log in again",
  authExplain: {
    sign: "Server creates a JWT by encoding header + payload with a secret key using HS256 algorithm.",
    send: "Client stores the token (localStorage or cookie) and sends it with every request as a Bearer token.",
    verify: "Server decodes the token and checks the signature. If valid, it grants access to the resource.",
  },
  authTips: [
    { icon: "🔐", title: "Never expose secrets", desc: "JWT_SECRET must be kept server-side. Never send it to the client." },
    { icon: "⏱️", title: "Set expiry", desc: "Always set expiresIn on tokens. Short expiry (15m) + refresh tokens is best practice." },
    { icon: "📦", title: "Payload is public", desc: "The payload is base64-encoded, not encrypted. Don't put passwords in the payload!" },
  ],
  mwTitle: "Middleware Chain",
  mwSubtitle: "See how a request flows through middleware layers before reaching the route handler.",
  mwRequest: "Incoming Request", mwResponse: "Response", mwNext: "next()", mwBlocked: "Blocked",
  mwExplain: {
    logger: "Logs the request method, URL and timestamp to the console for debugging.",
    auth: "Checks the Authorization header. If the token is missing or invalid, returns 401 Unauthorized.",
    ratelimit: "Limits requests per IP (e.g. 100 req/min). If exceeded, returns 429 Too Many Requests.",
    handler: "The actual route handler that processes the request and sends the response.",
  },
  mwTips: [
    { icon: "⛓️", title: "Order matters", desc: "Middleware runs in the order it's registered. Always put auth before route handlers." },
    { icon: "📞", title: "Call next()", desc: "If you forget to call next(), the request hangs. Always call next() or send a response." },
    { icon: "🛡️", title: "Error middleware", desc: "Error-handling middleware has 4 params: (err, req, res, next). Register it last." },
  ],
  wsTitle: "WebSocket — Real-Time",
  wsSubtitle: "Unlike HTTP, WebSocket keeps a persistent connection open. Messages flow both ways instantly.",
  wsConnect: "Connect", wsDisconnect: "Disconnect", wsSend: "Send",
  wsClient: "Client", wsServer: "Server",
  wsConnected: "Connected", wsDisconnected: "Disconnected",
  wsExplain: "WebSocket starts as an HTTP request then upgrades to a persistent TCP connection. Both sides can send messages at any time without a new request.",
  wsTips: [
    { icon: "⚡", title: "Full-duplex", desc: "Both client and server can send messages independently — no need to wait for a request." },
    { icon: "🔄", title: "HTTP vs WS", desc: "HTTP is request-response (one shot). WebSocket keeps the connection alive for real-time use." },
    { icon: "🔌", title: "Use cases", desc: "Chat apps, live notifications, collaborative editing, real-time dashboards." },
  ],
  corsTitle: "CORS — Cross-Origin",
  corsSubtitle: "Browsers block requests to different origins by default. CORS headers tell the browser what's allowed.",
  corsAllowed: "Allowed ✅", corsBlocked: "Blocked ❌", corsOrigin: "Origin",
  corsExplain: {
    same: "Same-origin request: protocol, host and port all match. Always allowed by the browser.",
    allowed: "Cross-origin request, but the server returned Access-Control-Allow-Origin: *. Allowed.",
    blocked: "Cross-origin request, but the server didn't send CORS headers. Browser blocks the response.",
    options: "Preflight OPTIONS request: browser asks the server for permission before the actual request.",
  },
  corsTips: [
    { icon: "🌐", title: "What is origin?", desc: "Origin = protocol + hostname + port. https://a.com and http://a.com are different origins." },
    { icon: "⚠️", title: "CORS is browser-only", desc: "CORS is enforced by browsers only. curl and Postman bypass it completely." },
    { icon: "🔒", title: "Don't use *", desc: "Access-Control-Allow-Origin: * allows any site. Use specific origins in production." },
  ],
};

// ─── UZBEK ────────────────────────────────────────────────────────────────────

const uz: BackendTranslations = {
  pageTitle: "Backend Vizualizator",
  pageSubtitle: "HTTP, REST API, ma'lumotlar bazasi, autentifikatsiya va ko'proq narsani animatsiyali diagrammalar va real Node.js kodi bilan o'rganing.",
  tabs: { http: "HTTP", rest: "REST API", database: "Ma'lumotlar Bazasi", auth: "Auth (JWT)", middleware: "Middleware", websocket: "WebSocket", cors: "CORS" },
  httpTitle: "HTTP So'rov / Javob",
  httpSubtitle: "Brauzer so'rovi serverga va qayta qanday borishi ko'rsatiladi. Har bir qadam animatsiyali.",
  httpMethod: "Metod", httpEndpoint: "Endpoint", httpSend: "So'rov yuborish",
  httpStatus: "Status", httpTime: "Javob vaqti",
  httpRequest: "So'rov", httpResponse: "Javob",
  httpClient: "Mijoz", httpServer: "Server", httpDatabase: "Ma'lumotlar Bazasi",
  httpExplain: {
    GET: "GET ma'lumotlarni o'qiydi. Tana yo'q. Xavfsiz va idempotent — bir necha marta chaqirsa ham natija bir xil.",
    POST: "POST yangi resurs yaratadi. Ma'lumotlarni so'rov tanasida yuboradi. Idempotent emas.",
    PUT: "PUT resursni to'liq almashtiradi. Agar mavjud bo'lmasa, yaratishi mumkin.",
    DELETE: "DELETE resursni o'chiradi. Odatda 200 OK yoki 204 No Content qaytaradi.",
  },
  httpTips: [
    { icon: "🔵", title: "Holatga bog'liq emas", desc: "Har bir HTTP so'rovi mustaqil. Server oldingi so'rovlarni eslamaydi." },
    { icon: "📦", title: "Sarlavhalar", desc: "Sarlavhalar metadata saqlaydi: Content-Type, Authorization, Accept, Cache-Control va boshqalar." },
    { icon: "⚡", title: "Status kodlar", desc: "2xx = muvaffaqiyat, 3xx = yo'naltirish, 4xx = mijoz xatosi, 5xx = server xatosi." },
  ],
  restTitle: "REST API Metodlari",
  restSubtitle: "GET, POST, PUT, DELETE — REST ning to'rt ustuni. Har birini bosib kod va javobni ko'ring.",
  restExplain: {
    GET: "Ma'lumot o'qish. So'rov tanasi yo'q. So'ralgan resurs bilan 200 OK qaytaradi.",
    POST: "Yangi yozuv yaratish. Tana JSON ma'lumotlarni o'z ichiga oladi. 201 Created qaytaradi.",
    PUT: "Mavjud yozuvni to'liq yangilash. 200 OK qaytaradi.",
    DELETE: "Yozuvni o'chirish. 200 OK yoki 204 No Content qaytaradi.",
  },
  restBody: "So'rov Tanasi", restParams: "URL Parametrlari", restHeaders: "Sarlavhalar",
  restTips: [
    { icon: "🟢", title: "GET xavfsiz", desc: "GET hech qachon serverdagi ma'lumotlarni o'zgartirmaydi. O'qish uchun foydalaning." },
    { icon: "📝", title: "POST va PUT", desc: "POST yangi yozuvlar yaratadi, PUT mavjudlarini almashtiradi. Qisman yangilash uchun PATCH." },
    { icon: "🗑️", title: "DELETE ehtiyotkorlik bilan", desc: "O'chirilgandan keyin ma'lumot ketadi. Resurs yo'q bo'lsa 404 qaytaring." },
  ],
  dbTitle: "Ma'lumotlar Bazasi So'rovlari",
  dbSubtitle: "SQL so'rovlar jadval bilan qanday ishlashini ko'ring — SELECT, INSERT, UPDATE, DELETE — qator-qator animatsiya.",
  dbTable: "users jadvali", dbResult: "So'rov natijasi", dbRows: "ta qator ta'sirlandi",
  dbExplain: {
    SELECT: "SELECT jadvaldan qatorlarni o'qiydi. WHERE filtrlash, ORDER BY saralash, LIMIT sahifalash uchun.",
    INSERT: "INSERT yangi qator qo'shadi. Auto-increment ID ma'lumotlar bazasi tomonidan beriladi.",
    UPDATE: "UPDATE mavjud qatorlarni o'zgartiradi. WHERE siz barcha qatorni o'zgartiradi — ehtiyot bo'ling!",
    DELETE: "DELETE qatorlarni o'chiradi. WHERE siz hammasini o'chiradi. Doim WHERE ishlating!",
  },
  dbTips: [
    { icon: "🔍", title: "Doim WHERE ishlating", desc: "WHERE siz UPDATE va DELETE barcha qatorlarga ta'sir qiladi. Doim filtrlang." },
    { icon: "🔑", title: "Asosiy kalit", desc: "Har bir jadvalda tezkor qidirish uchun noyob PRIMARY KEY (odatda id) bo'lishi kerak." },
    { icon: "📊", title: "Indekslar", desc: "Tez-tez qidiradigan yoki saralaydigan ustunlarga indeks qo'shing." },
  ],
  authTitle: "Autentifikatsiya — JWT",
  authSubtitle: "JSON Web Token mijoz va server o'rtasida qanday yaratilishi, imzolanishi va tekshirilishini ko'ring.",
  authLogin: "Kirish", authVerify: "Tokenni Tekshirish",
  authToken: "JWT Token", authPayload: "Payload", authHeader: "Header", authSignature: "Imzo",
  authValid: "✅ Token yaroqli — kirish ruxsat etildi",
  authInvalid: "❌ Token yaroqsiz — kirish rad etildi",
  authExpired: "⏰ Token muddati o'tgan — qayta kiring",
  authExplain: {
    sign: "Server HS256 algoritmi yordamida maxfiy kalit bilan header + payload ni kodlab JWT yaratadi.",
    send: "Mijoz tokenni saqlaydi (localStorage yoki cookie) va har bir so'rovda Bearer token sifatida yuboradi.",
    verify: "Server tokenni dekodlab imzoni tekshiradi. Yaroqli bo'lsa, resursga kirish beriladi.",
  },
  authTips: [
    { icon: "🔐", title: "Sirni oshkor qilmang", desc: "JWT_SECRET faqat server tomonida bo'lishi kerak. Hech qachon mijozga yubormang." },
    { icon: "⏱️", title: "Muddatni belgilang", desc: "Doim tokenga expiresIn belgilang. Qisqa muddat (15m) + yangilash tokeni eng yaxshi amaliyot." },
    { icon: "📦", title: "Payload ochiq", desc: "Payload base64 bilan kodlangan, shifrlanmagan. Payload ga parol yozmang!" },
  ],
  mwTitle: "Middleware Zanjiri",
  mwSubtitle: "So'rov marshrut ishlovchisiga yetib borguncha middleware qatlamlari orqali qanday o'tishini ko'ring.",
  mwRequest: "Kiruvchi So'rov", mwResponse: "Javob", mwNext: "next()", mwBlocked: "Bloklandi",
  mwExplain: {
    logger: "So'rov metodi, URL va vaqt tamg'asini disk raskadrovka uchun konsolga yozadi.",
    auth: "Authorization sarlavhasini tekshiradi. Token yo'q yoki yaroqsiz bo'lsa 401 Unauthorized qaytaradi.",
    ratelimit: "IP bo'yicha so'rovlarni cheklaydi (masalan, 100 ta/min). Oshib ketsa 429 Too Many Requests qaytaradi.",
    handler: "So'rovni qayta ishlaydigan va javob yuboradigan haqiqiy marshrut ishlovchisi.",
  },
  mwTips: [
    { icon: "⛓️", title: "Tartib muhim", desc: "Middleware ro'yxatga olingan tartibda ishlaydi. Auth ni doim marshrut ishlovchilaridan oldin qo'ying." },
    { icon: "📞", title: "next() ni chaqiring", desc: "next() ni chaqirmasangiz so'rov to'xtab qoladi. Doim next() ni chaqiring yoki javob yuboring." },
    { icon: "🛡️", title: "Xato middleware", desc: "Xatoni boshqarishda 4 parametr bor: (err, req, res, next). Oxirida ro'yxatga oling." },
  ],
  wsTitle: "WebSocket — Real Vaqt",
  wsSubtitle: "HTTP dan farqli o'laroq, WebSocket doimiy ulanishni ochiq ushlab turadi. Xabarlar ikki tomonga tezda oqadi.",
  wsConnect: "Ulash", wsDisconnect: "Uzish", wsSend: "Yuborish",
  wsClient: "Mijoz", wsServer: "Server",
  wsConnected: "Ulangan", wsDisconnected: "Uzilgan",
  wsExplain: "WebSocket HTTP so'rovi sifatida boshlanadi, keyin doimiy TCP ulanishiga ko'tariladi. Har ikki tomon ham yangi so'rovsiz istalgan vaqtda xabar yuborishi mumkin.",
  wsTips: [
    { icon: "⚡", title: "To'liq dupleks", desc: "Mijoz ham, server ham mustaqil xabar yuborishi mumkin — so'rov kutish shart emas." },
    { icon: "🔄", title: "HTTP va WS", desc: "HTTP so'rov-javob (bir martalik). WebSocket real vaqt uchun ulanishni tirik saqlaydi." },
    { icon: "🔌", title: "Foydalanish holatlari", desc: "Chat ilovalari, jonli bildirishnomalar, hamkorlikdagi tahrirlash, real vaqt panellari." },
  ],
  corsTitle: "CORS — Manba Hududlari",
  corsSubtitle: "Brauzerlar boshqa manbalarga so'rovlarni standart holda bloklaydi. CORS sarlavhalari nima ruxsat etilinganini bildiradi.",
  corsAllowed: "Ruxsat berildi ✅", corsBlocked: "Bloklandi ❌", corsOrigin: "Manba",
  corsExplain: {
    same: "Bir xil manbadan so'rov: protokol, host va port mos keladi. Brauzer doim ruxsat beradi.",
    allowed: "Boshqa manbadan so'rov, lekin server Access-Control-Allow-Origin: * qaytardi. Ruxsat berildi.",
    blocked: "Boshqa manbadan so'rov, lekin server CORS sarlavhalarini yubormadi. Brauzer javobni bloklaydi.",
    options: "Preflight OPTIONS so'rovi: brauzer haqiqiy so'rovdan oldin serverdan ruxsat so'raydi.",
  },
  corsTips: [
    { icon: "🌐", title: "Manba nima?", desc: "Manba = protokol + xost + port. https://a.com va http://a.com turli manbalar." },
    { icon: "⚠️", title: "CORS faqat brauzerda", desc: "CORS faqat brauzerlar tomonidan qo'llaniladi. curl va Postman uni chetlab o'tadi." },
    { icon: "🔒", title: "* dan foydalanmang", desc: "Access-Control-Allow-Origin: * har qanday saytga ruxsat beradi. Ishlab chiqarishda aniq manba ishlating." },
  ],
};

// ─── RUSSIAN ──────────────────────────────────────────────────────────────────

const ru: BackendTranslations = {
  pageTitle: "Визуализатор Backend",
  pageSubtitle: "Изучайте HTTP, REST API, базы данных, аутентификацию и многое другое — с анимированными диаграммами и реальным кодом Node.js.",
  tabs: { http: "HTTP", rest: "REST API", database: "База данных", auth: "Auth (JWT)", middleware: "Middleware", websocket: "WebSocket", cors: "CORS" },
  httpTitle: "HTTP Запрос / Ответ",
  httpSubtitle: "Посмотрите, как запрос браузера идёт к серверу и обратно. Каждый шаг анимирован.",
  httpMethod: "Метод", httpEndpoint: "Endpoint", httpSend: "Отправить запрос",
  httpStatus: "Статус", httpTime: "Время ответа",
  httpRequest: "Запрос", httpResponse: "Ответ",
  httpClient: "Клиент", httpServer: "Сервер", httpDatabase: "База данных",
  httpExplain: {
    GET: "GET получает данные. Нет тела. Безопасный и идемпотентный — вызов несколько раз даёт тот же результат.",
    POST: "POST создаёт новый ресурс. Данные отправляются в теле запроса. Не идемпотентный.",
    PUT: "PUT полностью заменяет ресурс. Если не существует, может создать.",
    DELETE: "DELETE удаляет ресурс. Обычно возвращает 200 OK или 204 No Content.",
  },
  httpTips: [
    { icon: "🔵", title: "Протокол без состояния", desc: "Каждый HTTP-запрос независим. Сервер не помнит предыдущие запросы." },
    { icon: "📦", title: "Заголовки", desc: "Заголовки несут метаданные: Content-Type, Authorization, Accept, Cache-Control и другие." },
    { icon: "⚡", title: "Коды статуса", desc: "2xx = успех, 3xx = перенаправление, 4xx = ошибка клиента, 5xx = ошибка сервера." },
  ],
  restTitle: "Методы REST API",
  restSubtitle: "GET, POST, PUT, DELETE — четыре основы REST. Нажмите каждый, чтобы увидеть код и ответ.",
  restExplain: {
    GET: "Чтение данных. Нет тела запроса. Возвращает 200 OK с запрошенным ресурсом.",
    POST: "Создание новой записи. Тело содержит JSON-данные. Возвращает 201 Created.",
    PUT: "Полное обновление существующей записи. Возвращает 200 OK.",
    DELETE: "Удаление записи. Возвращает 200 OK или 204 No Content.",
  },
  restBody: "Тело запроса", restParams: "Параметры URL", restHeaders: "Заголовки",
  restTips: [
    { icon: "🟢", title: "GET безопасен", desc: "GET никогда не изменяет данные на сервере. Всегда используйте для чтения." },
    { icon: "📝", title: "POST vs PUT", desc: "POST создаёт новые записи, PUT заменяет существующие. PATCH для частичного обновления." },
    { icon: "🗑️", title: "DELETE осторожно", desc: "После удаления данные исчезают. Возвращайте 404, если ресурс не существует." },
  ],
  dbTitle: "Запросы к базе данных",
  dbSubtitle: "Посмотрите, как SQL-запросы работают с таблицей — SELECT, INSERT, UPDATE, DELETE — строка за строкой.",
  dbTable: "таблица users", dbResult: "Результат запроса", dbRows: "строк затронуто",
  dbExplain: {
    SELECT: "SELECT читает строки из таблицы. WHERE для фильтрации, ORDER BY для сортировки, LIMIT для пагинации.",
    INSERT: "INSERT добавляет новую строку. Auto-increment ID назначается базой данных.",
    UPDATE: "UPDATE изменяет существующие строки. Без WHERE обновляет все строки — осторожно!",
    DELETE: "DELETE удаляет строки. Без WHERE удаляет всё. Всегда используйте WHERE!",
  },
  dbTips: [
    { icon: "🔍", title: "Всегда используйте WHERE", desc: "UPDATE и DELETE без WHERE затрагивают все строки. Всегда фильтруйте запросы." },
    { icon: "🔑", title: "Первичный ключ", desc: "В каждой таблице должен быть уникальный PRIMARY KEY (обычно id) для быстрого поиска." },
    { icon: "📊", title: "Индексы", desc: "Добавляйте индексы к столбцам, по которым часто ищете или сортируете." },
  ],
  authTitle: "Аутентификация — JWT",
  authSubtitle: "Посмотрите, как JSON Web Token создаётся, подписывается, отправляется и проверяется между клиентом и сервером.",
  authLogin: "Вход", authVerify: "Проверить токен",
  authToken: "JWT Токен", authPayload: "Payload", authHeader: "Header", authSignature: "Подпись",
  authValid: "✅ Токен действителен — доступ разрешён",
  authInvalid: "❌ Токен недействителен — доступ запрещён",
  authExpired: "⏰ Токен истёк — войдите снова",
  authExplain: {
    sign: "Сервер создаёт JWT, кодируя header + payload секретным ключом алгоритмом HS256.",
    send: "Клиент сохраняет токен (localStorage или cookie) и отправляет его с каждым запросом как Bearer token.",
    verify: "Сервер декодирует токен и проверяет подпись. Если действителен, предоставляет доступ к ресурсу.",
  },
  authTips: [
    { icon: "🔐", title: "Не раскрывайте секреты", desc: "JWT_SECRET должен быть только на сервере. Никогда не отправляйте его клиенту." },
    { icon: "⏱️", title: "Устанавливайте срок", desc: "Всегда устанавливайте expiresIn. Короткий срок (15м) + refresh token — лучшая практика." },
    { icon: "📦", title: "Payload открыт", desc: "Payload кодируется base64, не шифруется. Не кладите пароли в payload!" },
  ],
  mwTitle: "Цепочка Middleware",
  mwSubtitle: "Посмотрите, как запрос проходит через слои middleware, прежде чем достичь обработчика маршрута.",
  mwRequest: "Входящий запрос", mwResponse: "Ответ", mwNext: "next()", mwBlocked: "Заблокирован",
  mwExplain: {
    logger: "Записывает метод запроса, URL и метку времени в консоль для отладки.",
    auth: "Проверяет заголовок Authorization. Если токен отсутствует или недействителен, возвращает 401.",
    ratelimit: "Ограничивает запросы по IP (например, 100 зап/мин). При превышении возвращает 429.",
    handler: "Фактический обработчик маршрута, который обрабатывает запрос и отправляет ответ.",
  },
  mwTips: [
    { icon: "⛓️", title: "Порядок важен", desc: "Middleware выполняется в порядке регистрации. Всегда ставьте auth перед обработчиками маршрутов." },
    { icon: "📞", title: "Вызывайте next()", desc: "Если забыть вызвать next(), запрос зависнет. Всегда вызывайте next() или отправляйте ответ." },
    { icon: "🛡️", title: "Error middleware", desc: "Обработчик ошибок имеет 4 параметра: (err, req, res, next). Регистрируйте последним." },
  ],
  wsTitle: "WebSocket — Реальное время",
  wsSubtitle: "В отличие от HTTP, WebSocket держит постоянное соединение открытым. Сообщения текут в обе стороны мгновенно.",
  wsConnect: "Подключить", wsDisconnect: "Отключить", wsSend: "Отправить",
  wsClient: "Клиент", wsServer: "Сервер",
  wsConnected: "Подключён", wsDisconnected: "Отключён",
  wsExplain: "WebSocket начинается как HTTP-запрос, затем переходит в постоянное TCP-соединение. Обе стороны могут отправлять сообщения в любое время без нового запроса.",
  wsTips: [
    { icon: "⚡", title: "Полный дуплекс", desc: "Клиент и сервер могут отправлять сообщения независимо — не нужно ждать запроса." },
    { icon: "🔄", title: "HTTP vs WS", desc: "HTTP — запрос-ответ (одноразовый). WebSocket держит соединение живым для реального времени." },
    { icon: "🔌", title: "Применение", desc: "Чат-приложения, живые уведомления, совместное редактирование, дашборды реального времени." },
  ],
  corsTitle: "CORS — Разные источники",
  corsSubtitle: "Браузеры по умолчанию блокируют запросы к другим источникам. CORS-заголовки сообщают браузеру, что разрешено.",
  corsAllowed: "Разрешено ✅", corsBlocked: "Заблокировано ❌", corsOrigin: "Источник",
  corsExplain: {
    same: "Запрос с того же источника: протокол, хост и порт совпадают. Браузер всегда разрешает.",
    allowed: "Запрос с другого источника, но сервер вернул Access-Control-Allow-Origin: *. Разрешено.",
    blocked: "Запрос с другого источника, но сервер не отправил CORS-заголовки. Браузер блокирует ответ.",
    options: "Preflight OPTIONS запрос: браузер спрашивает разрешение у сервера перед реальным запросом.",
  },
  corsTips: [
    { icon: "🌐", title: "Что такое источник?", desc: "Источник = протокол + хост + порт. https://a.com и http://a.com — разные источники." },
    { icon: "⚠️", title: "CORS только в браузере", desc: "CORS применяется только браузерами. curl и Postman полностью его обходят." },
    { icon: "🔒", title: "Не используйте *", desc: "Access-Control-Allow-Origin: * разрешает любому сайту. Используйте конкретные источники." },
  ],
};

export const BACKEND_I18N: Record<Lang, BackendTranslations> = { en, uz, ru };
