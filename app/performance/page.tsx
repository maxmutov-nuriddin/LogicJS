"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Home, BarChart3, GitBranch, Repeat, FunctionSquare,
  Layers, Trophy, ChevronDown, ChevronUp, Zap, Activity,
  Database, Target, Info, ArrowRight, CheckCircle2,
  MemoryStick, Hash, AlignJustify, Copy, Check, Terminal,
} from "lucide-react";
import { runCode } from "@/lib/steps";
import type { ExecutionStep } from "@/lib/types";
import { useLangStore } from "@/app/playground/store";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

// ─── Performance page translations ───────────────────────────────────────────

const PERF_UI = {
  uz: {
    showCode: "Kodni ko'rish",
    hideCode: "Kodni yashirish",
    copied: "Nusxalandi!",
    copy: "Nusxalash",
    steps: "qadam",
    stepsWith: (n: number) => `${n} qadam bilan bajarildi`,
    savingsPct: (pct: number) => `— boshqalariga qaraganda ${pct}% kam qadam`,
    best: "Eng samarali",
    detail: "Batafsil taqqoslash",
    metric: "Metrika",
    pageTitle: "Algoritmlar Samaradorligi",
    pageDesc: "Bir xil natija — turli usullar. Qaysi kod kam qadam, kam xotira, kichik call stack ishlatadi? Real o'lchovlar bilan solishtiring.",
    ctaTitle: "O'z kodingizni sinab ko'ring",
    ctaDesc: "Playground da har bir qadamni vizual ko'ring — loop, function, array, object hammasini",
    ctaBtn: "Playgroundga o'tish",
    resTitle: "Resurs Tahlilchi",
    resResults: "Taqqoslash natijalari",
    metricsTitle: "Metrikalar nima degani?",
    badges: ["6 ta stsenariy", "Real executor o'lchovi", "7 ta metrika"],
    metricLabels: ["Jami qadamlar", "Shart tekshirishlari", "Xotira amallar", "Tsikl aylanishlari", "Funksiya chaqiruvlari", "Call Stack chuqurligi", "Max o'zgaruvchilar"],
    metricDescs: [
      "Executor bajargan umumiy qadam soni. Murakkablik ko'rsatkichi.",
      "if/else, switch case qancha marta shartni tekshirdi.",
      "O'zgaruvchi yaratish, o'zgartirish, yangilash soni.",
      "For/while tsikli necha marta aylandi.",
      "Function() necha marta chaqirildi (rekursiya ichida ham).",
      "Call stack maksimal chuqurligi — rekursiyada yuqori bo'ladi.",
      "Bir vaqtda xotirada bo'lgan o'zgaruvchilar maksimal soni.",
    ],
  },
  en: {
    showCode: "Show code",
    hideCode: "Hide code",
    copied: "Copied!",
    copy: "Copy",
    steps: "steps",
    stepsWith: (n: number) => `Completed in ${n} steps`,
    savingsPct: (pct: number) => `— ${pct}% fewer steps than others`,
    best: "Most efficient",
    detail: "Detailed comparison",
    metric: "Metric",
    pageTitle: "Algorithm Efficiency",
    pageDesc: "Same result — different approaches. Which code uses fewer steps, less memory, smaller call stack? Compare with real measurements.",
    ctaTitle: "Test your own code",
    ctaDesc: "Visually see each step in Playground — loops, functions, arrays, objects and more",
    ctaBtn: "Go to Playground",
    resTitle: "Resource Analyzer",
    resResults: "Comparison results",
    metricsTitle: "What do the metrics mean?",
    badges: ["6 scenarios", "Real executor measurement", "7 metrics"],
    metricLabels: ["Total steps", "Condition checks", "Memory ops", "Loop iterations", "Function calls", "Call Stack depth", "Max variables"],
    metricDescs: [
      "Total steps the executor ran. Main complexity indicator.",
      "How many times if/else, switch/case checked a condition.",
      "Variable create, assign, update count.",
      "How many times the for/while loop iterated.",
      "How many times a function was called (including recursion).",
      "Maximum call stack depth — high with recursion.",
      "Maximum number of variables in memory at one time.",
    ],
  },
  ru: {
    showCode: "Показать код",
    hideCode: "Скрыть код",
    copied: "Скопировано!",
    copy: "Копировать",
    steps: "шагов",
    stepsWith: (n: number) => `Выполнено за ${n} шагов`,
    savingsPct: (pct: number) => `— на ${pct}% меньше шагов чем другие`,
    best: "Наиболее эффективный",
    detail: "Детальное сравнение",
    metric: "Метрика",
    pageTitle: "Эффективность алгоритмов",
    pageDesc: "Одинаковый результат — разные подходы. Какой код использует меньше шагов, меньше памяти, меньший стек вызовов?",
    ctaTitle: "Протестируйте свой код",
    ctaDesc: "Визуально смотрите каждый шаг в Playground — циклы, функции, массивы, объекты",
    ctaBtn: "Перейти в Playground",
    resTitle: "Анализатор ресурсов",
    resResults: "Результаты сравнения",
    metricsTitle: "Что означают метрики?",
    badges: ["6 сценариев", "Реальные измерения", "7 метрик"],
    metricLabels: ["Всего шагов", "Проверки условий", "Опер. с памятью", "Итераций цикла", "Вызовов функций", "Глубина стека", "Макс. переменных"],
    metricDescs: [
      "Общее число шагов исполнителя. Основной показатель сложности.",
      "Сколько раз if/else, switch/case проверял условие.",
      "Количество создания, изменения, обновления переменных.",
      "Сколько раз выполнился цикл for/while.",
      "Сколько раз вызывалась функция (включая рекурсию).",
      "Максимальная глубина стека вызовов — высокая при рекурсии.",
      "Максимальное число переменных в памяти одновременно.",
    ],
  },
} as const;

// ─── Metrics engine ──────────────────────────────────────────────────────────

function analyzeSteps(steps: ExecutionStep[]) {
  let maxCallStack = 0;
  let maxVars = 0;
  let conditions = 0;
  let loops = 0;
  let fnCalls = 0;
  let varOps = 0;
  let consoleOps = 0;

  for (const s of steps) {
    const depth = s.state.callStack?.length ?? 0;
    if (depth > maxCallStack) maxCallStack = depth;
    const vars = Object.keys(s.state.variables).length;
    if (vars > maxVars) maxVars = vars;

    switch (s.type) {
      case "evaluate-condition":
      case "loop-condition": conditions++; break;
      case "loop-iteration": loops++; break;
      case "function-call": fnCalls++; break;
      case "console-output": consoleOps++; break;
      case "declare-variable":
      case "assign-variable":
      case "update-variable": varOps++; break;
    }
  }

  return {
    total: steps.length,
    conditions,
    varOps,
    loops,
    fnCalls,
    maxCallStack,
    maxVars,
    consoleOps,
  };
}

type Metrics = ReturnType<typeof analyzeSteps>;

// ─── Scenario data ────────────────────────────────────────────────────────────

const COLORS = {
  blue:   { dot: "bg-blue-400",   bar: "bg-blue-500",   badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",   card: "border-blue-500/20 bg-blue-500/5"   },
  purple: { dot: "bg-purple-400", bar: "bg-purple-500", badge: "bg-purple-500/15 text-purple-300 border-purple-500/30", card: "border-purple-500/20 bg-purple-500/5" },
  orange: { dot: "bg-orange-400", bar: "bg-orange-500", badge: "bg-orange-500/15 text-orange-300 border-orange-500/30", card: "border-orange-500/20 bg-orange-500/5" },
  green:  { dot: "bg-emerald-400",bar: "bg-emerald-500",badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",card: "border-emerald-500/20 bg-emerald-500/5"},
  red:    { dot: "bg-rose-400",   bar: "bg-rose-500",   badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",   card: "border-rose-500/20 bg-rose-500/5"   },
} as const;

type ColorKey = keyof typeof COLORS;

interface Variant {
  label: string;
  color: ColorKey;
  code: string;
}

interface Scenario {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  desc: string;
  variants: Variant[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "conditions",
    icon: <GitBranch size={18} />,
    title: "Shart operatorlari",
    subtitle: "if/else if  vs  switch/case  vs  ternary",
    desc: "Bir xil vazifa: raqam bo'yicha hafta kunini aniqlash. Har bir usul qancha qadam ishlatadi?",
    variants: [
      {
        label: "if / else if",
        color: "blue",
        code: `let day = 3;
let name;
if (day === 1) {
  name = "Dushanba";
} else if (day === 2) {
  name = "Seshanba";
} else if (day === 3) {
  name = "Chorshanba";
} else if (day === 4) {
  name = "Payshanba";
} else if (day === 5) {
  name = "Juma";
} else {
  name = "Dam olish";
}
console.log(name);`,
      },
      {
        label: "switch / case",
        color: "purple",
        code: `let day = 3;
let name;
switch (day) {
  case 1: name = "Dushanba"; break;
  case 2: name = "Seshanba"; break;
  case 3: name = "Chorshanba"; break;
  case 4: name = "Payshanba"; break;
  case 5: name = "Juma"; break;
  default: name = "Dam olish";
}
console.log(name);`,
      },
      {
        label: "ternary (?:)",
        color: "green",
        code: `let day = 3;
let name = day === 1 ? "Dushanba"
  : day === 2 ? "Seshanba"
  : day === 3 ? "Chorshanba"
  : day === 4 ? "Payshanba"
  : day === 5 ? "Juma"
  : "Dam olish";
console.log(name);`,
      },
    ],
  },
  {
    id: "loops",
    icon: <Repeat size={18} />,
    title: "Tsikl turlari",
    subtitle: "for  vs  while  vs  for-of",
    desc: "1 dan 10 gacha sonlar yig'indisi. Tsikl turi resursga qanchalik ta'sir qiladi?",
    variants: [
      {
        label: "for loop",
        color: "blue",
        code: `let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum = sum + i;
}
console.log(sum);`,
      },
      {
        label: "while loop",
        color: "orange",
        code: `let sum = 0;
let i = 1;
while (i <= 10) {
  sum = sum + i;
  i++;
}
console.log(sum);`,
      },
      {
        label: "for-of loop",
        color: "purple",
        code: `let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let sum = 0;
for (let n of nums) {
  sum = sum + n;
}
console.log(sum);`,
      },
    ],
  },
  {
    id: "recursion",
    icon: <FunctionSquare size={18} />,
    title: "Rekursiya vs Iteratsiya",
    subtitle: "Fibonacci(7) — ikki usul",
    desc: "Bir xil natija — boshqa usul. Rekursiya call stack ni ko'p ishlatadi, iteratsiya esa oddiy tsikl bilan ketadi.",
    variants: [
      {
        label: "Rekursiya (recursive)",
        color: "red",
        code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
let result = fib(7);
console.log(result);`,
      },
      {
        label: "Iteratsiya (iterative)",
        color: "green",
        code: `let a = 0;
let b = 1;
for (let i = 0; i < 7; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}
console.log(a);`,
      },
    ],
  },
  {
    id: "search",
    icon: <Target size={18} />,
    title: "Qidiruv usullari",
    subtitle: "break yo'q  vs  break bilan (early exit)",
    desc: "9 ta elementli arrayda qiymat qidirish. `break` ishlatish qancha qadamni tejaydi?",
    variants: [
      {
        label: "Break yo'q (to'liq)",
        color: "red",
        code: `let arr = [3, 7, 2, 9, 1, 5, 8, 4, 6];
let target = 5;
let found = -1;
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) {
    found = i;
  }
}
console.log(found);`,
      },
      {
        label: "Break bilan (erta to'xtash)",
        color: "green",
        code: `let arr = [3, 7, 2, 9, 1, 5, 8, 4, 6];
let target = 5;
let found = -1;
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === target) {
    found = i;
    break;
  }
}
console.log(found);`,
      },
    ],
  },
  {
    id: "nested",
    icon: <Layers size={18} />,
    title: "Ichma-ich tsikl vs Oddiy tsikl",
    subtitle: "5×5 = 25 ta amal",
    desc: "Bir xil miqdorda amal bajarish — ichma-ich for vs oddiy for. Call stack va qadam farqi qanday?",
    variants: [
      {
        label: "Nested for (5×5)",
        color: "orange",
        code: `let count = 0;
for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= 5; j++) {
    count = count + 1;
  }
}
console.log(count);`,
      },
      {
        label: "Oddiy for (1..25)",
        color: "blue",
        code: `let count = 0;
for (let k = 1; k <= 25; k++) {
  count = count + 1;
}
console.log(count);`,
      },
    ],
  },
  {
    id: "dataops",
    icon: <Database size={18} />,
    title: "Array vs Object — ma'lumot saqlash",
    subtitle: "5 ta qiymat saqlash va o'qish",
    desc: "5 ta ma'lumotni turli usullarda saqlash. Array indeks bilan, Object kalit bilan — qaysi biri kam qadam?",
    variants: [
      {
        label: "Array (indeks bilan)",
        color: "orange",
        code: `let data = [10, 20, 30, 40, 50];
let a = data[0];
let b = data[2];
let c = data[4];
data[1] = 99;
console.log(a, b, c, data[1]);`,
      },
      {
        label: "Object (kalit bilan)",
        color: "purple",
        code: `let data = {a: 10, b: 20, c: 30, d: 40, e: 50};
let x = data.a;
let y = data.c;
let z = data.e;
data.b = 99;
console.log(x, y, z, data.b);`,
      },
    ],
  },
];

// ─── Metric definitions ───────────────────────────────────────────────────────

const METRICS: Array<{
  key: keyof Metrics;
  labelIdx: number;
  icon: React.ReactNode;
  lowerIsBetter: boolean;
  color: string;
}> = [
  { key: "total",        labelIdx: 0, icon: <Activity size={12} />,       lowerIsBetter: true, color: "text-blue-400" },
  { key: "conditions",   labelIdx: 1, icon: <GitBranch size={12} />,      lowerIsBetter: true, color: "text-purple-400" },
  { key: "varOps",       labelIdx: 2, icon: <MemoryStick size={12} />,    lowerIsBetter: true, color: "text-orange-400" },
  { key: "loops",        labelIdx: 3, icon: <Repeat size={12} />,         lowerIsBetter: true, color: "text-yellow-400" },
  { key: "fnCalls",      labelIdx: 4, icon: <FunctionSquare size={12} />, lowerIsBetter: true, color: "text-pink-400" },
  { key: "maxCallStack", labelIdx: 5, icon: <AlignJustify size={12} />,   lowerIsBetter: true, color: "text-rose-400" },
  { key: "maxVars",      labelIdx: 6, icon: <Hash size={12} />,           lowerIsBetter: true, color: "text-emerald-400" },
];

// ─── Visual helpers ───────────────────────────────────────────────────────────

function fmtVal(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undef";
  if (typeof value === "string") {
    const s = `"${value}"`;
    return s.length > 12 ? s.slice(0, 11) + '…"' : s;
  }
  if (Array.isArray(value)) return `[${value.length}]`;
  if (typeof value === "object") return `{…}`;
  return String(value);
}

function typeColor(value: unknown): string {
  if (typeof value === "number") return "text-blue-300";
  if (typeof value === "string") return "text-green-300";
  if (typeof value === "boolean") return value ? "text-emerald-300" : "text-rose-300";
  if (Array.isArray(value)) return "text-orange-300";
  if (typeof value === "object") return "text-violet-300";
  return "text-gray-300";
}

interface PeakState {
  deepestStack: string[];
  peakVars: Record<string, unknown>;
  maxIteration: number;
  consoleOutput: string[];
}

function extractPeak(steps: ExecutionStep[]): PeakState {
  let deepestStack: string[] = [];
  let peakVars: Record<string, unknown> = {};
  let peakVarCount = 0;
  let maxIteration = 0;
  let consoleOutput: string[] = [];
  for (const s of steps) {
    const cs = s.state.callStack ?? [];
    if (cs.length > deepestStack.length) deepestStack = cs;
    const vc = Object.keys(s.state.variables).length;
    if (vc > peakVarCount) { peakVarCount = vc; peakVars = s.state.variables; }
    if (s.type === "loop-iteration" && s.iteration > maxIteration) maxIteration = s.iteration;
    consoleOutput = s.state.consoleOutput;
  }
  return { deepestStack, peakVars, maxIteration, consoleOutput };
}

// ── Memory panel ──────────────────────────────────────────────────────────────

function MemoryPanel({ vars }: { vars: Record<string, unknown> }) {
  const entries = Object.entries(vars).filter(([, v]) => typeof v !== "function");
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <MemoryStick size={11} className="text-orange-400" />
        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Xotira</span>
        <span className="ml-auto text-[10px] font-mono text-gray-600">{entries.length} ta</span>
      </div>
      {entries.length === 0 ? (
        <p className="text-[10px] text-gray-600 italic">Bo'sh</p>
      ) : (
        <div className="flex flex-col gap-1">
          {entries.map(([name, value]) => {
            const isArr = Array.isArray(value);
            const isObj = !isArr && typeof value === "object" && value !== null;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-1 px-2 py-1.5 rounded-md border border-orange-500/20 bg-orange-500/5"
              >
                <span className="text-orange-300 font-mono text-[10px] font-bold shrink-0">{name}</span>
                <span className="text-gray-600 text-[10px] shrink-0">=</span>
                {isArr ? (
                  <div className="flex flex-wrap gap-0.5 min-w-0">
                    {(value as unknown[]).slice(0, 12).map((el, i) => (
                      <span key={i} className="px-1 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 font-mono text-[9px]">
                        <span className="text-gray-600">[{i}]</span>
                        <span className={typeColor(el)}>{fmtVal(el)}</span>
                      </span>
                    ))}
                    {(value as unknown[]).length > 12 && (
                      <span className="text-[9px] text-gray-600">+{(value as unknown[]).length - 12}</span>
                    )}
                  </div>
                ) : isObj ? (
                  <div className="flex flex-wrap gap-0.5 min-w-0">
                    {Object.entries(value as Record<string, unknown>).slice(0, 6).map(([k, v]) => (
                      <span key={k} className="px-1 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 font-mono text-[9px]">
                        <span className="text-violet-400">{k}:</span>
                        <span className={typeColor(v)}>{fmtVal(v)}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className={`font-mono text-[10px] font-bold ${typeColor(value)}`}>{fmtVal(value)}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Call stack panel ──────────────────────────────────────────────────────────

function CallStackPanel({ stack }: { stack: string[] }) {
  const reversed = [...stack].reverse();
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <AlignJustify size={11} className="text-purple-400" />
        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Call Stack</span>
        <span className="ml-auto text-[10px] font-mono text-gray-600">{stack.length} qavat</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {reversed.map((fn, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border font-mono text-[10px] ${
              i === 0
                ? "border-purple-500/40 bg-purple-500/15 text-purple-200 font-bold"
                : "border-purple-500/15 bg-purple-500/5 text-gray-500"
            }`}
            style={{ marginLeft: `${i * 6}px` }}
          >
            <span className="text-[9px] text-gray-600 w-3 text-right shrink-0">{stack.length - i}</span>
            <span>{fn}()</span>
            {i === 0 && <span className="ml-auto text-[9px] text-purple-500">▶ hozir</span>}
          </motion.div>
        ))}
        <div
          className="flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] text-gray-700"
          style={{ marginLeft: `${reversed.length * 6}px` }}
        >
          <span className="text-[9px] w-3 text-right">0</span>
          <span>(global scope)</span>
        </div>
      </div>
    </div>
  );
}

// ── Loop panel ────────────────────────────────────────────────────────────────

function LoopPanel({ count }: { count: number }) {
  const MAX = 24;
  const dots = Math.min(count, MAX);
  const extra = count > MAX ? count - MAX : 0;
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Repeat size={11} className="text-yellow-400" />
        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Loop</span>
        <span className="ml-auto text-[10px] font-mono text-yellow-600">{count} aylanish</span>
      </div>
      <div className="flex flex-wrap gap-1 items-center">
        {Array.from({ length: dots }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: Math.min(i * 0.03, 0.4), type: "spring", stiffness: 400 }}
            className={`w-2.5 h-2.5 rounded-full ${
              i === dots - 1
                ? "bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.6)]"
                : "bg-yellow-700/50"
            }`}
          />
        ))}
        {extra > 0 && <span className="text-[10px] text-yellow-700 font-mono">+{extra}</span>}
      </div>
    </div>
  );
}

// ── Console panel ─────────────────────────────────────────────────────────────

function ConsolePanel({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Terminal size={11} className="text-emerald-400" />
        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Console</span>
      </div>
      <div className="bg-background rounded-md border border-border px-2 py-1.5 flex flex-col gap-0.5">
        {lines.map((line, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <span className="text-emerald-600 text-[10px] shrink-0">›</span>
            <span className="font-mono text-[10px] text-emerald-300 break-all">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Metric bar ───────────────────────────────────────────────────────────────

function MetricBar({
  label,
  value,
  max,
  color,
  isBest,
  icon,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  isBest: boolean;
  icon: React.ReactNode;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div className="flex items-center gap-2 py-1">
      <div className={`shrink-0 ${color}`}>{icon}</div>
      <span className="text-[10px] text-gray-500 w-[90px] shrink-0 leading-none">{label}</span>
      <div className="flex-1 h-3 bg-surface-2 rounded-full overflow-hidden border border-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className={`h-full rounded-full ${
            isBest && value > 0
              ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
              : value === 0
              ? "bg-gray-700"
              : "bg-gray-600"
          }`}
        />
      </div>
      <span
        className={`text-xs font-mono font-bold w-8 text-right shrink-0 ${
          isBest && value > 0
            ? "text-emerald-400"
            : value === 0
            ? "text-gray-600"
            : "text-gray-400"
        }`}
      >
        {value}
      </span>
      {isBest && value > 0 && (
        <span className="text-emerald-400 shrink-0">
          <CheckCircle2 size={10} />
        </span>
      )}
    </div>
  );
}

// ─── Variant card ─────────────────────────────────────────────────────────────

function VariantCard({
  variant,
  metrics,
  maxMetrics,
  bestMetrics,
  isWinner,
  rank,
  steps,
}: {
  variant: Variant;
  metrics: Metrics;
  maxMetrics: Partial<Metrics>;
  bestMetrics: Partial<Metrics>;
  isWinner: boolean;
  rank: number;
  steps: ExecutionStep[];
}) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const { lang } = useLangStore();
  const t = PERF_UI[lang];
  const c = COLORS[variant.color];
  const peak = extractPeak(steps);

  function handleCopy() {
    navigator.clipboard.writeText(variant.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.08 }}
      className={`relative rounded-xl border p-4 flex flex-col gap-3 ${
        isWinner
          ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_16px_rgba(16,185,129,0.1)]"
          : `${c.card}`
      }`}
    >
      {/* Winner crown */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, delay: 0.3 }}
          className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
        >
          <Trophy size={13} className="text-white" />
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0`} />
        <span className="text-sm font-bold text-gray-200">{variant.label}</span>
        <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold ${c.badge}`}>
          {metrics.total} {t.steps}
        </span>
      </div>

      {/* Metric bars */}
      <div className="flex flex-col gap-0.5">
        {METRICS.map((m) => {
          const val = metrics[m.key] as number;
          const max = (maxMetrics[m.key] as number) ?? 1;
          const best = bestMetrics[m.key] as number;
          return (
            <MetricBar
              key={m.key}
              label={t.metricLabels[m.labelIdx]}
              value={val}
              max={max === 0 ? 1 : max}
              color={m.color}
              isBest={val === best}
              icon={m.icon}
            />
          );
        })}
      </div>

      {/* ── Visual panels ── */}
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background/40 p-3">
        {/* Memory */}
        <MemoryPanel vars={peak.peakVars} />

        {/* Call stack — only if there was recursion */}
        {peak.deepestStack.length > 0 && (
          <>
            <div className="h-px bg-border" />
            <CallStackPanel stack={peak.deepestStack} />
          </>
        )}

        {/* Loop dots — only if there were iterations */}
        {peak.maxIteration > 0 && (
          <>
            <div className="h-px bg-border" />
            <LoopPanel count={peak.maxIteration} />
          </>
        )}

        {/* Console output */}
        {peak.consoleOutput.length > 0 && (
          <>
            <div className="h-px bg-border" />
            <ConsolePanel lines={peak.consoleOutput} />
          </>
        )}
      </div>

      {/* Code toggle */}
      <button
        onClick={() => setShowCode((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] text-gray-600 hover:text-gray-400 transition-colors mt-1"
      >
        <Code2 size={10} />
        <span>{showCode ? t.hideCode : t.showCode}</span>
        {showCode ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>

      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative group">
              <pre className="text-[11px] font-mono text-gray-300 bg-background border border-border rounded-lg p-3 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {variant.code}
              </pre>
              <button
                onClick={handleCopy}
                title={t.copy}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-surface-2 border border-border text-[10px] text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                {copied ? (
                  <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">{t.copied}</span></>
                ) : (
                  <><Copy size={10} /><span>{t.copy}</span></>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Scenario card ────────────────────────────────────────────────────────────

function ScenarioCard({ scenario, index }: { scenario: Scenario; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const { lang } = useLangStore();
  const t = PERF_UI[lang];

  const allResults = useMemo(() => {
    return scenario.variants.map((v) => {
      const result = runCode(v.code, "uz");
      return { metrics: analyzeSteps(result.steps), steps: result.steps };
    });
  }, [scenario]);

  const allMetrics = useMemo(() => allResults.map((r) => r.metrics), [allResults]);
  const allSteps = useMemo(() => allResults.map((r) => r.steps), [allResults]);

  // Compute max per metric across all variants
  const maxMetrics = useMemo(() => {
    const result: Partial<Metrics> = {};
    for (const m of METRICS) {
      result[m.key] = Math.max(...allMetrics.map((am) => am[m.key] as number));
    }
    return result;
  }, [allMetrics]);

  // Compute best (lowest) per metric
  const bestMetrics = useMemo(() => {
    const result: Partial<Metrics> = {};
    for (const m of METRICS) {
      const vals = allMetrics.map((am) => am[m.key] as number);
      result[m.key] = Math.min(...vals);
    }
    return result;
  }, [allMetrics]);

  // Winner = variant with lowest total steps
  const winnerIdx = useMemo(() => {
    const totals = allMetrics.map((m) => m.total);
    return totals.indexOf(Math.min(...totals));
  }, [allMetrics]);

  const winner = scenario.variants[winnerIdx];
  const winnerMetrics = allMetrics[winnerIdx];
  const loserMax = Math.max(...allMetrics.map((m) => m.total));
  const savings =
    loserMax > 0
      ? Math.round(((loserMax - winnerMetrics.total) / loserMax) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-2xl border border-border bg-surface overflow-hidden"
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-2/50 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-gray-400 shrink-0">
          {scenario.icon}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="font-bold text-sm text-gray-100">{scenario.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">{scenario.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Trophy size={10} className="text-emerald-400" />
            <span className="text-[10px] text-emerald-300 font-mono font-bold">{winner.label}</span>
          </div>
          {expanded ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-4 border-t border-border">
              {/* Description */}
              <div className="flex items-start gap-2 pt-4">
                <Info size={13} className="text-gray-600 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">{scenario.desc}</p>
              </div>

              {/* Metric legend row */}
              <div className="flex flex-wrap gap-2">
                {METRICS.map((m) => (
                  <div
                    key={m.key}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface-2 border border-border"
                    title={t.metricDescs[m.labelIdx]}
                  >
                    <span className={m.color}>{m.icon}</span>
                    <span className="text-[10px] text-gray-500">{t.metricLabels[m.labelIdx]}</span>
                  </div>
                ))}
              </div>

              {/* Variant cards grid */}
              <div
                className={`grid gap-3 ${
                  scenario.variants.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-3"
                }`}
              >
                {scenario.variants.map((variant, i) => (
                  <VariantCard
                    key={variant.label}
                    variant={variant}
                    metrics={allMetrics[i]}
                    maxMetrics={maxMetrics}
                    bestMetrics={bestMetrics}
                    isWinner={i === winnerIdx}
                    rank={i}
                    steps={allSteps[i]}
                  />
                ))}
              </div>

              {/* Winner summary */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3"
              >
                <Trophy size={18} className="text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-emerald-300">
                    {t.best}:{" "}
                    <span className="font-mono">{winner.label}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t.stepsWith(winnerMetrics.total)}
                    {savings > 0 && (
                      <span className="text-emerald-500 ml-1 font-medium">
                        {t.savingsPct(savings)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-black font-mono text-emerald-300">{winnerMetrics.total}</p>
                  <p className="text-[10px] text-gray-600">{t.steps}</p>
                </div>
              </motion.div>

              {/* Per-metric comparison table (compact) */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-surface-2 px-3 py-2 border-b border-border flex items-center gap-2">
                  <BarChart3 size={12} className="text-gray-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                    {t.detail}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-3 py-2 text-gray-600 font-medium w-[140px]">{t.metric}</th>
                        {scenario.variants.map((v) => (
                          <th key={v.label} className="px-3 py-2 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] ${COLORS[v.color].badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${COLORS[v.color].dot}`} />
                              {v.label}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {METRICS.map((m, mi) => {
                        const vals = allMetrics.map((am) => am[m.key] as number);
                        const best = Math.min(...vals);
                        return (
                          <tr
                            key={m.key}
                            className={`border-b border-border/50 ${mi % 2 === 0 ? "" : "bg-surface-2/30"}`}
                          >
                            <td className="px-3 py-2 text-gray-500 text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <span className={m.color}>{m.icon}</span>
                                {t.metricLabels[m.labelIdx]}
                              </div>
                            </td>
                            {vals.map((val, vi) => (
                              <td key={vi} className="px-3 py-2 text-center">
                                <span
                                  className={`font-bold ${
                                    val === best && val > 0
                                      ? "text-emerald-400"
                                      : val === 0
                                      ? "text-gray-700"
                                      : "text-gray-300"
                                  }`}
                                >
                                  {val}
                                  {val === best && val > 0 && (
                                    <span className="text-emerald-500 ml-0.5">✓</span>
                                  )}
                                </span>
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Metrics info cards ───────────────────────────────────────────────────────

function MetricInfoCard({
  icon,
  label,
  desc,
  color,
  example,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  color: string;
  example: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-3 flex flex-col gap-1.5`}
      style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
    >
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-xs font-bold text-gray-200">{label}</span>
      </div>
      <p className="text-[10px] text-gray-500 leading-relaxed">{desc}</p>
      <code className="text-[10px] font-mono text-gray-600 bg-surface-2 rounded px-1.5 py-0.5 w-fit">
        {example}
      </code>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PerformancePage() {
  const { lang } = useLangStore();
  const t = PERF_UI[lang];

  const BADGE_ICONS = [<Layers size={11} key="l" />, <Zap size={11} key="z" />, <Activity size={11} key="a" />];
  const METRIC_ICONS = [
    <Activity size={14} key="0" />, <GitBranch size={14} key="1" />, <MemoryStick size={14} key="2" />,
    <Repeat size={14} key="3" />, <FunctionSquare size={14} key="4" />, <AlignJustify size={14} key="5" />,
    <Hash size={14} key="6" />,
  ];
  const METRIC_COLORS = ["text-blue-400","text-purple-400","text-orange-400","text-yellow-400","text-pink-400","text-rose-400","text-emerald-400"];
  const METRIC_EXAMPLES = ["18 → more work","if (x>3) → 1","let x=5 → 1","for i=0..9 → 10","fib(5) → 15","fib(8) → 8","3 let → 3"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 h-12 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Code2 size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm text-white font-mono tracking-tight">
              Logic<span className="text-primary-light">Lab</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-border">
            <BarChart3 size={12} className="text-accent-light" />
            <span className="text-xs font-semibold text-gray-300 hidden sm:block">{t.resTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/playground"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Code2 size={12} />
              <span className="hidden sm:block">Playground</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Home size={12} />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center flex flex-col items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t.pageTitle}
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {t.pageDesc}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {t.badges.map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-xs text-gray-400"
              >
                {BADGE_ICONS[i]}
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Metric legend */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Info size={13} className="text-gray-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              {t.metricsTitle}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {t.metricLabels.map((label, i) => (
              <MetricInfoCard
                key={label}
                icon={METRIC_ICONS[i]}
                label={label}
                desc={t.metricDescs[i]}
                color={METRIC_COLORS[i]}
                example={METRIC_EXAMPLES[i]}
              />
            ))}
          </div>
        </div>

        {/* Scenarios */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-border">
              <BarChart3 size={12} className="text-accent-light" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {t.resResults}
              </span>
            </div>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-4">
            {SCENARIOS.map((scenario, i) => (
              <ScenarioCard key={scenario.id} scenario={scenario} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
            <Code2 size={22} className="text-primary-light" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-100">{t.ctaTitle}</p>
            <p className="text-sm text-gray-500 mt-0.5">{t.ctaDesc}</p>
          </div>
          <Link
            href="/playground"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shrink-0"
          >
            {t.ctaBtn}
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="pb-8" />
      </main>
    </div>
  );
}
