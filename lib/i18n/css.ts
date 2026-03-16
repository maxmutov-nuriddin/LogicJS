import type { Lang } from "./index";

export interface CSSTranslations {
  pageTitle: string;
  pageSubtitle: string;
  pageHint: string;

  // Tabs
  flexDesc: string;
  gridDesc: string;
  animDesc: string;

  // Flex section labels
  flexAxesTitle: string;
  flexAxisJustifyRow: string;
  flexAxisJustifyCol: string;
  flexAxisAlignRow: string;
  flexAxisAlignCol: string;
  flexFallback: string;
  flexTips: { icon: string; title: string; desc: string }[];

  // Grid section labels
  gridFallback: string;
  gridTips: { icon: string; title: string; desc: string }[];

  // Anim section labels
  animTimingTitle: string;
  animRestartBtn: string;
  animTransitionDiff: string;
  transitionDesc: string;
  animationDesc: string;
  animTips: { icon: string; title: string; desc: string }[];

  // Explain maps
  flexExplain: Record<string, string>;
  gridExplain: Record<string, string>;
  animExplain: Record<string, string>;
  easingExplain: Record<string, string>;
}

// ─── Uzbek ────────────────────────────────────────────────────────────────────

const uz: CSSTranslations = {
  pageTitle: "CSS ni ko'rib o'rgan",
  pageSubtitle: "Tugmalarni bosib — flex, grid va animatsiyalar qanday ishlashini live ko'ring.",
  pageHint: "Hech narsa yozmasangiz ham bo'ladi — shunchaki bosing!",

  flexDesc: "1 o'qli tartib",
  gridDesc: "2 o'qli jadval",
  animDesc: "CSS animatsiyalar",

  flexAxesTitle: "Flex o'qlari",
  flexAxisJustifyRow: "↔ gorizontal o'q (row holatda)",
  flexAxisJustifyCol: "↕ vertikal o'q (column holatda)",
  flexAxisAlignRow: "↕ vertikal o'q (row holatda)",
  flexAxisAlignCol: "↔ gorizontal o'q (column holatda)",
  flexFallback: "Qiymatni o'zgartirish uchun chap tomondagi tugmani bosing",
  flexTips: [
    { icon: "📦", title: "display: flex", desc: "Konteynerga qo'llanadi, ichidagi barcha bolalar flex item bo'ladi" },
    { icon: "↔️", title: "Main axis", desc: "justify-content asosiy o'q bo'yicha ishlaydi — flex-direction ga teng" },
    { icon: "↕️", title: "Cross axis", desc: "align-items ko'ndalang o'q bo'yicha — main axis ga 90° perpendikulyar" },
    { icon: "🔄", title: "flex-wrap: wrap", desc: "Kichik ekranlarda elementlar keyingi qatorga o'tsin desangiz" },
  ],

  gridFallback: "Grid xususiyatini o'zgartirish uchun chapdan tanlang",
  gridTips: [
    { icon: "🗂️", title: "grid-template-columns", desc: "Ustunlar sonini va kengligini belgilaydi. repeat(3, 1fr) = 3 ta teng ustun" },
    { icon: "📐", title: "1fr (fraction)", desc: "Bo'sh joyni teng bo'laklarga bo'ladi. 2fr katta, 1fr kichik ustun" },
    { icon: "↔️", title: "justify-items", desc: "Har bir elementni o'z katakchasi ichida gorizontal tekislaydi" },
    { icon: "↕️", title: "grid-column: span N", desc: "Bir element bir necha ustunni egallashi uchun. Karta/banner uchun qulay" },
  ],

  animTimingTitle: "animation-timing-function — tezlanish grafigi:",
  animRestartBtn: "↺ Qayta boshlash",
  animTransitionDiff: "transition va animation farqi:",
  transitionDesc: "Hover yoki state o'zganganda ishlaydi. Faqat A → B orasida.",
  animationDesc: "O'zi-o'zicha ishlaydi. @keyframes bilan ko'p kadrli.",
  animTips: [
    { icon: "🎬", title: "@keyframes", desc: "Animatsiyaning har bir kadrini belgilaydi. 0% boshlang'ich, 100% tugash holati" },
    { icon: "⏱️", title: "animation-duration", desc: "Animatsiya necha sekundda bir marta aylanishini belgilaydi" },
    { icon: "🔁", title: "iteration-count: infinite", desc: "Animatsiya to'xtovsiz takrorlanadi. Oddiy number = necha marta" },
    { icon: "📈", title: "timing-function", desc: "Tezlanish egri chizig'i. ease-in-out natija professional ko'rinish beradi" },
  ],

  flexExplain: {
    row:              "Elementlar chapdan → o'ngga joylashadi (odatiy tartib)",
    "row-reverse":    "Elementlar o'ngdan ← chapga — teskari tartibda",
    column:           "Elementlar yuqoridan ↓ pastga joylashadi",
    "column-reverse": "Elementlar pastdan ↑ yuqoriga — teskari tartibda",
    "flex-start":     "Elementlar konteyner boshidan joylashadi (chap yoki yuq)",
    center:           "Elementlar o'rtaga — markazga to'planadi",
    "flex-end":       "Elementlar konteyner oxiriga suriladi (o'ng yoki past)",
    "space-between":  "Birinchi/oxirgi chegarada, qolganlari teng bo'shliq bilan",
    "space-around":   "Har bir elementning ikki tomonida teng bo'shliq",
    "space-evenly":   "Barcha oraliq bo'shliqlar mutlaqo teng",
    stretch:          "Elementlar ko'ndalang o'qda to'liq cho'ziladi",
    nowrap:           "Elementlar bir qatorga sig'masa ham o'tib ketmaydi, qisqaradi",
    wrap:             "Elementlar sig'masa keyingi qatorga o'tadi",
    "wrap-reverse":   "Elementlar sig'masa yuqoriga — teskari tartibda o'tadi",
  },
  gridExplain: {
    "1col":   "1 ta ustun — elementlar vertikal ravishda joylashadi",
    "2col":   "2 ta teng kenglikdagi ustun — grid 2 ga bo'linadi",
    "3col":   "3 ta teng ustun — har biri flex-1 kabi 1fr kenglikda",
    "4col":   "4 ta ustun — kichik elementlar uchun qulay",
    "gap0":   "Bo'shliqsiz — elementlar bir-biriga yopishadi",
    "gap8":   "8px bo'shliq — kichik, lekin aniq ajratilgan",
    "gap16":  "16px bo'shliq — ko'p foydalaniladigan standart bo'shliq",
    "gap24":  "24px bo'shliq — keng, nafis ko'rinish",
    start:    "Elementlar katakcha ichida chapga/yuqoriga tortiladi",
    center:   "Elementlar katakcha ichida markazga joylashadi",
    end:      "Elementlar katakcha ichida o'ngga/pastga tortiladi",
    stretch:  "Elementlar katakcha kengligini to'liq egallaydi (odatiy)",
    span2:    "Bu element 2 ta ustunni egallaydi: grid-column: span 2",
    span3:    "Bu element 3 ta ustunni egallaydi: grid-column: span 3",
  },
  animExplain: {
    bounce: "Yuqoriga ko'tarilib pastga tushadi — translateY bilan",
    spin:   "360° aylanadi — rotate bilan",
    fade:   "Ko'rinib yo'qoladi — opacity bilan",
    slide:  "Chapdan o'ngga siljib o'tadi — translateX bilan",
    pulse:  "Kattayib kichrayadi — scale bilan",
    shake:  "Chayqaladi — rotate bilan",
    flip:   "3D aylanadi — perspective + rotateY bilan",
    swing:  "Arjuza kabi tebranadi — translate + rotate kombinatsiyasi",
  },
  easingExplain: {
    linear:      "Tezlik o'zgarishsiz — bir xil sur'atda",
    ease:        "Sekin boshlaydi, tezlashadi, sekin tugaydi (odatiy)",
    "ease-in":   "Sekin boshlaydi, tez tugaydi",
    "ease-out":  "Tez boshlaydi, sekin tugaydi",
    "ease-in-out": "Sekin boshlaydi va sekin tugaydi",
    "cubic-bezier(0.68,-0.55,0.27,1.55)": "Spring — ortga qaytirib keladi (elastik)",
  },
};

// ─── English ──────────────────────────────────────────────────────────────────

const en: CSSTranslations = {
  pageTitle: "Learn CSS by seeing",
  pageSubtitle: "Click buttons to see how flex, grid and animations work live.",
  pageHint: "No code needed — just click and explore!",

  flexDesc: "1-axis layout",
  gridDesc: "2-axis table",
  animDesc: "CSS animations",

  flexAxesTitle: "Flex axes",
  flexAxisJustifyRow: "↔ horizontal axis (in row direction)",
  flexAxisJustifyCol: "↕ vertical axis (in column direction)",
  flexAxisAlignRow: "↕ vertical axis (in row direction)",
  flexAxisAlignCol: "↔ horizontal axis (in column direction)",
  flexFallback: "Click a button on the left to change the value",
  flexTips: [
    { icon: "📦", title: "display: flex", desc: "Applied to the container — all direct children become flex items" },
    { icon: "↔️", title: "Main axis", desc: "justify-content works along the main axis — same direction as flex-direction" },
    { icon: "↕️", title: "Cross axis", desc: "align-items works on the cross axis — perpendicular (90°) to the main axis" },
    { icon: "🔄", title: "flex-wrap: wrap", desc: "Use this to let items wrap to the next line on smaller screens" },
  ],

  gridFallback: "Select a property from the left to change the grid",
  gridTips: [
    { icon: "🗂️", title: "grid-template-columns", desc: "Defines number and width of columns. repeat(3, 1fr) = 3 equal columns" },
    { icon: "📐", title: "1fr (fraction)", desc: "Divides available space equally. 2fr = twice as wide as 1fr" },
    { icon: "↔️", title: "justify-items", desc: "Aligns each item horizontally within its grid cell" },
    { icon: "↕️", title: "grid-column: span N", desc: "Makes one item span multiple columns. Great for cards and banners" },
  ],

  animTimingTitle: "animation-timing-function — speed curve:",
  animRestartBtn: "↺ Restart",
  animTransitionDiff: "transition vs animation:",
  transitionDesc: "Triggers on hover or state change. Only A → B.",
  animationDesc: "Runs on its own. Multi-frame with @keyframes.",
  animTips: [
    { icon: "🎬", title: "@keyframes", desc: "Defines each frame of the animation. 0% = start, 100% = end state" },
    { icon: "⏱️", title: "animation-duration", desc: "How many seconds one full animation cycle takes" },
    { icon: "🔁", title: "iteration-count: infinite", desc: "Animation loops forever. A plain number = how many times" },
    { icon: "📈", title: "timing-function", desc: "The speed curve. ease-in-out gives a professional polished feel" },
  ],

  flexExplain: {
    row:              "Items are placed left → right (default direction)",
    "row-reverse":    "Items are placed right ← left — reversed order",
    column:           "Items are stacked top ↓ to bottom",
    "column-reverse": "Items are stacked bottom ↑ to top — reversed",
    "flex-start":     "Items are packed at the start of the container (left or top)",
    center:           "Items are centered in the container",
    "flex-end":       "Items are pushed to the end of the container (right or bottom)",
    "space-between":  "First/last at edges, rest evenly spaced between",
    "space-around":   "Equal space on both sides of each item",
    "space-evenly":   "All spaces between items are exactly equal",
    stretch:          "Items stretch to fill the container along the cross axis",
    nowrap:           "Items stay on one line even if they overflow (may shrink)",
    wrap:             "Items wrap onto the next line when they don't fit",
    "wrap-reverse":   "Items wrap onto the previous line — reversed wrap",
  },
  gridExplain: {
    "1col":   "1 column — items are stacked vertically",
    "2col":   "2 equal-width columns — grid splits in half",
    "3col":   "3 equal columns — each is 1fr wide",
    "4col":   "4 columns — great for compact items",
    "gap0":   "No gap — items are flush against each other",
    "gap8":   "8px gap — small but clearly separated",
    "gap16":  "16px gap — standard, most commonly used",
    "gap24":  "24px gap — wide, elegant look",
    start:    "Items are pulled to the start (left/top) of their cell",
    center:   "Items are centered within their cell",
    end:      "Items are pushed to the end (right/bottom) of their cell",
    stretch:  "Items fill the full width of their cell (default)",
    span2:    "This item spans 2 columns: grid-column: span 2",
    span3:    "This item spans 3 columns: grid-column: span 3",
  },
  animExplain: {
    bounce: "Goes up and comes back down — using translateY",
    spin:   "Rotates 360° — using rotate",
    fade:   "Appears and disappears — using opacity",
    slide:  "Slides left to right — using translateX",
    pulse:  "Grows and shrinks — using scale",
    shake:  "Wobbles side to side — using rotate",
    flip:   "3D flip — using perspective + rotateY",
    swing:  "Swings like a pendulum — translate + rotate combined",
  },
  easingExplain: {
    linear:      "Constant speed — no acceleration or deceleration",
    ease:        "Starts slow, speeds up, ends slow (default)",
    "ease-in":   "Starts slow, ends fast",
    "ease-out":  "Starts fast, ends slow",
    "ease-in-out": "Starts and ends slowly",
    "cubic-bezier(0.68,-0.55,0.27,1.55)": "Spring — overshoots and snaps back (elastic)",
  },
};

// ─── Russian ──────────────────────────────────────────────────────────────────

const ru: CSSTranslations = {
  pageTitle: "Учи CSS, наблюдая",
  pageSubtitle: "Нажимайте кнопки — смотрите, как работают flex, grid и анимации вживую.",
  pageHint: "Не нужно ничего писать — просто нажимайте!",

  flexDesc: "Однострочная раскладка",
  gridDesc: "Двумерная сетка",
  animDesc: "CSS анимации",

  flexAxesTitle: "Оси flex",
  flexAxisJustifyRow: "↔ горизонтальная ось (направление row)",
  flexAxisJustifyCol: "↕ вертикальная ось (направление column)",
  flexAxisAlignRow: "↕ вертикальная ось (направление row)",
  flexAxisAlignCol: "↔ горизонтальная ось (направление column)",
  flexFallback: "Нажмите кнопку слева, чтобы изменить значение",
  flexTips: [
    { icon: "📦", title: "display: flex", desc: "Применяется к контейнеру — все прямые дочерние элементы становятся flex-элементами" },
    { icon: "↔️", title: "Main axis", desc: "justify-content работает по главной оси — совпадает с направлением flex-direction" },
    { icon: "↕️", title: "Cross axis", desc: "align-items работает по поперечной оси — перпендикулярно (90°) главной" },
    { icon: "🔄", title: "flex-wrap: wrap", desc: "Используйте, чтобы элементы переносились на следующую строку на маленьких экранах" },
  ],

  gridFallback: "Выберите свойство слева, чтобы изменить сетку",
  gridTips: [
    { icon: "🗂️", title: "grid-template-columns", desc: "Задаёт количество и ширину столбцов. repeat(3, 1fr) = 3 равных столбца" },
    { icon: "📐", title: "1fr (fraction)", desc: "Делит свободное пространство поровну. 2fr вдвое шире 1fr" },
    { icon: "↔️", title: "justify-items", desc: "Выравнивает каждый элемент горизонтально внутри своей ячейки" },
    { icon: "↕️", title: "grid-column: span N", desc: "Элемент занимает несколько столбцов. Удобно для карточек и баннеров" },
  ],

  animTimingTitle: "animation-timing-function — кривая скорости:",
  animRestartBtn: "↺ Перезапустить",
  animTransitionDiff: "Разница между transition и animation:",
  transitionDesc: "Срабатывает при hover или смене состояния. Только A → B.",
  animationDesc: "Запускается сам по себе. Многокадровый с @keyframes.",
  animTips: [
    { icon: "🎬", title: "@keyframes", desc: "Определяет каждый кадр анимации. 0% = начало, 100% = конец" },
    { icon: "⏱️", title: "animation-duration", desc: "Сколько секунд занимает один полный цикл анимации" },
    { icon: "🔁", title: "iteration-count: infinite", desc: "Анимация повторяется бесконечно. Число = количество повторений" },
    { icon: "📈", title: "timing-function", desc: "Кривая скорости. ease-in-out придаёт профессиональный вид" },
  ],

  flexExplain: {
    row:              "Элементы располагаются слева → направо (стандартный порядок)",
    "row-reverse":    "Элементы располагаются справа ← налево — обратный порядок",
    column:           "Элементы стакаются сверху ↓ вниз",
    "column-reverse": "Элементы стакаются снизу ↑ вверх — обратный порядок",
    "flex-start":     "Элементы прижаты к началу контейнера (лево или верх)",
    center:           "Элементы выровнены по центру контейнера",
    "flex-end":       "Элементы прижаты к концу контейнера (право или низ)",
    "space-between":  "Первый/последний у краёв, остальные с равными промежутками",
    "space-around":   "Равные отступы с обеих сторон каждого элемента",
    "space-evenly":   "Все промежутки между элементами абсолютно равны",
    stretch:          "Элементы растягиваются по поперечной оси контейнера",
    nowrap:           "Элементы остаются в одну строку, даже если переполняют (могут сжиматься)",
    wrap:             "Элементы переносятся на следующую строку, если не помещаются",
    "wrap-reverse":   "Элементы переносятся на предыдущую строку — обратный перенос",
  },
  gridExplain: {
    "1col":   "1 столбец — элементы выстраиваются вертикально",
    "2col":   "2 столбца одинаковой ширины — сетка делится пополам",
    "3col":   "3 равных столбца — каждый шириной 1fr",
    "4col":   "4 столбца — удобно для компактных элементов",
    "gap0":   "Без промежутков — элементы вплотную друг к другу",
    "gap8":   "Промежуток 8px — небольшой, но чёткий",
    "gap16":  "Промежуток 16px — стандартный, наиболее распространённый",
    "gap24":  "Промежуток 24px — широкий, элегантный вид",
    start:    "Элементы прижаты к началу (лево/верх) ячейки",
    center:   "Элементы выровнены по центру ячейки",
    end:      "Элементы прижаты к концу (право/низ) ячейки",
    stretch:  "Элементы занимают всю ширину ячейки (по умолчанию)",
    span2:    "Элемент занимает 2 столбца: grid-column: span 2",
    span3:    "Элемент занимает 3 столбца: grid-column: span 3",
  },
  animExplain: {
    bounce: "Поднимается вверх и опускается вниз — через translateY",
    spin:   "Поворот на 360° — через rotate",
    fade:   "Появляется и исчезает — через opacity",
    slide:  "Скользит слева направо — через translateX",
    pulse:  "Увеличивается и уменьшается — через scale",
    shake:  "Покачивается из стороны в сторону — через rotate",
    flip:   "3D-переворот — через perspective + rotateY",
    swing:  "Качается как маятник — комбинация translate + rotate",
  },
  easingExplain: {
    linear:      "Постоянная скорость — без ускорения и замедления",
    ease:        "Медленный старт, ускорение, медленный финиш (по умолчанию)",
    "ease-in":   "Медленный старт, быстрый финиш",
    "ease-out":  "Быстрый старт, медленный финиш",
    "ease-in-out": "Медленный старт и медленный финиш",
    "cubic-bezier(0.68,-0.55,0.27,1.55)": "Spring — перебрасывает и возвращает (эластичный)",
  },
};

export const CSS_UI: Record<Lang, CSSTranslations> = { en, uz, ru };
