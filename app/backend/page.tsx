"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Globe, Database, Server, Monitor, Zap, Play, Code2, Layers, BarChart3,
} from "lucide-react";
import { useLangStore } from "@/app/playground/store";
import { BACKEND_I18N, BackendTranslations } from "@/lib/i18n/backend";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "basics" | "fs" | "eventloop" | "httpnative";

const ALL_TABS: { id: TabId; group: "core"; icon: React.ReactNode; color: string; glow: string; border: string; indexStr: string }[] = [
  { id: "basics",     group: "core", icon: <Server size={14} />,   color: "text-blue-400",    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",   border: "border-blue-500/30",   indexStr: "01" },
  { id: "fs",         group: "core", icon: <Database size={14} />, color: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",  border: "border-emerald-500/30", indexStr: "02" },
  { id: "eventloop",  group: "core", icon: <Zap size={14} />,      color: "text-yellow-400",  glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",   border: "border-yellow-500/30",  indexStr: "03" },
  { id: "httpnative", group: "core", icon: <Globe size={14} />,    color: "text-purple-400",  glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]", border: "border-purple-500/30",  indexStr: "04" },
];

// ─── Postman i18n local dictionary ────────────────────────────────────────────

const POSTMAN_I18N = {
  en: {
    clientTitle: "Postman Client",
    queryParams: "URL Query Parameters (Request parameters)",
    noQueryParamsPost: "POST requests normally do not require query parameters.\nData is sent securely inside the Request Body instead.",
    pathParamId: "Path parameter specifies database key id:\nSplit query matches req.url.startsWith('/api/users/')",
    requestHeaders: "HTTP Request Headers",
    noBodyRequired: "HTTP {method} requests do not require a request body.\nThe server processes the request from path matching.",
    requestBodyPayload: "Request Body Payload (JSON)",
    keyLabel: "Key",
    valueLabel: "Value"
  },
  uz: {
    clientTitle: "Postman Mijoz",
    queryParams: "URL so'rov parametrlari (Request parameters)",
    noQueryParamsPost: "POST so'rovlarida parametrlar ishlatilmaydi.\nMa'lumotlar Body orqali xavfsiz yuboriladi.",
    pathParamId: "ID parametri URL yo'lida (Path) yuboriladi:\nreq.url.startsWith('/api/users/') tekshiruvi orqali.",
    requestHeaders: "HTTP so'rov sarlavhalari (Request Headers)",
    noBodyRequired: "HTTP {method} so'rovlarida tana (body) yuborilmaydi.\nServer ma'lumotni URL yo'lidan tahlil qiladi.",
    requestBodyPayload: "So'rov tanasi (JSON Body)",
    keyLabel: "Kalit",
    valueLabel: "Qiymat"
  },
  ru: {
    clientTitle: "Postman Клиент",
    queryParams: "Параметры URL-запроса (Query Parameters)",
    noQueryParamsPost: "POST-запросы обычно не требуют параметров запроса.\nДанные отправляются внутри тела запроса (Request Body).",
    pathParamId: "Параметр ID передается в пути URL (Path):\nreq.url.startsWith('/api/users/') для обработки.",
    requestHeaders: "Заголовки HTTP-запроса (Headers)",
    noBodyRequired: "HTTP {method}-запросы не требуют тела запроса.\nСервер обрабатывает запрос на основе пути URL.",
    requestBodyPayload: "Тело запроса (JSON Body)",
    keyLabel: "Ключ",
    valueLabel: "Значение"
  }
};

// ─── Event Loop Speed Control i18n dictionary ─────────────────────────────────

const SPEED_I18N = {
  en: {
    speedLabel: "Animation Speed",
  },
  uz: {
    speedLabel: "Animatsiya tezligi",
  },
  ru: {
    speedLabel: "Скорость анимации",
  }
};

// ─── JS Code component ────────────────────────────────────────────────────────

function JSCode({ lines, filename = "server.js" }: { lines: string[]; filename?: string }) {
  const keywords = ["const", "let", "var", "function", "async", "await", "return", "if", "else", "new", "require", "import", "from", "export"];
  return (
    <div className="rounded-xl bg-[#0d1117] border border-border overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-[#161b22] shrink-0">
        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-[10px] text-gray-600 font-mono">{filename}</span>
      </div>
      <div className="p-4 font-mono text-[12px] leading-[1.7] overflow-x-auto flex-1 bg-[#0d1117]">
        {lines.map((line, i) => {
          const parts: { text: string; cls: string }[] = [];
          let remaining = line;

          const addPart = (text: string, cls: string) => parts.push({ text, cls });

          if (remaining.trim().startsWith("//") || remaining.trim().startsWith("--")) {
            addPart(remaining, "text-gray-600 italic");
          } else {
            const strRe = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g;
            let lastIdx = 0;
            let m: RegExpExecArray | null;
            while ((m = strRe.exec(remaining)) !== null) {
              const before = remaining.slice(lastIdx, m.index);
              if (before) {
                before.split(/(\b(?:const|let|var|function|async|await|return|if|else|new|require|import|from|export)\b|\b\d+\b)/).forEach(tok => {
                  if (keywords.includes(tok)) addPart(tok, "text-blue-400 font-semibold");
                  else if (/^\d+$/.test(tok)) addPart(tok, "text-orange-400");
                  else addPart(tok, "text-gray-300");
                });
              }
              addPart(m[0], "text-green-400");
              lastIdx = m.index + m[0].length;
            }
            const rest = remaining.slice(lastIdx);
            if (rest) {
              rest.split(/(\b(?:const|let|var|function|async|await|return|if|else|new|require|import|from|export)\b|\b\d+\b)/).forEach(tok => {
                if (keywords.includes(tok)) addPart(tok, "text-blue-400 font-semibold");
                else if (/^\d+$/.test(tok)) addPart(tok, "text-orange-400");
                else addPart(tok, "text-gray-300");
              });
            }
          }

          return (
            <div key={i} className="whitespace-pre">
              {parts.map((p, j) => <span key={j} className={p.cls}>{p.text}</span>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────

function InfoCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-[#0d1117]/60 p-3.5 flex gap-3">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-bold text-gray-200 font-mono mb-1">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── BASICS & ESM SECTION ─────────────────────────────────────────────────────

function BasicsSection({ t }: { t: BackendTranslations }) {
  const [format, setFormat] = useState<"commonjs" | "esm">("commonjs");

  const codeFiles = {
    commonjs: {
      math: [
        "// math.js",
        "const add = (a, b) => a + b;",
        "const sub = (a, b) => a - b;",
        "",
        "module.exports = {",
        "  add,",
        "  sub"
      ],
      app: [
        "// app.js",
        "const math = require('./math');",
        "",
        "console.log(math.add(5, 3)); // 8",
        "console.log(math.sub(5, 3)); // 2"
      ]
    },
    esm: {
      math: [
        "// math.js",
        "export const add = (a, b) => a + b;",
        "export const sub = (a, b) => a - b;"
      ],
      app: [
        "// app.js",
        "import { add, sub } from './math.js';",
        "",
        "console.log(add(5, 3)); // 8",
        "console.log(sub(5, 3)); // 2"
      ]
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top controls and code side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-[#0d1117]/60 p-5 flex flex-col justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 font-mono mb-3">Module System</p>
            <div className="flex gap-2">
              <button onClick={() => setFormat("commonjs")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold font-mono border transition-all duration-150 ${
                  format === "commonjs"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : "bg-surface-2 text-gray-500 border-border"
                }`}>
                CommonJS (CJS)
              </button>
              <button onClick={() => setFormat("esm")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold font-mono border transition-all duration-150 ${
                  format === "esm"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-surface-2 text-gray-500 border-border"
                }`}>
                ES Modules (ESM)
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-blue-500/25 bg-blue-500/5 px-4 py-3 flex-1 flex items-center">
            <p className="text-xs text-gray-300 leading-relaxed">
              <code className="text-blue-400 font-bold font-mono">{format === "commonjs" ? "require()" : "import"}</code>{" — "}
              {t.basicsExplain[format]}
            </p>
          </div>
        </div>

        <JSCode lines={codeFiles[format].app} filename="app.js" />
      </div>

      {/* Full-width Diagram */}
      <div className="rounded-2xl border border-border bg-[#0d1117] p-8 flex flex-col justify-center min-h-[220px]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative max-w-3xl mx-auto w-full">
          <motion.div layout className="w-56 rounded-xl border border-gray-700 bg-surface-2/45 p-4 flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-2 border-b border-border pb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-xs font-mono font-bold text-gray-300">math.js</span>
            </div>
            <div className="font-mono text-[10px] text-gray-500">
              {format === "commonjs" ? "module.exports = { add, sub }" : "export const add, sub"}
            </div>
          </motion.div>

          <div className="flex-1 flex items-center justify-center relative w-full md:w-auto h-12 md:h-auto">
            <div className="w-full md:w-44 h-0.5 bg-border relative">
              <motion.div key={format} initial={{ left: 0 }} animate={{ left: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full ${
                  format === "commonjs" ? "bg-blue-400 shadow-glow" : "bg-emerald-400 shadow-glow-accent"
                }`} />
            </div>
            <span className="absolute -top-6 text-[10px] font-mono text-gray-500">
              {format === "commonjs" ? "Sync require()" : "Static Import"}
            </span>
          </div>

          <motion.div layout className="w-56 rounded-xl border border-gray-700 bg-surface-2/45 p-4 flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-2 border-b border-border pb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs font-mono font-bold text-gray-300">app.js</span>
            </div>
            <div className="font-mono text-[10px] text-gray-500">
              {format === "commonjs" ? "const math = require('./math')" : "import { add, sub }"}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {t.basicsTips.map((tip, idx) => <InfoCard key={idx} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
      </div>
    </div>
  );
}

// ─── FS SECTION ───────────────────────────────────────────────────────────────

function FSSection({ t }: { t: BackendTranslations }) {
  const [mode, setMode] = useState<"sync" | "async" | "promises">("sync");
  const [stack, setStack] = useState<string[]>([]);
  const [threads, setThreads] = useState<{ id: number; task: string | null }[]>([
    { id: 1, task: null },
    { id: 2, task: null },
    { id: 3, task: null },
    { id: 4, task: null },
  ]);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [loopActive, setLoopActive] = useState(false);

  const codeFiles = {
    sync: [
      "const fs = require('fs');",
      "console.log('Start');",
      "",
      "// Blocks the call stack!",
      "const data = fs.readFileSync('file.txt');",
      "console.log(data.toString());",
      "",
      "console.log('End');"
    ],
    async: [
      "const fs = require('fs');",
      "console.log('Start');",
      "",
      "// Offloads to Thread Pool",
      "fs.readFile('file.txt', (err, data) => {",
      "  console.log(data.toString());",
      "});",
      "",
      "console.log('End');"
    ],
    promises: [
      "const fs = require('fs').promises;",
      "console.log('Start');",
      "",
      "async function run() {",
      "  const data = await fs.readFile('file.txt');",
      "  console.log(data.toString());",
      "}",
      "run();",
      "console.log('End');"
    ]
  };

  const execute = async () => {
    if (running) return;
    setRunning(true);
    setStack([]);
    setOutput([]);
    setThreads([
      { id: 1, task: null },
      { id: 2, task: null },
      { id: 3, task: null },
      { id: 4, task: null },
    ]);

    setStack(["console.log('Start')"]);
    await new Promise(r => setTimeout(r, 600));
    setOutput(o => [...o, "Start"]);
    setStack([]);
    await new Promise(r => setTimeout(r, 400));

    if (mode === "sync") {
      setStack(["fs.readFileSync() [Blocking...]"]);
      await new Promise(r => setTimeout(r, 1200));
      setOutput(o => [...o, "File data contents"]);
      setStack([]);
      await new Promise(r => setTimeout(r, 400));

      setStack(["console.log('End')"]);
      await new Promise(r => setTimeout(r, 600));
      setOutput(o => [...o, "End"]);
      setStack([]);
    } else {
      const callStr = mode === "async" ? "fs.readFile()" : "run()";
      setStack([callStr]);
      await new Promise(r => setTimeout(r, 500));
      
      setThreads(prev => prev.map((t, idx) => idx === 0 ? { ...t, task: "Reading file.txt" } : t));
      setStack([]);
      await new Promise(r => setTimeout(r, 400));

      setStack(["console.log('End')"]);
      await new Promise(r => setTimeout(r, 600));
      setOutput(o => [...o, "End"]);
      setStack([]);
      await new Promise(r => setTimeout(r, 600));

      setThreads(prev => prev.map((t, idx) => idx === 0 ? { ...t, task: "Finished (Ready)" } : t));
      await new Promise(r => setTimeout(r, 500));

      setLoopActive(true);
      await new Promise(r => setTimeout(r, 400));
      setLoopActive(false);

      setStack(["callback(data)"]);
      await new Promise(r => setTimeout(r, 600));
      setOutput(o => [...o, "File data contents"]);
      setStack([]);
      setThreads(prev => prev.map((t, idx) => idx === 0 ? { ...t, task: null } : t));
    }

    setRunning(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top controls and code side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-[#0d1117]/60 p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-500 font-mono">FS Read Mode</p>
            <div className="flex flex-col gap-2">
              {(["sync", "async", "promises"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setStack([]); setOutput([]); }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold font-mono border text-left transition-all duration-150 ${
                    mode === m
                      ? mode === "sync" ? "bg-red-500/20 text-red-300 border-red-500/40" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-surface-2 text-gray-500 border-border"
                  }`}>
                  {m === "sync" ? "fs.readFileSync (Sync)" : m === "async" ? "fs.readFile (Async)" : "fs.promises.readFile"}
                </button>
              ))}
            </div>
          </div>
          <button onClick={execute} disabled={running}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
            <Play size={14} />Execute Code
          </button>
        </div>

        <JSCode lines={codeFiles[mode]} filename="file-system.js" />
      </div>

      <div className={`rounded-xl border px-4 py-3 ${mode === "sync" ? "border-red-500/20 bg-red-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
        <p className="text-sm text-gray-300">
          <code className="text-emerald-400 font-bold font-mono">{mode === "sync" ? "readFileSync" : "readFile"}</code>{" — "}
          {t.fsExplain[mode]}
        </p>
      </div>

      {/* Full-width Diagram */}
      <div className="rounded-2xl border border-border bg-[#0d1117] p-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border bg-surface-2/30 p-4 flex flex-col gap-3">
            <span className="text-[10px] text-gray-500 font-mono font-bold">Main Call Stack</span>
            <div className="flex-1 flex flex-col-reverse gap-2 min-h-[140px] justify-start">
              <AnimatePresence>
                {stack.map((item) => (
                  <motion.div key={item} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`p-2.5 rounded-lg border text-xs font-mono font-bold ${
                      mode === "sync" ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    }`}>{item}</motion.div>
                ))}
              </AnimatePresence>
              {stack.length === 0 && <div className="text-gray-600 text-xs italic font-mono text-center my-auto">Stack Empty</div>}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-2/30 p-4 flex flex-col gap-3">
            <span className="text-[10px] text-gray-500 font-mono font-bold flex items-center gap-1.5">
              <motion.div animate={loopActive ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center font-bold text-[8px]">↻</motion.div>
              Libuv Thread Pool
            </span>
            <div className="flex flex-col gap-2">
              {threads.map(thr => (
                <div key={thr.id} className="flex items-center justify-between p-2 rounded bg-[#161b22] border border-border/50 text-[10px] font-mono">
                  <span className="text-gray-500">Thread #{thr.id}</span>
                  <span className={thr.task ? "text-yellow-400 font-bold" : "text-gray-600"}>{thr.task || "Idle"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-2/30 p-4 flex flex-col gap-3">
            <span className="text-[10px] text-gray-500 font-mono font-bold">Console Output</span>
            <div className="flex-1 bg-[#161b22] rounded-lg p-3 font-mono text-xs text-gray-400 space-y-1 min-h-[140px]">
              {output.map((out, idx) => (
                <div key={idx} className="text-green-400 font-mono">{`> ${out}`}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {t.fsTips.map((tip, idx) => <InfoCard key={idx} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
      </div>
    </div>
  );
}

// ─── EVENT LOOP SECTION ───────────────────────────────────────────────────────

function EventLoopSection({ t }: { t: BackendTranslations }) {
  const [stack, setStack] = useState<string[]>([]);
  const [nextTickQueue, setNextTickQueue] = useState<string[]>([]);
  const [promiseQueue, setPromiseQueue] = useState<string[]>([]);
  const [timerQueue, setTimerQueue] = useState<string[]>([]);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [highlightedPhase, setHighlightedPhase] = useState<string | null>(null);
  const [speed, setSpeed] = useState<1 | 0.5 | 0.3>(1);
  const { lang } = useLangStore();

  const sp = SPEED_I18N[lang as "uz" | "en" | "ru"] ?? SPEED_I18N.en;

  const codeLines = [
    "console.log('Start');",
    "setTimeout(() => console.log('Timeout'), 0);",
    "Promise.resolve().then(() => console.log('Promise'));",
    "process.nextTick(() => console.log('nextTick'));",
    "console.log('End');"
  ];

  const execute = async () => {
    if (running) return;
    setRunning(true);
    setStack([]);
    setNextTickQueue([]);
    setPromiseQueue([]);
    setTimerQueue([]);
    setOutput([]);
    setHighlightedPhase(null);

    const runDelay = (ms: number) => new Promise(r => setTimeout(r, ms * (1 / speed)));

    setStack(["console.log('Start')"]);
    await runDelay(600);
    setOutput(o => [...o, "Start"]);
    setStack([]);
    await runDelay(450);

    setStack(["setTimeout(cb, 0)"]);
    await runDelay(600);
    setTimerQueue(["cb (Timeout)"]);
    setStack([]);
    await runDelay(450);

    setStack(["Promise.resolve().then(cb)"]);
    await runDelay(600);
    setPromiseQueue(["cb (Promise)"]);
    setStack([]);
    await runDelay(450);

    setStack(["process.nextTick(cb)"]);
    await runDelay(600);
    setNextTickQueue(["cb (nextTick)"]);
    setStack([]);
    await runDelay(450);

    setStack(["console.log('End')"]);
    await runDelay(600);
    setOutput(o => [...o, "End"]);
    setStack([]);
    await runDelay(600);

    setHighlightedPhase("microtasks");
    await runDelay(500);

    if (nextTickQueue.length > 0) {
      setStack(["cb (nextTick)"]);
      setNextTickQueue([]);
      await runDelay(600);
      setOutput(o => [...o, "nextTick"]);
      setStack([]);
      await runDelay(500);
    }

    if (promiseQueue.length > 0) {
      setStack(["cb (Promise)"]);
      setPromiseQueue([]);
      await runDelay(600);
      setOutput(o => [...o, "Promise"]);
      setStack([]);
      await runDelay(500);
    }

    setHighlightedPhase("timers");
    await runDelay(500);

    if (timerQueue.length > 0) {
      setStack(["cb (Timeout)"]);
      setTimerQueue([]);
      await runDelay(600);
      setOutput(o => [...o, "Timeout"]);
      setStack([]);
      await runDelay(500);
    }

    setHighlightedPhase(null);
    setRunning(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top controls and code side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-[#0d1117]/60 p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-500 font-mono">Event Loop Simulation</p>
            <p className="text-xs text-gray-400 leading-relaxed">{t.eventloopSubtitle}</p>
            
            {/* Speed selection controls */}
            <div className="mt-2">
              <p className="text-[10px] text-gray-500 font-mono mb-2">{sp.speedLabel}</p>
              <div className="flex gap-1.5">
                {([1, 0.5, 0.3] as const).map(s => {
                  const labelMap = {
                    1: "1.0x",
                    0.5: "0.5x",
                    0.3: "0.3x"
                  };
                  const active = speed === s;
                  return (
                    <button key={s} onClick={() => setSpeed(s)} disabled={running}
                      className={`flex-1 py-1.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                        active
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-surface-2 text-gray-500 border-border hover:border-gray-600 disabled:opacity-50"
                      }`}>
                      {labelMap[s]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <button onClick={execute} disabled={running}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
            <Play size={14} />Run Code
          </button>
        </div>

        <JSCode lines={codeLines} filename="event-loop.js" />
      </div>

      {/* Full-width Diagram */}
      <div className="rounded-2xl border border-border bg-[#0d1117] p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-surface-2/20 p-3 min-h-[120px] flex flex-col">
            <span className="text-[10px] text-gray-500 font-mono font-bold mb-2">Call Stack</span>
            <div className="flex-1 flex flex-col-reverse gap-1.5">
              {stack.map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-purple-500/20 border border-purple-500/30 text-[10px] font-mono font-bold text-purple-300">{item}</div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-3 min-h-[120px] flex flex-col ${highlightedPhase === "microtasks" ? "border-yellow-500/50 bg-yellow-500/5" : "border-border bg-surface-2/20"}`}>
            <span className="text-[10px] text-gray-500 font-mono font-bold mb-2">nextTick Queue</span>
            <div className="flex-1 flex flex-col gap-1.5">
              {nextTickQueue.map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-mono text-yellow-400">{item}</div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-3 min-h-[120px] flex flex-col ${highlightedPhase === "microtasks" ? "border-emerald-500/50 bg-emerald-500/5" : "border-border bg-surface-2/20"}`}>
            <span className="text-[10px] text-gray-500 font-mono font-bold mb-2">Promise Queue</span>
            <div className="flex-1 flex flex-col gap-1.5">
              {promiseQueue.map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">{item}</div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-3 min-h-[120px] flex flex-col ${highlightedPhase === "timers" ? "border-blue-500/50 bg-blue-500/5" : "border-border bg-surface-2/20"}`}>
            <span className="text-[10px] text-gray-500 font-mono font-bold mb-2">Timers (Macrotask)</span>
            <div className="flex-1 flex flex-col gap-1.5">
              {timerQueue.map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">{item}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-[#161b22] p-4 flex flex-col gap-2">
          <span className="text-[9px] text-gray-500 font-mono font-bold">Console Output</span>
          <div className="font-mono text-xs text-gray-400 min-h-[60px] space-y-1">
            {output.map((out, idx) => <div key={idx} className="text-green-400 font-mono">{`> ${out}`}</div>)}
          </div>
        </div>
      </div>
      
      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {t.eventloopTips.map((tip, idx) => <InfoCard key={idx} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
      </div>
    </div>
  );
}

// ─── HTTP NATIVE & POSTMAN SECTION ───────────────────────────────────────────

function HTTPNativeSection({ t }: { t: BackendTranslations }) {
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("GET");
  const [url, setUrl] = useState("/api/users");
  const [body, setBody] = useState('{\n  "name": "Ali Valiyev",\n  "email": "ali@example.com"\n}');
  const [response, setResponse] = useState<{ status: string; body: string; headers: Record<string, string> } | null>(null);
  const [phase, setPhase] = useState<"idle" | "request" | "server" | "db" | "response" | "done">("idle");
  const [postmanTab, setPostmanTab] = useState<"params" | "headers" | "body">("params");
  const { lang } = useLangStore();

  const pm = POSTMAN_I18N[lang as "uz" | "en" | "ru"] ?? POSTMAN_I18N.en;

  const serverCode = [
    "const http = require('http');",
    "",
    "const server = http.createServer((req, res) => {",
    "  if (req.method === 'GET' && req.url === '/api/users') {",
    "    res.writeHead(200, { 'Content-Type': 'application/json' });",
    "    res.end(JSON.stringify([{ id: 1, name: 'Ali' }]));",
    "  } else if (req.method === 'POST' && req.url === '/api/users') {",
    "    let body = '';",
    "    req.on('data', chunk => { body += chunk; });",
    "    req.on('end', () => {",
    "      // Simulates Database Query internally",
    "      res.writeHead(201, { 'Content-Type': 'application/json' });",
    "      res.end(JSON.stringify({ created: true, id: 42 }));",
    "    });",
    "  } else if (req.method === 'PUT' && req.url.startsWith('/api/users/')) {",
    "    let body = '';",
    "    req.on('data', chunk => { body += chunk; });",
    "    req.on('end', () => {",
    "      res.writeHead(200, { 'Content-Type': 'application/json' });",
    "      res.end(JSON.stringify({ updated: true }));",
    "    });",
    "  } else if (req.method === 'DELETE' && req.url.startsWith('/api/users/')) {",
    "    res.writeHead(204);",
    "    res.end();",
    "  } else {",
    "    res.writeHead(404);",
    "    res.end();",
    "  }",
    "});",
    "server.listen(3000);"
  ];

  const triggerRequest = async () => {
    setPhase("request");
    setResponse(null);
    await new Promise(r => setTimeout(r, 800));
    setPhase("server");
    await new Promise(r => setTimeout(r, 600));
    
    setPhase("db");
    await new Promise(r => setTimeout(r, 800));
    setPhase("server");
    await new Promise(r => setTimeout(r, 400));
    
    setPhase("response");
    await new Promise(r => setTimeout(r, 800));

    if (method === "GET" && url === "/api/users") {
      setResponse({
        status: "200 OK",
        headers: { "Content-Type": "application/json", "Connection": "keep-alive" },
        body: JSON.stringify([
          { id: 1, name: "Ali Valiyev", email: "ali@example.com" },
          { id: 2, name: "Vali Karimov", email: "vali@example.com" }
        ], null, 2)
      });
    } else if (method === "POST" && url === "/api/users") {
      try {
        const parsed = JSON.parse(body);
        setResponse({
          status: "201 Created",
          headers: { "Content-Type": "application/json", "Connection": "keep-alive" },
          body: JSON.stringify({ created: true, id: 42, data: parsed }, null, 2)
        });
      } catch (err) {
        setResponse({
          status: "400 Bad Request",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Invalid JSON format" }, null, 2)
        });
      }
    } else if (method === "PUT" && url.startsWith("/api/users/")) {
      try {
        const parsed = JSON.parse(body);
        setResponse({
          status: "200 OK",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updated: true, data: parsed }, null, 2)
        });
      } catch (err) {
        setResponse({
          status: "400 Bad Request",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Invalid JSON format" }, null, 2)
        });
      }
    } else if (method === "DELETE" && url.startsWith("/api/users/")) {
      setResponse({
        status: "204 No Content",
        headers: { "Connection": "close" },
        body: "// 204 No Content - Empty response body"
      });
    } else {
      setResponse({
        status: "404 Not Found",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Endpoint not matched" }, null, 2)
      });
    }

    setPhase("done");
  };

  const steps = [
    { id: "request",   label: "1. Request Sent",       desc: "Client -> Server (HTTP Packet)", color: "text-orange-400" },
    { id: "server",    label: "2. Server Route Match", desc: "Checks req.method & req.url",     color: "text-blue-400" },
    { id: "db",        label: "3. Database Logic",     desc: "Queries/Writes mock SQL table",   color: "text-purple-400" },
    { id: "response",  label: "4. Response Returned",   desc: "writeHead() & res.end() packet",  color: "text-emerald-400" },
  ];

  const methodColors: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    POST: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    PUT: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    DELETE: "bg-red-500/20 text-red-300 border-red-500/40",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Postman controls & server.js Code side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-2 rounded-xl border border-border bg-[#0d1117] overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-border/50 bg-[#161b22] flex items-center justify-between shrink-0">
            <span className="text-[10px] font-mono font-bold text-orange-400">{pm.clientTitle}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            </div>
          </div>
          <div className="p-4 border-b border-border/40 shrink-0 bg-[#0d1117]">
            <div className="flex gap-2">
              <select value={method} onChange={e => {
                const m = e.target.value as "GET"|"POST"|"PUT"|"DELETE";
                setMethod(m);
                setUrl(m === "GET" || m === "POST" ? "/api/users" : "/api/users/1");
                if (m === "PUT") {
                  setBody('{\n  "name": "Ali Valiyev (Updated)",\n  "email": "new.ali@example.com"\n}');
                } else {
                  setBody('{\n  "name": "Ali Valiyev",\n  "email": "ali@example.com"\n}');
                }
              }} className="bg-surface border border-border rounded-lg text-xs font-mono px-2 py-1.5 text-gray-300 outline-none">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input value={url} onChange={e => setUrl(e.target.value)}
                className="flex-1 bg-surface border border-border rounded-lg text-xs font-mono px-3 py-1.5 text-gray-300 outline-none" />
            </div>
          </div>

          {/* Postman Tabs Bar */}
          <div className="flex border-b border-border bg-[#161b22]/30 text-[10px] font-mono shrink-0">
            {(["params", "headers", "body"] as const).map(t => {
              const isActive = postmanTab === t;
              return (
                <button key={t} onClick={() => setPostmanTab(t)}
                  className={`px-4 py-2 border-r border-border font-bold uppercase transition-colors ${
                    isActive ? "bg-[#0d1117] text-orange-400 border-t border-t-orange-500" : "text-gray-500 hover:text-gray-300"
                  }`}>
                  {t}
                </button>
              );
            })}
          </div>

          {/* Postman Interactive Content Workspace */}
          <div className="p-4 flex flex-col gap-4 bg-[#0d1117]">
            <div className="font-mono text-[11px] leading-relaxed text-gray-400 min-h-[110px] flex flex-col justify-start">
              {postmanTab === "params" && (
                <div className="space-y-2.5">
                  <div className="text-[10px] text-gray-500 italic">// {pm.queryParams}</div>
                  {method === "GET" ? (
                    <>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-surface border border-border/50 rounded px-2.5 py-1 text-[10px]">{pm.keyLabel}: <span className="text-yellow-300">limit</span></div>
                        <div className="flex-1 bg-surface border border-border/50 rounded px-2.5 py-1 text-[10px]">{pm.valueLabel}: <span className="text-orange-300">10</span></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-surface border border-border/50 rounded px-2.5 py-1 text-[10px]">{pm.keyLabel}: <span className="text-yellow-300">role</span></div>
                        <div className="flex-1 bg-surface border border-border/50 rounded px-2.5 py-1 text-[10px]">{pm.valueLabel}: <span className="text-orange-300">user</span></div>
                      </div>
                    </>
                  ) : method === "POST" ? (
                    <div className="text-gray-500 italic text-[10px] py-1 whitespace-pre-line">
                      {pm.noQueryParamsPost}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic text-[10px] py-1 whitespace-pre-line">
                      {pm.pathParamId}
                    </div>
                  )}
                </div>
              )}

              {postmanTab === "headers" && (
                <div className="space-y-1.5 text-[10px] text-gray-400">
                  <div className="text-[10px] text-gray-500 italic mb-1">// {pm.requestHeaders}</div>
                  {(method === "POST" || method === "PUT") && (
                    <div><span className="text-gray-500">Content-Type:</span> <span className="text-green-400">application/json</span></div>
                  )}
                  <div><span className="text-gray-500">Accept:</span> <span className="text-green-400">application/json</span></div>
                  <div><span className="text-gray-500">Authorization:</span> <span className="text-green-400">Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span></div>
                  <div><span className="text-gray-500">User-Agent:</span> <span className="text-green-400">PostmanClient/1.0</span></div>
                  <div><span className="text-gray-500">Host:</span> <span className="text-green-400">localhost:3000</span></div>
                </div>
              )}

              {postmanTab === "body" && (
                <div className="flex flex-col flex-1 gap-1 w-full">
                  {method === "GET" || method === "DELETE" ? (
                    <div className="text-gray-500 italic text-[10px] py-1 whitespace-pre-line">
                      {pm.noBodyRequired.replace("{method}", method)}
                    </div>
                  ) : (
                    <>
                      <div className="text-[10px] text-gray-500 italic mb-1">// {pm.requestBodyPayload}</div>
                      <textarea value={body} onChange={e => setBody(e.target.value)} rows={5}
                        className="w-full bg-surface border border-border rounded-lg text-[10px] font-mono p-2 text-gray-300 outline-none resize-none min-h-[90px]" />
                    </>
                  )}
                </div>
              )}
            </div>

            <button onClick={triggerRequest} disabled={phase !== "idle" && phase !== "done"}
              className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 mt-2 shrink-0">
              <Play size={12} />Send Request
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <JSCode lines={serverCode} filename="server.js" />
        </div>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
        <p className="text-sm text-gray-300">{t.httpnativeSubtitle}</p>
      </div>

      {/* Middle: Request Flow Diagram (Left) & Response Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-[#0d1117] p-6 flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-2/40 p-3 rounded-xl border border-border/50">
            {steps.map(s => {
              const isActive = phase === s.id;
              const isPast = (
                (s.id === "request" && phase !== "idle" && phase !== "request") ||
                (s.id === "server" && phase !== "idle" && phase !== "request" && phase !== "server") ||
                (s.id === "db" && phase !== "idle" && phase !== "request" && phase !== "server" && phase !== "db") ||
                (s.id === "response" && phase === "done")
              );
              
              return (
                <div key={s.id} className={`flex flex-col p-2 rounded-lg border transition-all duration-200 ${
                  isActive ? "bg-white/5 border-yellow-500/40" : isPast ? "border-emerald-500/20 bg-emerald-500/5" : "border-transparent opacity-40"
                }`}>
                  <span className={`text-[10px] font-mono font-bold ${isActive ? s.color : isPast ? "text-emerald-400" : "text-gray-500"}`}>
                    {s.label} {isPast && "✓"}
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono mt-0.5">{s.desc}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col justify-center gap-8 relative min-h-[220px] bg-[#161b22]/40 rounded-xl p-6 border border-border/30">
            <div className="flex items-center justify-between relative">
              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                  <Monitor size={22} className="text-orange-400" />
                </div>
                <span className="text-[10px] text-gray-500 font-mono">Client</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                  phase === "server" || phase === "db" ? "bg-blue-500/10 border-blue-500/40" : "bg-surface-2 border-border"
                }`}>
                  <Server size={22} className={phase === "server" || phase === "db" ? "text-blue-400" : "text-gray-500"} />
                </div>
                <span className="text-[10px] text-gray-500 font-mono">Server</span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12">
                <div className="w-full h-0.5 bg-border/40 relative">
                  <AnimatePresence>
                    {phase === "request" && (
                      <motion.div initial={{ left: 0 }} animate={{ left: "100%" }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
                        className={`absolute top-1/2 -translate-y-1/2 w-10 h-5 rounded border ${methodColors[method]} flex items-center justify-center text-[8px] font-mono font-bold shadow-glow`}>
                        {method}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {phase === "response" && (
                      <motion.div initial={{ right: 0 }} animate={{ right: "100%" }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
                        className="absolute top-1/2 -translate-y-1/2 w-10 h-5 rounded border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[7px] font-mono font-bold shadow-glow-accent">
                        {method === "POST" ? "201" : method === "DELETE" ? "204" : "200"}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 relative">
              <div className="absolute top-[-30px] w-0.5 h-8 bg-border/40 left-1/2 -translate-x-1/2">
                <AnimatePresence>
                  {phase === "db" && (
                    <motion.div initial={{ top: 0 }} animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 0.8, repeat: 0 }}
                      className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-glow" />
                  )}
                </AnimatePresence>
              </div>

              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 mt-6 ${
                phase === "db" ? "bg-purple-500/10 border-purple-500/40" : "bg-surface-2 border-border"
              }`}>
                <Database size={22} className={phase === "db" ? "text-purple-400" : "text-gray-500"} />
              </div>
              <span className="text-[10px] text-gray-500 font-mono">Database</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 h-full flex flex-col justify-stretch">
          {response ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col h-full justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 font-mono">Response Headers:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{response.status}</span>
                </div>
                <div className="font-mono text-[10px] text-gray-500">
                  {Object.entries(response.headers).map(([k, v]) => (
                    <div key={k}>{k}: <span className="text-orange-300">{v}</span></div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-mono mb-2">Response Body:</p>
                <pre className="font-mono text-[11px] text-green-400 whitespace-pre bg-[#161b22] p-3 rounded-lg border border-border/40 overflow-x-auto">
                  {response.body}
                </pre>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-border bg-[#0d1117]/30 p-6 flex items-center justify-center h-full text-xs text-gray-600 italic font-mono min-h-[200px]">
              Waiting for request...
            </div>
          )}
        </div>
      </div>
      
      {/* Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {t.httpnativeTips.map((tip, idx) => <InfoCard key={idx} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function BackendPage() {
  const { lang } = useLangStore();
  const t = BACKEND_I18N[lang as "uz" | "en" | "ru"] ?? BACKEND_I18N.en;
  const [activeTab, setActiveTab] = useState<TabId>("basics");

  const activeTabCfg = ALL_TABS.find(tb => tb.id === activeTab)!;

  const renderSection = () => {
    switch (activeTab) {
      case "basics":     return <BasicsSection t={t} />;
      case "fs":         return <FSSection t={t} />;
      case "eventloop":  return <EventLoopSection t={t} />;
      case "httpnative": return <HTTPNativeSection t={t} />;
    }
  };

  const renderHeader = () => {
    let title = "";
    let subtitle = "";
    if (activeTab === "basics") { title = t.basicsTitle; subtitle = t.basicsSubtitle; }
    else if (activeTab === "fs") { title = t.fsTitle; subtitle = t.fsSubtitle; }
    else if (activeTab === "eventloop") { title = t.eventloopTitle; subtitle = t.eventloopSubtitle; }
    else if (activeTab === "httpnative") { title = t.httpnativeTitle; subtitle = t.httpnativeSubtitle; }

    return (
      <div className="mb-6 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${activeTabCfg.border} bg-white/5`}>
            {activeTabCfg.indexStr}
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {activeTabCfg.icon}
            {title}
          </h2>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed pl-8">{subtitle}</p>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(#3b82f6 1px,transparent 1px),linear-gradient(to right,#3b82f6 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/4 rounded-full blur-[100px]" />
      </div>

      <nav className="z-10 border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 shrink-0">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-mono tracking-tight text-white font-black">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Code2 size={14} className="text-white" />
            </div>
            <span>
              Logic<span className="text-primary-light">Lab</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/css"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-150 font-medium">
              <Layers size={13} />
              CSS
            </Link>
            <Link href="/playground"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-150 font-medium">
              <Play size={13} />
              JavaScript
            </Link>
            <Link href="/backend"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white bg-surface-2 border border-border transition-all duration-150 font-medium">
              <Server size={13} />
              Backend
            </Link>
            <Link href="/performance"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-150 font-medium">
              <BarChart3 size={13} />
              Resurs
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-8 border-b border-border/30 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-3">
            <Zap size={11} />
            Backend Visualizer
          </div>
          <h1 className="text-3xl font-black text-white">{t.pageTitle}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.pageSubtitle}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Mobile navigation */}
          <div className="lg:hidden w-full mb-4">
            <label className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider mb-1.5 block">Select Topic</label>
            <div className="relative">
              <select value={activeTab} onChange={e => setActiveTab(e.target.value as TabId)}
                className="w-full bg-[#0d1117] border border-border rounded-xl px-4 py-3 text-xs font-semibold text-gray-300 outline-none appearance-none cursor-pointer">
                <optgroup label="Node.js Core">
                  {ALL_TABS.map(tb => (
                    <option key={tb.id} value={tb.id}>{tb.indexStr}. {t.tabs[tb.id]}</option>
                  ))}
                </optgroup>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <aside className="hidden lg:flex flex-col gap-6 w-64 xl:w-72 shrink-0 sticky top-20">
            <div className="rounded-2xl border border-border bg-[#0d1117]/60 p-4 w-full">
              <p className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-wider mb-3">Node.js Core</p>
              <div className="flex flex-col gap-1">
                {ALL_TABS.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold border transition-all duration-200 ${
                        isActive
                          ? `${tab.color} ${tab.border} bg-white/5 ${tab.glow}`
                          : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-surface-2"
                      }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-gray-600">{tab.indexStr}</span>
                        {tab.icon}
                        <span>{t.tabs[tab.id]}</span>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Active Visualizer Space */}
          <div className="flex-1 min-w-0 w-full">
            {renderHeader()}
            
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
