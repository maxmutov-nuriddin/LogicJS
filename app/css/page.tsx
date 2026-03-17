"use client";

import { useState, useId, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Code2, Layers, LayoutGrid, Sparkles, ChevronRight, Square, MapPin, Zap } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLangStore } from "@/app/playground/store";
import { CSS_UI, type CSSTranslations } from "@/lib/i18n/css";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "flex" | "grid" | "animation" | "boxmodel" | "position" | "transition";

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


const BOX_COLORS = [
  { bg: "#3b82f6", label: "A", w: 56, h: 56 },
  { bg: "#a855f7", label: "B", w: 80, h: 72 },
  { bg: "#10b981", label: "C", w: 56, h: 48 },
  { bg: "#f97316", label: "D", w: 96, h: 48 },
  { bg: "#ec4899", label: "E", w: 64, h: 64 },
];

function FlexSection({ t }: { t: CSSTranslations }) {
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
              {t.flexExplain[explain] ?? t.flexFallback}
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
          <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">{t.flexAxesTitle}</p>
          <div className="flex gap-4">
            <div className={`flex-1 rounded-lg p-3 border ${isCol ? "border-purple-500/30 bg-purple-500/5" : "border-blue-500/30 bg-blue-500/5"}`}>
              <p className="text-xs font-bold font-mono mb-1 text-blue-400">justify-content</p>
              <p className="text-xs text-gray-500">
                {isCol ? t.flexAxisJustifyCol : t.flexAxisJustifyRow}
              </p>
              <div className={`mt-2 h-1 rounded-full ${isCol ? "w-1 h-16 mx-auto bg-blue-500/40" : "w-full bg-blue-500/40"}`} />
            </div>
            <div className={`flex-1 rounded-lg p-3 border ${isCol ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}>
              <p className="text-xs font-bold font-mono mb-1 text-emerald-400">align-items</p>
              <p className="text-xs text-gray-500">
                {isCol ? t.flexAxisAlignCol : t.flexAxisAlignRow}
              </p>
              <div className={`mt-2 rounded-full bg-emerald-500/40 ${isCol ? "h-1 w-full" : "w-1 h-10 mx-auto"}`} />
            </div>
          </div>
        </div>

        {/* Quick tips */}
        <div className="grid grid-cols-2 gap-2">
          {t.flexTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── GRID SECTION ─────────────────────────────────────────────────────────────

interface GridState { cols: number; rows: number; gap: number; ji: string; ai: string; spanIdx: number | null }


const GRID_COLORS = [
  "#3b82f6","#a855f7","#10b981","#f97316","#ec4899","#eab308","#06b6d4","#f43f5e"
];

function GridSection({ t }: { t: CSSTranslations }) {
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
              {t.gridExplain[explain] ?? t.gridFallback}
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
          {t.gridTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
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


function AnimSection({ t }: { t: CSSTranslations }) {
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
              {" — "}{t.animExplain[s.preset]}
              <br/>
              <code className="text-purple-400 text-xs font-mono">{s.easing}</code>
              {" — "}<span className="text-xs text-gray-500">{t.easingExplain[s.easing]}</span>
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Animation preview */}
        <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">.box — live animation</span>
            <button onClick={trigger}
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-gray-400 hover:text-gray-200 hover:bg-surface-3 transition-colors font-mono">
              {t.animRestartBtn}
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
            <p className="text-xs text-gray-500 mb-3 font-semibold">{t.animTimingTitle}</p>
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
          {t.animTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>

        {/* Transition vs Animation */}
        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <p className="text-xs font-bold text-gray-300 mb-3">{t.animTransitionDiff}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <p className="text-xs font-bold text-blue-400 font-mono mb-1">transition</p>
              <p className="text-xs text-gray-500 leading-relaxed">{t.transitionDesc}</p>
              <code className="text-[10px] text-gray-600 mt-2 block">transition: color 0.3s ease;</code>
            </div>
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <p className="text-xs font-bold text-yellow-400 font-mono mb-1">animation</p>
              <p className="text-xs text-gray-500 leading-relaxed">{t.animationDesc}</p>
              <code className="text-[10px] text-gray-600 mt-2 block">animation: bounce 1s infinite;</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BOX MODEL SECTION ────────────────────────────────────────────────────────

interface BoxState { padding: number; margin: number; borderW: number; borderRadius: number | string; boxSizing: "content-box" | "border-box" }

function BoxModelSection({ t }: { t: CSSTranslations }) {
  const [s, setS] = useState<BoxState>({ padding: 16, margin: 16, borderW: 2, borderRadius: 8, boxSizing: "content-box" });
  const [explain, setExplain] = useState("content-box");

  const upd = <K extends keyof BoxState>(k: K, v: BoxState[K], e: string) => {
    setS(p => ({ ...p, [k]: v })); setExplain(e);
  };

  const contentW = s.boxSizing === "border-box"
    ? Math.max(40, 120 - s.padding * 2 - s.borderW * 2)
    : 120;
  const totalW = s.boxSizing === "border-box" ? 120 : 120 + s.padding * 2 + s.borderW * 2;

  const css = [
    ".box {",
    `  width: 120px;`,
    `  padding: ${s.padding}px;`,
    `  margin: ${s.margin}px;`,
    `  border: ${s.borderW}px solid #f59e0b;`,
    `  border-radius: ${s.borderRadius}px;`,
    `  box-sizing: ${s.boxSizing};`,
    `  /* total width: ${totalW}px */`,
    "}",
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="box-sizing" color="blue">
          {(["content-box", "border-box"] as const).map(v => (
            <PropBtn key={v} active={s.boxSizing === v} color="blue" onClick={() => upd("boxSizing", v, v)}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="padding" color="emerald">
          {[0, 8, 16, 24, 32].map(v => (
            <PropBtn key={v} active={s.padding === v} color="emerald" onClick={() => upd("padding", v, `padding-${v}`)}>{v}px</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="margin" color="orange">
          {[0, 8, 16, 24, 32].map(v => (
            <PropBtn key={v} active={s.margin === v} color="orange" onClick={() => upd("margin", v, `margin-${v}`)}>{v}px</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="border-width" color="yellow">
          {[0, 1, 2, 4, 8].map(v => (
            <PropBtn key={v} active={s.borderW === v} color="yellow" onClick={() => upd("borderW", v, `border-${v}`)}>{v}px</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="border-radius" color="pink">
          {[0, 4, 8, 16, 999].map(v => (
            <PropBtn key={v} active={s.borderRadius === v} color="pink" onClick={() => upd("borderRadius", v, `radius-${v}`)}>
              {v === 999 ? "50% (⬤)" : `${v}px`}
            </PropBtn>
          ))}
        </CtrlGroup>

        <CSSCode lines={css} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={explain} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-orange-400 font-bold font-mono">{explain}</code>
              {" — "}
              {t.boxExplain[explain] ?? "Xususiyatni o'zgartiring"}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Box model diagram */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">box model — visual diagram</span>
          </div>

          <div className="rounded-xl bg-[#0d1117] border border-border flex items-center justify-center overflow-hidden p-4" style={{ minHeight: 260 }}>
            {/* Margin layer */}
            <div className="relative flex items-center justify-center"
                 style={{ padding: Math.min(s.margin, 40), outline: "2px dashed rgba(249,115,22,0.5)", background: "rgba(249,115,22,0.06)", borderRadius: 4 }}>
              <span className="absolute top-1 left-2 text-[9px] text-orange-400 font-mono font-bold">margin: {s.margin}px</span>

              {/* Border layer */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative flex items-center justify-center"
                style={{
                  border: `${s.borderW}px solid rgba(234,179,8,0.7)`,
                  borderRadius: s.borderRadius === 999 ? "50%" : s.borderRadius,
                  background: "rgba(234,179,8,0.06)",
                  minWidth: 20, minHeight: 20,
                }}>
                {s.borderW > 0 && (
                  <span className="absolute -top-5 left-0 text-[9px] text-yellow-400 font-mono font-bold whitespace-nowrap">
                    border: {s.borderW}px
                  </span>
                )}

                {/* Padding layer */}
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative flex items-center justify-center"
                  style={{
                    padding: Math.min(s.padding, 40),
                    background: "rgba(16,185,129,0.12)",
                    borderRadius: s.borderRadius === 999 ? "50%" : Math.max(0, (s.borderRadius as number) - s.borderW),
                  }}>
                  {s.padding > 0 && (
                    <span className="absolute top-1 right-1 text-[9px] text-emerald-400 font-mono font-bold">padding: {s.padding}px</span>
                  )}

                  {/* Content */}
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex items-center justify-center bg-blue-500/25 border border-blue-500/40 rounded-sm"
                    style={{ width: Math.max(40, contentW), height: 60 }}>
                    <div className="text-center">
                      <span className="text-[10px] text-blue-300 font-mono font-bold block">content</span>
                      <span className="text-[9px] text-gray-500 font-mono">{Math.max(40, contentW)}×60px</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Total size info */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Hisoblangan kenglik</p>
              <p className="font-mono font-bold text-sm text-blue-300">
                {s.boxSizing === "content-box"
                  ? `${120} + ${s.padding * 2} + ${s.borderW * 2} = ${totalW}px`
                  : `${120}px (border-box)`}
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                {s.boxSizing === "content-box" ? "content + padding×2 + border×2" : "width o'z ichiga oladi"}
              </p>
            </div>
            <div className={`rounded-lg border p-3 ${s.boxSizing === "border-box" ? "border-blue-500/30 bg-blue-500/5" : "border-border bg-background"}`}>
              <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">box-sizing</p>
              <p className={`font-mono font-bold text-sm ${s.boxSizing === "border-box" ? "text-blue-400" : "text-gray-400"}`}>{s.boxSizing}</p>
              <p className="text-[10px] text-gray-600 mt-1">
                {s.boxSizing === "border-box" ? "✓ Zamonaviy usul" : "Odatiy, lekin hisoblash qiyin"}
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-2 gap-2">
          {t.boxTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── POSITION SECTION ─────────────────────────────────────────────────────────

type PosType = "static" | "relative" | "absolute" | "fixed";

interface PosState { type: PosType; top: number; left: number; zIndex: number }

const POS_COLORS = ["#3b82f6", "#a855f7", "#10b981"];

function PositionSection({ t }: { t: CSSTranslations }) {
  const [s, setS] = useState<PosState>({ type: "relative", top: 20, left: 20, zIndex: 1 });

  const upd = (patch: Partial<PosState>) => setS(p => ({ ...p, ...patch }));

  const css = [
    ".container {",
    "  position: relative;",
    "  /* positioned parent */",
    "}",
    "",
    ".target-element {",
    `  position: ${s.type};`,
    ...(s.type !== "static" ? [
      `  top: ${s.top}px;`,
      `  left: ${s.left}px;`,
      `  z-index: ${s.zIndex};`,
    ] : []),
    "}",
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="position" color="blue">
          {(["static", "relative", "absolute", "fixed"] as PosType[]).map(v => (
            <PropBtn key={v} active={s.type === v} color="blue" onClick={() => upd({ type: v })}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        {s.type !== "static" && (
          <>
            <CtrlGroup title="top" color="purple">
              {[0, 10, 20, 40, 60].map(v => (
                <PropBtn key={v} active={s.top === v} color="purple" onClick={() => upd({ top: v })}>{v}px</PropBtn>
              ))}
            </CtrlGroup>

            <CtrlGroup title="left" color="emerald">
              {[0, 10, 20, 40, 60].map(v => (
                <PropBtn key={v} active={s.left === v} color="emerald" onClick={() => upd({ left: v })}>{v}px</PropBtn>
              ))}
            </CtrlGroup>

            <CtrlGroup title="z-index" color="orange">
              {[0, 1, 2, 5, 10].map(v => (
                <PropBtn key={v} active={s.zIndex === v} color="orange" onClick={() => upd({ zIndex: v })}>{v}</PropBtn>
              ))}
            </CtrlGroup>
          </>
        )}

        <CSSCode lines={css} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={s.type} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-blue-400 font-bold font-mono">{s.type}</code>
              {" — "}
              {t.posExplain[s.type]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Position preview */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">.container — live preview</span>

          <div className="rounded-xl bg-[#0d1117] border-2 border-dashed border-border overflow-hidden" style={{ height: 280, position: "relative" }}>
            <span className="absolute top-2 left-2 text-[9px] text-gray-700 font-mono">.container (position: relative)</span>

            {/* Background boxes (non-positioned) */}
            <div className="absolute top-8 left-8 w-16 h-16 rounded-xl flex items-center justify-center font-mono font-black text-white text-base border border-white/15"
                 style={{ background: POS_COLORS[0] + "60" }}>1</div>
            <div className="absolute top-8 left-32 w-16 h-16 rounded-xl flex items-center justify-center font-mono font-black text-white text-base border border-white/15"
                 style={{ background: POS_COLORS[2] + "60" }}>3</div>

            {/* Positioned element (target) */}
            <motion.div
              animate={s.type === "static" ? { top: 32, left: 128 } : s.type === "fixed" ? { top: 8, right: 8, left: "auto" } : { top: 32 + s.top, left: 128 + s.left }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute w-16 h-16 rounded-xl flex flex-col items-center justify-center font-mono font-black text-white text-base border-2 border-white/40"
              style={{ background: POS_COLORS[1] + "cc", zIndex: s.zIndex, left: s.type === "fixed" ? "auto" : undefined }}>
              <span>2</span>
              {s.type !== "static" && <span className="text-[8px] font-normal opacity-70">{s.type}</span>}
            </motion.div>

            {/* Ghost showing original position for relative */}
            {s.type === "relative" && (s.top !== 0 || s.left !== 0) && (
              <div className="absolute top-8 left-32 w-16 h-16 rounded-xl border-2 border-dashed border-purple-500/30"
                   style={{ background: "transparent" }}>
                <span className="text-[8px] text-purple-400 font-mono absolute top-1 left-1">asl joy</span>
              </div>
            )}

            {/* Fixed indicator */}
            {s.type === "fixed" && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <span className="text-[10px] text-yellow-400 font-mono bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                  ⚓ viewport ga mahkam (fixed)
                </span>
              </div>
            )}
          </div>

          {/* Position reference table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-surface-2 border-b border-border">
                  <th className="px-3 py-2 text-left text-gray-500 font-medium">position</th>
                  <th className="px-3 py-2 text-left text-gray-500 font-medium">Oqim</th>
                  <th className="px-3 py-2 text-left text-gray-500 font-medium">Nisbat</th>
                  <th className="px-3 py-2 text-left text-gray-500 font-medium">top/left</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["static", "✓ ichida", "—", "❌"],
                  ["relative", "✓ ichida", "o'ziga", "✓"],
                  ["absolute", "❌ chiqadi", "positioned parent", "✓"],
                  ["fixed", "❌ chiqadi", "viewport", "✓"],
                ] as const).map(([type, flow, ref, tl]) => (
                  <tr key={type} className={`border-b border-border/50 ${s.type === type ? "bg-blue-500/10" : ""}`}>
                    <td className={`px-3 py-2 font-bold ${s.type === type ? "text-blue-300" : "text-gray-400"}`}>{type}</td>
                    <td className="px-3 py-2 text-gray-500">{flow}</td>
                    <td className="px-3 py-2 text-gray-500">{ref}</td>
                    <td className="px-3 py-2 text-gray-500">{tl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-2 gap-2">
          {t.posTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── TRANSITION SECTION ───────────────────────────────────────────────────────

type TransProp = "background-color" | "transform" | "opacity" | "all" | "border-radius";

interface TransState { prop: TransProp; duration: number; easing: string; hovered: boolean }

function TransitionSection({ t }: { t: CSSTranslations }) {
  const [s, setS] = useState<TransState>({ prop: "background-color", duration: 0.5, easing: "ease", hovered: false });

  const upd = (patch: Partial<TransState>) => setS(p => ({ ...p, ...patch }));

  const normalStyle: CSSProperties = {
    width: 120, height: 120,
    background: "#3b82f6",
    borderRadius: 12,
    opacity: 1,
    transform: "scale(1)",
    transition: `${s.prop} ${s.duration}s ${s.easing}`,
    cursor: "pointer",
  };

  const hoveredStyle: CSSProperties = {
    ...normalStyle,
    background: s.prop === "background-color" || s.prop === "all" ? "#a855f7" : "#3b82f6",
    borderRadius: s.prop === "border-radius" || s.prop === "all" ? 60 : 12,
    opacity: s.prop === "opacity" || s.prop === "all" ? 0.3 : 1,
    transform: s.prop === "transform" || s.prop === "all" ? "scale(1.3) rotate(10deg)" : "scale(1)",
  };

  const css = [
    ".box {",
    `  background: #3b82f6;`,
    `  border-radius: 12px;`,
    `  transition: ${s.prop} ${s.duration}s ${s.easing};`,
    "}",
    "",
    ".box:hover {",
    ...(s.prop === "background-color" || s.prop === "all" ? [`  background: #a855f7;`] : []),
    ...(s.prop === "transform" || s.prop === "all" ? [`  transform: scale(1.3);`] : []),
    ...(s.prop === "opacity" || s.prop === "all" ? [`  opacity: 0.3;`] : []),
    ...(s.prop === "border-radius" || s.prop === "all" ? [`  border-radius: 60px;`] : []),
    "}",
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="transition-property" color="blue">
          {(["background-color", "transform", "opacity", "border-radius", "all"] as TransProp[]).map(v => (
            <PropBtn key={v} active={s.prop === v} color="blue" onClick={() => upd({ prop: v })}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="transition-duration" color="purple">
          {[0.1, 0.3, 0.5, 1, 2].map(v => (
            <PropBtn key={v} active={s.duration === v} color="purple" onClick={() => upd({ duration: v })}>{v}s</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="transition-timing-function" color="emerald">
          {["linear", "ease", "ease-in", "ease-out", "ease-in-out"].map(v => (
            <PropBtn key={v} active={s.easing === v} color="emerald" onClick={() => upd({ easing: v })}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CSSCode lines={css} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={s.prop} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-blue-400 font-bold font-mono">{s.prop}</code>
              {" — "}
              {t.transExplain[s.prop]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Transition preview */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">.box — transition demo</span>

          {/* Demo stage */}
          <div className="rounded-xl bg-[#0d1117] border border-border flex flex-col items-center justify-center gap-4 py-8">
            {/* The box */}
            <div
              style={s.hovered ? hoveredStyle : normalStyle}
              className="flex items-center justify-center font-mono font-black text-white text-xl select-none"
              onClick={() => upd({ hovered: !s.hovered })}
            >
              CSS
            </div>

            {/* Toggle button */}
            <button
              onClick={() => upd({ hovered: !s.hovered })}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                s.hovered
                  ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
                  : "border-blue-500/40 bg-blue-500/15 text-blue-300"
              }`}
            >
              {s.hovered ? "← Normal holatga qaytish" : "Hover holatini ko'rish →"}
            </button>
          </div>

          {/* Before/after comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-semibold">Normal holat</p>
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">background:</span>
                  <span className="text-blue-400">#3b82f6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">transform:</span>
                  <span className="text-gray-400">scale(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">opacity:</span>
                  <span className="text-gray-400">1</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-purple-500/25 bg-purple-500/5 p-3">
              <p className="text-[10px] text-purple-400 mb-2 uppercase tracking-wider font-semibold">:hover holat</p>
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">background:</span>
                  <span className={s.prop === "background-color" || s.prop === "all" ? "text-purple-400 font-bold" : "text-gray-500"}>#a855f7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">transform:</span>
                  <span className={s.prop === "transform" || s.prop === "all" ? "text-purple-400 font-bold" : "text-gray-500"}>scale(1.3)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">opacity:</span>
                  <span className={s.prop === "opacity" || s.prop === "all" ? "text-purple-400 font-bold" : "text-gray-500"}>0.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-2 gap-2">
          {t.transTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CSSPage() {
  const [tab, setTab] = useState<Tab>("flex");
  const { lang } = useLangStore();
  const t = CSS_UI[lang];

  const TABS = [
    { id: "flex" as Tab,       label: "Flexbox",    icon: <Layers size={16} />,     desc: t.flexDesc,  color: "blue"    },
    { id: "grid" as Tab,       label: "Grid",       icon: <LayoutGrid size={16} />, desc: t.gridDesc,  color: "purple"  },
    { id: "animation" as Tab,  label: "Animation",  icon: <Sparkles size={16} />,   desc: t.animDesc,  color: "yellow"  },
    { id: "boxmodel" as Tab,   label: "Box Model",  icon: <Square size={16} />,     desc: t.boxDesc,   color: "orange"  },
    { id: "position" as Tab,   label: "Position",   icon: <MapPin size={16} />,     desc: t.posDesc,   color: "emerald" },
    { id: "transition" as Tab, label: "Transition", icon: <Zap size={16} />,        desc: t.transDesc, color: "pink"    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-13 flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-black text-base text-white font-mono group-hover:opacity-80 transition-opacity">
              Logic<span className="text-primary-light">Lab</span>
            </span>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="font-bold text-sm text-gray-300">CSS Vizualizator</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/playground"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-gray-400 hover:text-gray-200 transition-colors font-mono">
              JS Playground
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
          <h1 className="text-2xl font-black text-white mb-1">{t.pageTitle}</h1>
          <p className="text-sm text-gray-500">
            {t.pageSubtitle}
            <span className="text-primary-light ml-1">{t.pageHint}</span>
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
            {tab === "flex"       && <FlexSection t={t} />}
            {tab === "grid"       && <GridSection t={t} />}
            {tab === "animation"  && <AnimSection t={t} />}
            {tab === "boxmodel"   && <BoxModelSection t={t} />}
            {tab === "position"   && <PositionSection t={t} />}
            {tab === "transition" && <TransitionSection t={t} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
