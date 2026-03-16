"use client";

import { useState, useId, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Code2, Layers, LayoutGrid, Sparkles, ChevronRight, Home } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "flex" | "grid" | "animation";

// ─── Shared UI components ────────────────────────────────────────────────────

const COLOR_MAP = {
  blue:    { btn: "border-blue-500/40 bg-blue-500/15 text-blue-300", active: "border-blue-400 bg-blue-500/30 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.3)]" },
  purple:  { btn: "border-purple-500/40 bg-purple-500/15 text-purple-300", active: "border-purple-400 bg-purple-500/30 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]" },
  emerald: { btn: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300", active: "border-emerald-400 bg-emerald-500/30 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)]" },
  orange:  { btn: "border-orange-500/40 bg-orange-500/15 text-orange-300", active: "border-orange-400 bg-orange-500/30 text-orange-200 shadow-[0_0_10px_rgba(249,115,22,0.3)]" },
  pink:    { btn: "border-pink-500/40 bg-pink-500/15 text-pink-300", active: "border-pink-400 bg-pink-500/30 text-pink-200 shadow-[0_0_10px_rgba(236,72,153,0.3)]" },
  yellow:  { btn: "border-yellow-500/40 bg-yellow-500/15 text-yellow-300", active: "border-yellow-400 bg-yellow-500/30 text-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.3)]" },
};
type ColorKey = keyof typeof COLOR_MAP;

function PropBtn({
  active, color, onClick, children,
}: { active: boolean; color: ColorKey; onClick: () => void; children: React.ReactNode }) {
  const c = COLOR_MAP[color];
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all duration-150 ${active ? c.active : c.btn + " hover:opacity-80"}`}
    >
      {children}
    </button>
  );
}

function CtrlGroup({ title, color, children }: { title: string; color: ColorKey; children: React.ReactNode }) {
  const c = COLOR_MAP[color];
  return (
    <div>
      <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5 ${c.active.split(" ")[2]}`}>
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

// ─── CSS Code Block ───────────────────────────────────────────────────────────

interface CSSLine { type: "selector" | "prop" | "value" | "bracket" | "comment" | "at"; text: string }

function parseCSSLines(raw: string[]): CSSLine[][] {
  return raw.map(line => {
    const t = line.trim();
    if (t.startsWith("/*")) return [{ type: "comment", text: line }];
    if (t.startsWith("@keyframes") || t.startsWith("@")) return [{ type: "at", text: line }];
    if (t === "{" || t === "}" || t.endsWith("{")) {
      const sel = t.replace("{", "").trim();
      if (sel) return [{ type: "selector", text: line.replace("{", "").replace(/\S.*$/, m => m) }, { type: "bracket", text: " {" }];
      return [{ type: "bracket", text: line }];
    }
    const colon = t.indexOf(":");
    if (colon > 0) {
      const prop = t.slice(0, colon);
      const val = t.slice(colon + 1).replace(";", "").trim();
      const indent = line.match(/^(\s*)/)?.[1] ?? "";
      return [
        { type: "bracket", text: indent },
        { type: "prop", text: prop },
        { type: "bracket", text: ": " },
        { type: "value", text: val },
        { type: "bracket", text: ";" },
      ];
    }
    return [{ type: "bracket", text: line }];
  });
}

function CSSCode({ lines }: { lines: string[] }) {
  const parsed = parseCSSLines(lines);
  return (
    <div className="rounded-xl bg-[#0d1117] border border-border overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-surface-2/40">
        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-[10px] text-gray-600 font-mono">style.css</span>
      </div>
      <div className="p-4 font-mono text-sm leading-6 overflow-x-auto">
        {parsed.map((parts, i) => (
          <div key={i} className="whitespace-pre">
            {parts.map((p, j) => {
              const cls =
                p.type === "selector" ? "text-yellow-300" :
                p.type === "at"       ? "text-pink-400" :
                p.type === "prop"     ? "text-blue-400" :
                p.type === "value"    ? "text-orange-300" :
                p.type === "comment"  ? "text-gray-600 italic" :
                "text-gray-500";
              return <span key={j} className={cls}>{p.text}</span>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Info card ────────────────────────────────────────────────────────────────

function InfoCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3 flex gap-3">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-bold text-gray-200 font-mono mb-0.5">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── FLEX SECTION ─────────────────────────────────────────────────────────────

type FD = "row" | "row-reverse" | "column" | "column-reverse";
type JC = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type AI = "flex-start" | "center" | "flex-end" | "stretch";
type FW = "nowrap" | "wrap" | "wrap-reverse";

interface FlexState { dir: FD; jc: JC; ai: AI; fw: FW; gap: number }

const FLEX_EXPLAIN: Record<string, string> = {
  row:             "Elementlar chapdan → o'ngga joylashadi (odatiy tartib)",
  "row-reverse":   "Elementlar o'ngdan ← chapga — teskari tartibda",
  column:          "Elementlar yuqoridan ↓ pastga joylashadi",
  "column-reverse":"Elementlar pastdan ↑ yuqoriga — teskari tartibda",
  "flex-start":    "Elementlar konteyner boshidan joylashadi (chap yoki yuq)",
  center:          "Elementlar o'rtaga — markazga to'planadi",
  "flex-end":      "Elementlar konteyner oxiriga suriladi (o'ng yoki past)",
  "space-between": "Birinchi/oxirgi chegarada, qolganlari teng bo'shliq bilan",
  "space-around":  "Har bir elementning ikki tomonida teng bo'shliq",
  "space-evenly":  "Barcha oraliq bo'shliqlar mutlaqo teng",
  stretch:         "Elementlar ko'ndalang o'qda to'liq cho'ziladi",
  nowrap:          "Elementlar bir qatorga sig'masa ham o'tib ketmaydi, qisqaradi",
  wrap:            "Elementlar sig'masa keyingi qatorga o'tadi",
  "wrap-reverse":  "Elementlar sig'masa yuqoriga — teskari tartibda o'tadi",
};

const BOX_COLORS = [
  { bg: "#3b82f6", label: "A", w: 56, h: 56 },
  { bg: "#a855f7", label: "B", w: 80, h: 72 },
  { bg: "#10b981", label: "C", w: 56, h: 48 },
  { bg: "#f97316", label: "D", w: 96, h: 48 },
  { bg: "#ec4899", label: "E", w: 64, h: 64 },
];

function FlexSection() {
  const [s, setS] = useState<FlexState>({ dir: "row", jc: "flex-start", ai: "flex-start", fw: "nowrap", gap: 8 });
  const [explain, setExplain] = useState("row");

  const set = <K extends keyof FlexState>(k: K, v: FlexState[K], e: string) => { setS(p => ({ ...p, [k]: v })); setExplain(e); };

  const isCol = s.dir === "column" || s.dir === "column-reverse";

  const css = [
    ".container {",
    "  display: flex;",
    `  flex-direction: ${s.dir};`,
    `  justify-content: ${s.jc};`,
    `  align-items: ${s.ai};`,
    `  flex-wrap: ${s.fw};`,
    `  gap: ${s.gap}px;`,
    "}",
  ];

  const containerStyle: CSSProperties = {
    display: "flex", flexDirection: s.dir, justifyContent: s.jc,
    alignItems: s.ai, flexWrap: s.fw, gap: s.gap,
    width: "100%", height: "100%",
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="flex-direction" color="blue">
          {(["row","row-reverse","column","column-reverse"] as FD[]).map(v => (
            <PropBtn key={v} active={s.dir===v} color="blue" onClick={()=>set("dir",v,v)}>
              {v==="row"&&"→ row"}{v==="row-reverse"&&"← row-reverse"}{v==="column"&&"↓ column"}{v==="column-reverse"&&"↑ col-reverse"}
            </PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="justify-content" color="purple">
          {(["flex-start","center","flex-end","space-between","space-around","space-evenly"] as JC[]).map(v => (
            <PropBtn key={v} active={s.jc===v} color="purple" onClick={()=>set("jc",v,v)}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="align-items" color="emerald">
          {(["flex-start","center","flex-end","stretch"] as AI[]).map(v => (
            <PropBtn key={v} active={s.ai===v} color="emerald" onClick={()=>set("ai",v,v)}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="flex-wrap" color="orange">
          {(["nowrap","wrap","wrap-reverse"] as FW[]).map(v => (
            <PropBtn key={v} active={s.fw===v} color="orange" onClick={()=>set("fw",v,v)}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="gap" color="pink">
          {[0,8,16,24,32].map(v => (
            <PropBtn key={v} active={s.gap===v} color="pink" onClick={()=>set("gap",v,`gap ${v}px`)}>{v}px</PropBtn>
          ))}
        </CtrlGroup>

        <CSSCode lines={css} />
      </div>

      {/* Preview + explanation */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Explanation banner */}
        <AnimatePresence mode="wait">
          <motion.div key={explain} initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}
            className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-blue-400 font-bold font-mono">{explain}</code>
              {" — "}
              {FLEX_EXPLAIN[explain] ?? "Qiymatni o'zgartirish uchun chap tomondagi tugmani bosing"}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Live preview */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">.container — live preview</span>
            <span className="ml-auto text-[10px] text-gray-700 font-mono">display: flex</span>
          </div>

          <div className="rounded-xl border-2 border-dashed border-border bg-[#0d1117] overflow-hidden"
               style={{ height: isCol ? 420 : 200 }}>
            <div style={containerStyle} className="p-3 h-full w-full">
              {BOX_COLORS.map((box, i) => (
                <motion.div
                  key={box.label}
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="rounded-xl flex items-center justify-center font-mono font-black text-white text-base select-none border border-white/20"
                  style={{
                    background: box.bg + "cc",
                    minWidth: isCol ? undefined : box.w,
                    minHeight: isCol ? 44 : box.h,
                    width: isCol ? "100%" : box.w,
                    height: s.ai === "stretch" ? undefined : (isCol ? box.h : box.h),
                    flexShrink: s.fw === "nowrap" ? 1 : 0,
                  }}
                >
                  {box.label}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Axis diagram */}
        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Flex o'qlari</p>
          <div className="flex gap-4">
            <div className={`flex-1 rounded-lg p-3 border ${isCol ? "border-purple-500/30 bg-purple-500/5" : "border-blue-500/30 bg-blue-500/5"}`}>
              <p className="text-xs font-bold font-mono mb-1 text-blue-400">justify-content</p>
              <p className="text-xs text-gray-500">
                {isCol ? "↕ vertikal o'q (column holatda)" : "↔ gorizontal o'q (row holatda)"}
              </p>
              <div className={`mt-2 h-1 rounded-full ${isCol ? "w-1 h-16 mx-auto bg-blue-500/40" : "w-full bg-blue-500/40"}`} />
            </div>
            <div className={`flex-1 rounded-lg p-3 border ${isCol ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}>
              <p className="text-xs font-bold font-mono mb-1 text-emerald-400">align-items</p>
              <p className="text-xs text-gray-500">
                {isCol ? "↔ gorizontal o'q (column holatda)" : "↕ vertikal o'q (row holatda)"}
              </p>
              <div className={`mt-2 rounded-full bg-emerald-500/40 ${isCol ? "h-1 w-full" : "w-1 h-10 mx-auto"}`} />
            </div>
          </div>
        </div>

        {/* Quick tips */}
        <div className="grid grid-cols-2 gap-2">
          <InfoCard icon="📦" title="display: flex" desc="Konteynerga qo'llanadi, ichidagi barcha bolalar flex item bo'ladi" />
          <InfoCard icon="↔️" title="Main axis" desc="justify-content asosiy o'q bo'yicha ishlaydi — flex-direction ga teng" />
          <InfoCard icon="↕️" title="Cross axis" desc="align-items ko'ndalang o'q bo'yicha — main axis ga 90° perpendikulyar" />
          <InfoCard icon="🔄" title="flex-wrap: wrap" desc="Kichik ekranlarda elementlar keyingi qatorga o'tsin desangiz" />
        </div>
      </div>
    </div>
  );
}

// ─── GRID SECTION ─────────────────────────────────────────────────────────────

interface GridState { cols: number; rows: number; gap: number; ji: string; ai: string; spanIdx: number | null }

const GRID_EXPLAIN: Record<string, string> = {
  "1col": "1 ta ustun — elementlar vertikal ravishda joylashadi",
  "2col": "2 ta teng kenglikdagi ustun — grid 2 ga bo'linadi",
  "3col": "3 ta teng ustun — har biri flex-1 kabi 1fr kenglikda",
  "4col": "4 ta ustun — kichik elementlar uchun qulay",
  "gap0": "Bo'shliqsiz — elementlar bir-biriga yopishadi",
  "gap8": "8px bo'shliq — kichik, lekin aniq ajratilgan",
  "gap16": "16px bo'shliq — ko'p foydalaniladigan standart bo'shliq",
  "gap24": "24px bo'shliq — keng, nafis ko'rinish",
  "start": "Elementlar katakcha ichida chapga/yuqoriga tortiladi",
  "center": "Elementlar katakcha ichida markazga joylashadi",
  "end": "Elementlar katakcha ichida o'ngga/pastga tortiladi",
  "stretch": "Elementlar katakcha kengligini to'liq egallaydi (odatiy)",
  "span2": "Bu element 2 ta ustunni egallaydi: grid-column: span 2",
  "span3": "Bu element 3 ta ustunni egallaydi: grid-column: span 3",
};

const GRID_COLORS = [
  "#3b82f6","#a855f7","#10b981","#f97316","#ec4899","#eab308","#06b6d4","#f43f5e"
];

function GridSection() {
  const [s, setS] = useState<GridState>({ cols: 3, rows: 0, gap: 16, ji: "stretch", ai: "stretch", spanIdx: null });
  const [explain, setExplain] = useState("3col");

  const upd = <K extends keyof GridState>(k: K, v: GridState[K], e: string) => { setS(p => ({...p,[k]:v})); setExplain(e); };

  const cells = Array.from({ length: 8 }, (_, i) => ({ id: i, label: String(i+1) }));

  const css = [
    ".grid-container {",
    "  display: grid;",
    `  grid-template-columns: repeat(${s.cols}, 1fr);`,
    `  gap: ${s.gap}px;`,
    `  justify-items: ${s.ji};`,
    `  align-items: ${s.ai};`,
    "}",
    "",
    s.spanIdx !== null ? `/* .item-${s.spanIdx! + 1} */` : "/* span: emas */",
    s.spanIdx !== null ? `.item-${s.spanIdx! + 1} {` : "/* hech bir element */",
    s.spanIdx !== null ? "  grid-column: span 2;" : "/* span ishlatilmagan */",
    s.spanIdx !== null ? "}" : "",
  ].filter((l,i,a) => !(l === "" && a[i-1] === ""));

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="grid-template-columns" color="blue">
          {[1,2,3,4].map(v => (
            <PropBtn key={v} active={s.cols===v} color="blue" onClick={()=>upd("cols",v,`${v}col`)}>
              {v} ustun{v===1?" (1fr)":v===2?" (2x)":v===3?" (3x)":" (4x)"}
            </PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="gap" color="purple">
          {[0,8,16,24].map(v => (
            <PropBtn key={v} active={s.gap===v} color="purple" onClick={()=>upd("gap",v,`gap${v}`)}>{v}px</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="justify-items" color="emerald">
          {["start","center","end","stretch"].map(v => (
            <PropBtn key={v} active={s.ji===v} color="emerald" onClick={()=>upd("ji",v,v)}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="align-items" color="orange">
          {["start","center","end","stretch"].map(v => (
            <PropBtn key={v} active={s.ai===v} color="orange" onClick={()=>upd("ai",v,v)}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="grid-column: span 2 (bitta element)" color="pink">
          <PropBtn active={s.spanIdx===null} color="pink" onClick={()=>upd("spanIdx",null,"span-none")}>Yo'q</PropBtn>
          {cells.slice(0,4).map(c => (
            <PropBtn key={c.id} active={s.spanIdx===c.id} color="pink" onClick={()=>upd("spanIdx",c.id,`span2`)}>
              {c.label}-element
            </PropBtn>
          ))}
        </CtrlGroup>

        <CSSCode lines={css} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={explain} initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}
            className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-purple-400 font-bold font-mono">{explain}</code>
              {" — "}
              {GRID_EXPLAIN[explain] ?? "Grid xususiyatini o'zgartirish uchun chapdan tanlang"}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Grid preview */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">.grid-container — live preview</span>
            <span className="ml-auto text-[10px] text-gray-700 font-mono">display: grid</span>
          </div>

          <div className="rounded-xl border-2 border-dashed border-border bg-[#0d1117] p-3 min-h-[200px]">
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${s.cols},1fr)`, gap:s.gap, justifyItems:s.ji, alignItems:s.ai }}>
              {cells.map((cell, i) => (
                <motion.div
                  key={cell.id}
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="rounded-xl flex items-center justify-center font-mono font-black text-white text-base border border-white/15 select-none"
                  style={{
                    background: GRID_COLORS[i % GRID_COLORS.length] + "bb",
                    height: s.ai === "stretch" ? 72 : 56,
                    gridColumn: s.spanIdx === i ? "span 2" : undefined,
                    width: s.ji === "stretch" ? "100%" : s.ji === "center" ? 64 : s.ji === "start" ? 64 : 64,
                  }}
                >
                  {cell.label}
                  {s.spanIdx === i && (
                    <span className="ml-1 text-[10px] bg-white/20 rounded px-1">span 2</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid concepts */}
        <div className="grid grid-cols-2 gap-2">
          <InfoCard icon="🗂️" title="grid-template-columns" desc="Ustunlar sonini va kengligini belgilaydi. repeat(3, 1fr) = 3 ta teng ustun" />
          <InfoCard icon="📐" title="1fr (fraction)" desc="Bo'sh joyni teng bo'laklarga bo'ladi. 2fr katta, 1fr kichik ustun" />
          <InfoCard icon="↔️" title="justify-items" desc="Har bir elementni o'z katakchasi ichida gorizontal tekislaydi" />
          <InfoCard icon="↕️" title="grid-column: span N" desc="Bir element bir necha ustunni egallashi uchun. Karta/banner uchun qulay" />
        </div>
      </div>
    </div>
  );
}

// ─── ANIMATION SECTION ────────────────────────────────────────────────────────

type AnimPreset = "bounce" | "spin" | "fade" | "slide" | "pulse" | "shake" | "flip" | "swing";

interface AnimState { preset: AnimPreset; duration: number; easing: string; delay: number; iterStr: string }

const ANIM_KEYFRAMES: Record<AnimPreset, string[]> = {
  bounce: [
    "@keyframes bounce {",
    "  0%, 100% { transform: translateY(0); }",
    "  50% { transform: translateY(-40px); }",
    "}",
  ],
  spin: [
    "@keyframes spin {",
    "  from { transform: rotate(0deg); }",
    "  to { transform: rotate(360deg); }",
    "}",
  ],
  fade: [
    "@keyframes fade {",
    "  0%, 100% { opacity: 1; }",
    "  50% { opacity: 0; }",
    "}",
  ],
  slide: [
    "@keyframes slide {",
    "  0%   { transform: translateX(-60px); opacity: 0; }",
    "  50%  { transform: translateX(0px);   opacity: 1; }",
    "  100% { transform: translateX(60px);  opacity: 0; }",
    "}",
  ],
  pulse: [
    "@keyframes pulse {",
    "  0%, 100% { transform: scale(1); }",
    "  50% { transform: scale(1.4); }",
    "}",
  ],
  shake: [
    "@keyframes shake {",
    "  0%, 100% { transform: rotate(0deg); }",
    "  20%  { transform: rotate(-12deg); }",
    "  40%  { transform: rotate(12deg); }",
    "  60%  { transform: rotate(-8deg); }",
    "  80%  { transform: rotate(8deg); }",
    "}",
  ],
  flip: [
    "@keyframes flip {",
    "  0%   { transform: perspective(400px) rotateY(0); }",
    "  50%  { transform: perspective(400px) rotateY(180deg); }",
    "  100% { transform: perspective(400px) rotateY(360deg); }",
    "}",
  ],
  swing: [
    "@keyframes swing {",
    "  0%, 100% { transform: translateY(0) rotate(0deg); }",
    "  25%  { transform: translateY(-30px) rotate(-15deg); }",
    "  75%  { transform: translateY(-20px) rotate(15deg); }",
    "}",
  ],
};

const ANIM_EXPLAIN: Record<AnimPreset, string> = {
  bounce: "Yuqoriga ko'tarilib pastga tushadi — translateY bilan",
  spin:   "360° aylanadi — rotate bilan",
  fade:   "Ko'rinib yo'qoladi — opacity bilan",
  slide:  "Chapdan o'ngga siljib o'tadi — translateX bilan",
  pulse:  "Kattayib kichrayadi — scale bilan",
  shake:  "Chayqaladi — rotate bilan",
  flip:   "3D aylanadi — perspective + rotateY bilan",
  swing:  "Arjuza kabi tebranadi — translate + rotate kombinatsiyasi",
};

const EASING_EXPLAIN: Record<string, string> = {
  "linear":      "Tezlik o'zgarishsiz — bir xil sur'atda",
  "ease":        "Sekin boshlaydi, tezlashadi, sekin tugaydi (odatiy)",
  "ease-in":     "Sekin boshlaydi, tez tugaydi",
  "ease-out":    "Tez boshlaydi, sekin tugaydi",
  "ease-in-out": "Sekin boshlaydi va sekin tugaydi",
  "cubic-bezier(0.68,-0.55,0.27,1.55)": "Spring — ortga qaytirib keladi (elastik)",
};

function AnimSection() {
  const [s, setS] = useState<AnimState>({ preset: "bounce", duration: 1, easing: "ease", delay: 0, iterStr: "infinite" });
  const [key, setKey] = useState(0);

  const trigger = () => setKey(k => k+1);
  const upd = (patch: Partial<AnimState>) => { setS(p => ({...p,...patch})); setKey(k => k+1); };

  const animStyle: CSSProperties = {
    animationName: s.preset,
    animationDuration: `${s.duration}s`,
    animationTimingFunction: s.easing,
    animationDelay: `${s.delay}s`,
    animationIterationCount: s.iterStr,
    animationFillMode: "both",
  };

  const cssFull = [
    ".box {",
    `  animation-name: ${s.preset};`,
    `  animation-duration: ${s.duration}s;`,
    `  animation-timing-function: ${s.easing};`,
    `  animation-delay: ${s.delay}s;`,
    `  animation-iteration-count: ${s.iterStr};`,
    "  /* shorthand: */",
    `  /* animation: ${s.preset} ${s.duration}s ${s.easing} ${s.delay}s ${s.iterStr}; */`,
    "}",
    "",
    ...ANIM_KEYFRAMES[s.preset],
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="animation-name (preset tanlang)" color="yellow">
          {(["bounce","spin","fade","slide","pulse","shake","flip","swing"] as AnimPreset[]).map(v => (
            <PropBtn key={v} active={s.preset===v} color="yellow" onClick={()=>upd({preset:v})}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="animation-duration" color="blue">
          {[0.3,0.5,1,2,3].map(v => (
            <PropBtn key={v} active={s.duration===v} color="blue" onClick={()=>upd({duration:v})}>{v}s</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="animation-timing-function" color="purple">
          {["linear","ease","ease-in","ease-out","ease-in-out","cubic-bezier(0.68,-0.55,0.27,1.55)"].map(v => (
            <PropBtn key={v} active={s.easing===v} color="purple" onClick={()=>upd({easing:v})}>
              {v === "cubic-bezier(0.68,-0.55,0.27,1.55)" ? "spring" : v}
            </PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="animation-delay" color="emerald">
          {[0,0.3,0.5,1,2].map(v => (
            <PropBtn key={v} active={s.delay===v} color="emerald" onClick={()=>upd({delay:v})}>{v}s</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="animation-iteration-count" color="orange">
          {["1","2","3","infinite"].map(v => (
            <PropBtn key={v} active={s.iterStr===v} color="orange" onClick={()=>upd({iterStr:v})}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CSSCode lines={cssFull} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Style injection for keyframes */}
        <style>{`
          @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-40px)} }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes fade { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes slide { 0%{transform:translateX(-60px);opacity:0} 50%{transform:translateX(0);opacity:1} 100%{transform:translateX(60px);opacity:0} }
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }
          @keyframes shake { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(-12deg)} 40%{transform:rotate(12deg)} 60%{transform:rotate(-8deg)} 80%{transform:rotate(8deg)} }
          @keyframes flip { 0%{transform:perspective(400px) rotateY(0)} 50%{transform:perspective(400px) rotateY(180deg)} 100%{transform:perspective(400px) rotateY(360deg)} }
          @keyframes swing { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-30px) rotate(-15deg)} 75%{transform:translateY(-20px) rotate(15deg)} }
        `}</style>

        {/* Explanation */}
        <AnimatePresence mode="wait">
          <motion.div key={s.preset+s.easing} initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}
            className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-yellow-400 font-bold font-mono">{s.preset}</code>
              {" — "}{ANIM_EXPLAIN[s.preset]}
              <br/>
              <code className="text-purple-400 text-xs font-mono">{s.easing}</code>
              {" — "}<span className="text-xs text-gray-500">{EASING_EXPLAIN[s.easing]}</span>
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Animation preview */}
        <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">.box — live animation</span>
            <button onClick={trigger}
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-gray-400 hover:text-gray-200 hover:bg-surface-3 transition-colors font-mono">
              ↺ Qayta boshlash
            </button>
          </div>

          {/* Stage */}
          <div className="rounded-xl bg-[#0d1117] border border-border flex items-center justify-center overflow-hidden relative"
               style={{ height: 200 }}>
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-[0.05]"
                 style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* Center cross */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />

            <div key={key} style={animStyle}
                 className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white/20 flex items-center justify-center font-mono font-black text-white text-xl shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              CSS
            </div>
          </div>

          {/* Timing function visual */}
          <div className="rounded-xl bg-surface-2 border border-border p-4">
            <p className="text-xs text-gray-500 mb-3 font-semibold">animation-timing-function — tezlanish grafigi:</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries({
                "linear": "━━━━━━━", "ease": "⟿━━━━╾", "ease-in": "⟿━━━━━",
                "ease-out": "━━━━━╾╾", "ease-in-out": "⟿━━━╾╾",
              }).map(([k, vis]) => (
                <div key={k} className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono ${s.easing===k ? "border-purple-500/50 bg-purple-500/15 text-purple-300" : "border-border bg-background text-gray-600"}`}>
                  <span className="mr-1">{vis}</span>{k}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Concepts */}
        <div className="grid grid-cols-2 gap-2">
          <InfoCard icon="🎬" title="@keyframes" desc="Animatsiyaning har bir kadrini belgilaydi. 0% boshlang'ich, 100% tugash holati" />
          <InfoCard icon="⏱️" title="animation-duration" desc="Animatsiya necha sekundda bir marta aylanishini belgilaydi" />
          <InfoCard icon="🔁" title="iteration-count: infinite" desc="Animatsiya to'xtovsiz takrorlanadi. Oddiy number = necha marta" />
          <InfoCard icon="📈" title="timing-function" desc="Tezlanish egri chizig'i. ease-in-out natija professional ko'rinish beradi" />
        </div>

        {/* Transition vs Animation */}
        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <p className="text-xs font-bold text-gray-300 mb-3">transition va animation farqi:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <p className="text-xs font-bold text-blue-400 font-mono mb-1">transition</p>
              <p className="text-xs text-gray-500 leading-relaxed">Hover yoki state o'zganganda ishlaydi. Faqat A → B orasida.</p>
              <code className="text-[10px] text-gray-600 mt-2 block">transition: color 0.3s ease;</code>
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <p className="text-xs font-bold text-yellow-400 font-mono mb-1">animation</p>
              <p className="text-xs text-gray-500 leading-relaxed">O'zi-o'zicha ishlaydi. @keyframes bilan ko'p kadrli.</p>
              <code className="text-[10px] text-gray-600 mt-2 block">animation: bounce 1s infinite;</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { id: "flex",      label: "Flexbox",    icon: <Layers size={16} />,     desc: "1 o'qli tartib",        color: "blue"    },
  { id: "grid",      label: "Grid",       icon: <LayoutGrid size={16} />, desc: "2 o'qli jadval",        color: "purple"  },
  { id: "animation", label: "Animation",  icon: <Sparkles size={16} />,   desc: "CSS animatsiyalar",     color: "yellow"  },
];

export default function CSSPage() {
  const [tab, setTab] = useState<Tab>("flex");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-13 flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-black text-base text-white font-mono">
              Logic<span className="text-primary-light">JS</span>
            </span>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="font-bold text-sm text-gray-300">CSS Vizualizator</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/playground"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-gray-400 hover:text-gray-200 transition-colors font-mono">
              JS Playground
            </Link>
            <Link href="/"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              <Home size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
          <h1 className="text-2xl font-black text-white mb-1">
            CSS ni ko'rib o'rgan
          </h1>
          <p className="text-sm text-gray-500">
            Tugmalarni bosib — flex, grid va animatsiyalar qanday ishlashini live ko'ring.
            <span className="text-primary-light ml-1">Hech narsa yozmasangiz ham bo'ladi — shunchaki bosing!</span>
          </p>
        </motion.div>
      </div>

      {/* Tab bar */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => {
            const active = tab === t.id;
            const c = COLOR_MAP[t.color as ColorKey];
            return (
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${active ? c.active : "border-border bg-surface-2 text-gray-400 hover:text-gray-200"}`}>
                {t.icon}
                <span>{t.label}</span>
                <span className="text-xs opacity-60 hidden sm:inline">{t.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:0.2}}>
            {tab === "flex"      && <FlexSection />}
            {tab === "grid"      && <GridSection />}
            {tab === "animation" && <AnimSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
