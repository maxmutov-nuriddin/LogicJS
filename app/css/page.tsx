"use client";

import { useState, useId, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Code2, Layers, LayoutGrid, Sparkles, ChevronRight, Square, MapPin, Zap, BarChart3, Monitor, MousePointer, Type } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLangStore } from "@/app/playground/store";
import { CSS_UI, type CSSTranslations } from "@/lib/i18n/css";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "flex" | "grid" | "animation" | "boxmodel" | "position" | "transition" | "responsive" | "display" | "boxshadow" | "pseudoclass" | "pseudoelement";

const LOCAL_TEXTS: Record<string, Record<string, string>> = {
  uz: {
    selectedItem: "Tanlangan element",
    delete: "O'chirish",
    addItem: "+ Element qo'shish",
    none: "Yo'q",
    element: "element",
    active: "Faol (12px / 8px)",
    inactive: "Faolsiz (0px)",
    autoContent: "auto",
    flowStart: "oqim boshlanishi",
    flowEnd: "oqim yakuni",
    outer: "tashqi",
    inset: "ichki",
    ustun: "ustun",
    livePreview: "jonli ko'rinish",
    displayPreview: "display ko'rinishi",
    shadowPreview: "soya ko'rinishi",
    el1: "1-element",
    el2: "2-element",
    el3: "3-element",
    colorBlack: "black",
    colorBlue: "blue",
    colorPurple: "purple",
    colorPink: "pink",
    boxLabel: "Box",
    liveDemo: "jonli demo",
    hoverActive: ":hover faol ✓",
    hoverInactive: "sichqonchani olib keling",
    focusPlaceholder: "kiriting (focus uchun)",
    focusHelper: "focus: ",
    activeActive: ":active ✓",
    activeInactive: "bosib turing",
    enabledLabel: ":enabled (faol)",
    disabledLabel: ":disabled",
    notActiveHelp: " (.active — not ga tushmas)",
    beforeBadge1: "Eslatma",
    beforeBadge2: "Muhim",
    beforeBadge3: "Yangilik",
    beforeHelp: "«★» belgisi ::before orqali qo'shilgan — HTMLda yo'q",
    afterBadge1: "Bosh sahifa",
    afterBadge2: "Haqida",
    afterBadge3: "Aloqa",
    afterHelp: "«→» belgisi ::after orqali qo'shilgan — HTMLda yo'q",
    flLetter: "H",
    flText: "ar bir veb-sahifa CSS yordamida chiroyli ko'rinish kasb etishi mumkin. Birinchi harf ajralib tursa, o'qish yanada qiziqroq bo'ladi.",
    flLineFirst: "CSS pseudo-elementlari — sahifani bezashning kuchli usuli.",
    flLineRest: "Qolgan qatorlar odatiy ko'rinishda davom etadi. Birinchi qator boshqacha styled bo'lgan.",
    phPlaceholder: "placeholder matn (binafsha rang)",
    phHelp: "Placeholder matni ::placeholder bilan purple rangda",
    selText: "Bu matnni sichqoncha bilan tanlang — belgilangan qism pushti rang oladi. ::selection CSS bilan boshqariladi.",
    selHelp: "Matnni sichqoncha bilan tanlang va effektni ko'ring",
  },
  en: {
    selectedItem: "Selected item",
    delete: "Delete",
    addItem: "+ Add Element",
    none: "None",
    element: "element",
    active: "Active (12px / 8px)",
    inactive: "Inactive (0px)",
    autoContent: "auto",
    flowStart: "flow start",
    flowEnd: "flow end",
    outer: "outer",
    inset: "inset",
    ustun: "column",
    livePreview: "live preview",
    displayPreview: "display preview",
    shadowPreview: "shadow preview",
    el1: "1-element",
    el2: "2-element",
    el3: "3-element",
    colorBlack: "black",
    colorBlue: "blue",
    colorPurple: "purple",
    colorPink: "pink",
    boxLabel: "Box",
    liveDemo: "live demo",
    hoverActive: ":hover active ✓",
    hoverInactive: "hover over me",
    focusPlaceholder: "type here (for focus)",
    focusHelper: "focus: ",
    activeActive: ":active ✓",
    activeInactive: "click and hold",
    enabledLabel: ":enabled (active)",
    disabledLabel: ":disabled",
    notActiveHelp: " (.active — not matched)",
    beforeBadge1: "Note",
    beforeBadge2: "Important",
    beforeBadge3: "News",
    beforeHelp: "The '★' symbol is added via ::before — not in HTML",
    afterBadge1: "Home",
    afterBadge2: "About",
    afterBadge3: "Contact",
    afterHelp: "The '→' symbol is added via ::after — not in HTML",
    flLetter: "E",
    flText: "very webpage can look beautiful using CSS. Styling the first letter makes reading more engaging.",
    flLineFirst: "CSS pseudo-elements are a powerful way to style web pages.",
    flLineRest: "The remaining lines continue normally. Only the first line is styled.",
    phPlaceholder: "placeholder text (purple)",
    phHelp: "Placeholder text is styled purple with ::placeholder",
    selText: "Select this text with your mouse — the highlighted part will turn pink. ::selection is controlled by CSS.",
    selHelp: "Select the text to see the effect in action",
  },
  ru: {
    selectedItem: "Выбранный элемент",
    delete: "Удалить",
    addItem: "+ Добавить элемент",
    none: "Нет",
    element: "элемент",
    active: "Активно (12px / 8px)",
    inactive: "Неактивно (0px)",
    autoContent: "auto",
    flowStart: "начало потока",
    flowEnd: "конец потока",
    outer: "внешняя",
    inset: "внутренняя",
    ustun: "колонка",
    livePreview: "живой просмотр",
    displayPreview: "предпросмотр display",
    shadowPreview: "предпросмотр тени",
    el1: "1-element",
    el2: "2-element",
    el3: "3-element",
    colorBlack: "black",
    colorBlue: "blue",
    colorPurple: "purple",
    colorPink: "pink",
    boxLabel: "Box",
    liveDemo: "живое демо",
    hoverActive: ":hover активен ✓",
    hoverInactive: "наведите мышь",
    focusPlaceholder: "введите текст (для фокуса)",
    focusHelper: "focus: ",
    activeActive: ":active ✓",
    activeInactive: "нажмите и удерживайте",
    enabledLabel: ":enabled (активна)",
    disabledLabel: ":disabled",
    notActiveHelp: " (.active — не совпадает с not)",
    beforeBadge1: "Заметка",
    beforeBadge2: "Важно",
    beforeBadge3: "Новость",
    beforeHelp: "Символ '★' добавлен через ::before — отсутствует в HTML",
    afterBadge1: "Главная",
    afterBadge2: "О нас",
    afterBadge3: "Контакты",
    afterHelp: "Символ '→' добавлен через ::after — отсутствует в HTML",
    flLetter: "К",
    flText: "аждая веб-страница может выглядеть красиво с помощью CSS. Выделение первой буквы делает чтение более интересным.",
    flLineFirst: "CSS псевдоэлементы — это мощный способ стилизации страниц.",
    flLineRest: "Остальные строки отображаются как обычно. Первая строка выделена стилем.",
    phPlaceholder: "текст плейсхолдера (фиолетовый)",
    phHelp: "Текст плейсхолдера стилизован фиолетовым цветом через ::placeholder",
    selText: "Выделите этот текст мышкой — выделенная часть станет розовой. ::selection управляется через CSS.",
    selHelp: "Выделите текст, чтобы увидеть эффект в действии",
  }
};

// ─── Shared UI components ────────────────────────────────────────────────────

const COLOR_MAP = {
  blue:    { btn: "border-blue-500/40 bg-blue-500/15 text-blue-300", active: "border-blue-400 bg-blue-500/30 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.3)]" },
  purple:  { btn: "border-purple-500/40 bg-purple-500/15 text-purple-300", active: "border-purple-400 bg-purple-500/30 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]" },
  emerald: { btn: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300", active: "border-emerald-400 bg-emerald-500/30 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)]" },
  orange:  { btn: "border-orange-500/40 bg-orange-500/15 text-orange-300", active: "border-orange-400 bg-orange-500/30 text-orange-200 shadow-[0_0_10px_rgba(249,115,22,0.3)]" },
  pink:    { btn: "border-pink-500/40 bg-pink-500/15 text-pink-300", active: "border-pink-400 bg-pink-500/30 text-pink-200 shadow-[0_0_10px_rgba(236,72,153,0.3)]" },
  yellow:  { btn: "border-yellow-500/40 bg-yellow-500/15 text-yellow-300", active: "border-yellow-400 bg-yellow-500/30 text-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.3)]" },
  cyan:    { btn: "border-cyan-500/40 bg-cyan-500/15 text-cyan-300", active: "border-cyan-400 bg-cyan-500/30 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]" },
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
      if (t === "}") return [{ type: "bracket", text: line }];
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

function tokenizeHTML(line: string) {
  const regex = /(<\/?[a-zA-Z0-9:-]+)|(\s+[a-zA-Z0-9:-]+(?==))|("[^"]*")|(\/?>)|([^<>\s]+)/g;
  const tokens: { text: string; cls: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      tokens.push({ text: line.substring(lastIndex, matchIndex), cls: "text-gray-500" });
    }

    const [full, tag, attr, val, close] = match;
    if (tag) {
      tokens.push({ text: tag, cls: "text-blue-400 font-semibold" });
    } else if (attr) {
      tokens.push({ text: attr, cls: "text-yellow-300" });
    } else if (val) {
      tokens.push({ text: val, cls: "text-orange-300" });
    } else if (close) {
      tokens.push({ text: close, cls: "text-blue-400 font-semibold" });
    } else {
      tokens.push({ text: full, cls: "text-gray-300" });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.substring(lastIndex), cls: "text-gray-300" });
  }

  return tokens;
}

function HTMLCode({ code }: { code: string[] }) {
  return (
    <div className="rounded-xl bg-[#0d1117] border border-border overflow-hidden mt-3">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-surface-2/40">
        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-[10px] text-gray-600 font-mono">index.html</span>
      </div>
      <div className="p-4 font-mono text-[13px] leading-5 overflow-x-auto text-gray-400">
        {code.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {tokenizeHTML(line).map((tok, j) => (
              <span key={j} className={tok.cls}>{tok.text}</span>
            ))}
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


interface FlexItem {
  id: string;
  label: string;
  bg: string;
  w: number;
  h: number;
  flexGrow: number;
  flexShrink: number;
  alignSelf: "auto" | "flex-start" | "center" | "flex-end" | "stretch";
}

function FlexSection({ t, lang }: { t: CSSTranslations; lang: string }) {
  const lt = LOCAL_TEXTS[lang] || LOCAL_TEXTS.uz;
  const [s, setS] = useState<FlexState>({ dir: "row", jc: "flex-start", ai: "flex-start", fw: "nowrap", gap: 8 });
  const [explain, setExplain] = useState("row");
  const [items, setItems] = useState<FlexItem[]>([
    { id: "1", label: "A", bg: "#3b82f6", w: 56, h: 56, flexGrow: 0, flexShrink: 1, alignSelf: "auto" },
    { id: "2", label: "B", bg: "#a855f7", w: 80, h: 72, flexGrow: 0, flexShrink: 1, alignSelf: "auto" },
    { id: "3", label: "C", bg: "#10b981", w: 56, h: 48, flexGrow: 0, flexShrink: 1, alignSelf: "auto" },
    { id: "4", label: "D", bg: "#f97316", w: 96, h: 48, flexGrow: 0, flexShrink: 1, alignSelf: "auto" },
    { id: "5", label: "E", bg: "#ec4899", w: 64, h: 64, flexGrow: 0, flexShrink: 1, alignSelf: "auto" },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addItem = () => {
    const nextLabel = String.fromCharCode(65 + (items.length % 26));
    const colors = ["#3b82f6", "#a855f7", "#10b981", "#f97316", "#ec4899", "#eab308", "#06b6d4", "#f43f5e"];
    const nextColor = colors[items.length % colors.length];
    const newId = Math.random().toString(36).substr(2, 9);
    const w = 56 + (items.length % 4) * 8;
    const h = 56 + (items.length % 3) * 8;
    setItems([...items, { id: newId, label: nextLabel, bg: nextColor, w, h, flexGrow: 0, flexShrink: 1, alignSelf: "auto" }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateItem = (id: string, patch: Partial<FlexItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  const selectedItem = items.find(item => item.id === selectedId);

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

  items.forEach(item => {
    const hasGrow = item.flexGrow !== 0;
    const hasShrink = item.flexShrink !== 1;
    const hasAlign = item.alignSelf !== "auto";
    
    if (hasGrow || hasShrink || hasAlign) {
      css.push("");
      css.push(`.item-${item.label} {`);
      if (hasGrow) css.push(`  flex-grow: ${item.flexGrow};`);
      if (hasShrink) css.push(`  flex-shrink: ${item.flexShrink};`);
      if (hasAlign) css.push(`  align-self: ${item.alignSelf};`);
      css.push("}");
    }
  });

  const htmlCode = [
    '<div class="container">',
    ...items.map(item => `  <div class="item-${item.label}">${item.label}</div>`),
    '</div>'
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

        {selectedItem && (
          <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                {lt.selectedItem}: {selectedItem.label}
              </span>
              <button
                onClick={() => removeItem(selectedItem.id)}
                className="text-[10px] px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold font-mono transition-colors"
              >
                {lt.delete}
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-[9px] font-mono text-gray-500 mb-1">flex-grow</p>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map(v => (
                    <PropBtn key={v} active={selectedItem.flexGrow === v} color="blue" onClick={() => updateItem(selectedItem.id, { flexGrow: v })}>
                      {v}
                    </PropBtn>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[9px] font-mono text-gray-500 mb-1">flex-shrink</p>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(v => (
                    <PropBtn key={v} active={selectedItem.flexShrink === v} color="blue" onClick={() => updateItem(selectedItem.id, { flexShrink: v })}>
                      {v}
                    </PropBtn>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[9px] font-mono text-gray-500 mb-1">align-self</p>
                <div className="flex flex-wrap gap-1.5">
                  {(["auto", "flex-start", "center", "flex-end", "stretch"] as const).map(v => (
                    <PropBtn key={v} active={selectedItem.alignSelf === v} color="blue" onClick={() => updateItem(selectedItem.id, { alignSelf: v })}>
                      {v}
                    </PropBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <CSSCode lines={css} />
        <HTMLCode code={htmlCode} />
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
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">.container — {lt.livePreview}</span>
            <button
              onClick={addItem}
              className="text-[10px] px-2.5 py-1 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 transition-colors font-mono ml-2 font-semibold"
            >
              {lt.addItem}
            </button>
            <span className="ml-auto text-[10px] text-gray-700 font-mono">display: flex</span>
          </div>

          <div className="rounded-xl border-2 border-dashed border-border bg-[#0d1117] overflow-hidden"
               style={{ height: isCol ? 420 : 200 }}>
            <div style={containerStyle} className="p-3 h-full w-full">
              {items.map((box, i) => (
                <motion.div
                  key={box.id}
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className={`rounded-xl flex items-center justify-center font-mono font-black text-white text-base select-none border relative group cursor-pointer ${
                    selectedId === box.id ? "border-blue-400 ring-2 ring-blue-400/50" : "border-white/20"
                  }`}
                  style={{
                    background: box.bg + "cc",
                    minWidth: isCol ? undefined : box.w,
                    minHeight: isCol ? 44 : box.h,
                    width: isCol ? "100%" : box.w,
                    height: s.ai === "stretch" ? undefined : (isCol ? box.h : box.h),
                    flexGrow: box.flexGrow,
                    flexShrink: s.fw === "nowrap" ? box.flexShrink : 0,
                    alignSelf: box.alignSelf === "auto" ? undefined : box.alignSelf,
                  }}
                  onClick={() => setSelectedId(box.id === selectedId ? null : box.id)}
                >
                  {box.label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(box.id);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] flex items-center justify-center cursor-pointer text-white font-bold opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-md"
                  >
                    ×
                  </button>
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

interface GridState { cols: number; rows: number; gap: number; ji: string; ai: string; spanIdx: number | null }

const GRID_COLORS = [
  "#3b82f6","#a855f7","#10b981","#f97316","#ec4899","#eab308","#06b6d4","#f43f5e"
];

interface GridItem {
  id: string;
  label: string;
  bg: string;
  gridColumn: string;
  gridRow: string;
  justifySelf: "auto" | "start" | "center" | "end" | "stretch";
  alignSelf: "auto" | "start" | "center" | "end" | "stretch";
}

function GridSection({ t, lang }: { t: CSSTranslations; lang: string }) {
  const lt = LOCAL_TEXTS[lang] || LOCAL_TEXTS.uz;
  const [s, setS] = useState<GridState>({ cols: 3, rows: 0, gap: 16, ji: "stretch", ai: "stretch", spanIdx: null });
  const [explain, setExplain] = useState("3col");
  const [items, setItems] = useState<GridItem[]>([
    { id: "1", label: "1", bg: GRID_COLORS[0], gridColumn: "auto", gridRow: "auto", justifySelf: "stretch", alignSelf: "stretch" },
    { id: "2", label: "2", bg: GRID_COLORS[1], gridColumn: "auto", gridRow: "auto", justifySelf: "stretch", alignSelf: "stretch" },
    { id: "3", label: "3", bg: GRID_COLORS[2], gridColumn: "auto", gridRow: "auto", justifySelf: "stretch", alignSelf: "stretch" },
    { id: "4", label: "4", bg: GRID_COLORS[3], gridColumn: "auto", gridRow: "auto", justifySelf: "stretch", alignSelf: "stretch" },
    { id: "5", label: "5", bg: GRID_COLORS[4], gridColumn: "auto", gridRow: "auto", justifySelf: "stretch", alignSelf: "stretch" },
    { id: "6", label: "6", bg: GRID_COLORS[5], gridColumn: "auto", gridRow: "auto", justifySelf: "stretch", alignSelf: "stretch" },
    { id: "7", label: "7", bg: GRID_COLORS[6], gridColumn: "auto", gridRow: "auto", justifySelf: "stretch", alignSelf: "stretch" },
    { id: "8", label: "8", bg: GRID_COLORS[7], gridColumn: "auto", gridRow: "auto", justifySelf: "stretch", alignSelf: "stretch" },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addItem = () => {
    const nextNum = items.length > 0 ? Math.max(...items.map(item => parseInt(item.label) || 0)) + 1 : 1;
    const nextColor = GRID_COLORS[items.length % GRID_COLORS.length];
    const newId = Math.random().toString(36).substr(2, 9);
    setItems([...items, { id: newId, label: String(nextNum), bg: nextColor, gridColumn: "auto", gridRow: "auto", justifySelf: "stretch", alignSelf: "stretch" }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateItem = (id: string, patch: Partial<GridItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  const selectedItem = items.find(item => item.id === selectedId);

  const upd = <K extends keyof GridState>(k: K, v: GridState[K], e: string) => { setS(p => ({...p,[k]:v})); setExplain(e); };

  const css = [
    ".grid-container {",
    "  display: grid;",
    `  grid-template-columns: repeat(${s.cols}, 1fr);`,
    `  gap: ${s.gap}px;`,
    `  justify-items: ${s.ji};`,
    `  align-items: ${s.ai};`,
    "}",
  ];

  if (s.spanIdx !== null) {
    css.push("");
    css.push(`.item-${s.spanIdx + 1} {`);
    css.push("  grid-column: span 2;");
    css.push("}");
  }

  items.forEach(item => {
    const hasCol = item.gridColumn !== "auto";
    const hasRow = item.gridRow !== "auto";
    const hasJustify = item.justifySelf !== "stretch" && item.justifySelf !== "auto";
    const hasAlign = item.alignSelf !== "stretch" && item.alignSelf !== "auto";
    
    if (hasCol || hasRow || hasJustify || hasAlign) {
      css.push("");
      css.push(`.item-${item.label} {`);
      if (hasCol) css.push(`  grid-column: ${item.gridColumn};`);
      if (hasRow) css.push(`  grid-row: ${item.gridRow};`);
      if (hasJustify) css.push(`  justify-self: ${item.justifySelf};`);
      if (hasAlign) css.push(`  align-self: ${item.alignSelf};`);
      css.push("}");
    }
  });

  const htmlCode = [
    '<div class="grid-container">',
    ...items.map(item => `  <div class="item-${item.label}">${item.label}</div>`),
    '</div>'
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="grid-template-columns" color="blue">
          {[1,2,3,4].map(v => (
            <PropBtn key={v} active={s.cols===v} color="blue" onClick={()=>upd("cols",v,`${v}col`)}>
              {v} {lt.ustun}{v===1?" (1fr)":v===2?" (2x)":v===3?" (3x)":" (4x)"}
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
          <PropBtn active={s.spanIdx===null} color="pink" onClick={()=>upd("spanIdx",null,"span-none")}>{lt.none}</PropBtn>
          {items.slice(0,4).map((c, i) => (
            <PropBtn key={c.id} active={s.spanIdx===i} color="pink" onClick={()=>upd("spanIdx",i,`span2`)}>
              {c.label}-element
            </PropBtn>
          ))}
        </CtrlGroup>

        {selectedItem && (
          <div className="border border-purple-500/30 bg-purple-500/5 rounded-xl p-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                {lt.selectedItem}: {selectedItem.label}
              </span>
              <button
                onClick={() => removeItem(selectedItem.id)}
                className="text-[10px] px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold font-mono transition-colors"
              >
                {lt.delete}
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-[9px] font-mono text-gray-500 mb-1">grid-column</p>
                <div className="flex flex-wrap gap-1.5">
                  {["auto", "span 2", "span 3", "1 / 3", "2 / 4"].map(v => (
                    <PropBtn key={v} active={selectedItem.gridColumn === v} color="purple" onClick={() => updateItem(selectedItem.id, { gridColumn: v })}>
                      {v}
                    </PropBtn>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[9px] font-mono text-gray-500 mb-1">grid-row</p>
                <div className="flex flex-wrap gap-1.5">
                  {["auto", "span 2", "span 3", "1 / 3", "2 / 4"].map(v => (
                    <PropBtn key={v} active={selectedItem.gridRow === v} color="purple" onClick={() => updateItem(selectedItem.id, { gridRow: v })}>
                      {v}
                    </PropBtn>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[9px] font-mono text-gray-500 mb-1">justify-self</p>
                <div className="flex flex-wrap gap-1.5">
                  {(["auto", "start", "center", "end", "stretch"] as const).map(v => (
                    <PropBtn key={v} active={selectedItem.justifySelf === v} color="purple" onClick={() => updateItem(selectedItem.id, { justifySelf: v })}>
                      {v}
                    </PropBtn>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[9px] font-mono text-gray-500 mb-1">align-self</p>
                <div className="flex flex-wrap gap-1.5">
                  {(["auto", "start", "center", "end", "stretch"] as const).map(v => (
                    <PropBtn key={v} active={selectedItem.alignSelf === v} color="purple" onClick={() => updateItem(selectedItem.id, { alignSelf: v })}>
                      {v}
                    </PropBtn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <CSSCode lines={css} />
        <HTMLCode code={htmlCode} />
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
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">.grid-container — {lt.livePreview}</span>
            <button
              onClick={addItem}
              className="text-[10px] px-2.5 py-1 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-colors font-mono ml-2 font-semibold"
            >
              {lt.addItem}
            </button>
            <span className="ml-auto text-[10px] text-gray-700 font-mono">display: grid</span>
          </div>

          <div className="rounded-xl border-2 border-dashed border-border bg-[#0d1117] p-3 min-h-[200px]">
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${s.cols},1fr)`, gap:s.gap, justifyItems:s.ji, alignItems:s.ai }}>
              {items.map((cell, i) => {
                const isGlobalSpan = s.spanIdx === i;
                const gridColumn = cell.gridColumn !== "auto" 
                  ? cell.gridColumn 
                  : (isGlobalSpan ? "span 2" : undefined);
                const gridRow = cell.gridRow !== "auto" ? cell.gridRow : undefined;
                const justifySelf = cell.justifySelf !== "auto" ? cell.justifySelf : undefined;
                const alignSelf = cell.alignSelf !== "auto" ? cell.alignSelf : undefined;

                return (
                  <motion.div
                    key={cell.id}
                    layout
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className={`rounded-xl flex flex-col items-center justify-center font-mono font-black text-white text-base border relative group cursor-pointer ${
                      selectedId === cell.id ? "border-purple-400 ring-2 ring-purple-400/50" : "border-white/15"
                    }`}
                    style={{
                      background: cell.bg + "bb",
                      height: s.ai === "stretch" && alignSelf !== "start" && alignSelf !== "center" && alignSelf !== "end" ? 72 : 56,
                      gridColumn,
                      gridRow,
                      justifySelf,
                      alignSelf,
                      width: s.ji === "stretch" && justifySelf !== "start" && justifySelf !== "center" && justifySelf !== "end" ? "100%" : 64,
                    }}
                    onClick={() => setSelectedId(cell.id === selectedId ? null : cell.id)}
                  >
                    <span>{cell.label}</span>
                    {isGlobalSpan && cell.gridColumn === "auto" && (
                      <span className="text-[8px] bg-white/20 rounded px-1 mt-0.5">span 2 (global)</span>
                    )}
                    {cell.gridColumn !== "auto" && (
                      <span className="text-[8px] bg-white/20 rounded px-1 mt-0.5">{cell.gridColumn}</span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(cell.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[10px] flex items-center justify-center cursor-pointer text-white font-bold opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-md"
                    >
                      ×
                    </button>
                  </motion.div>
                );
              })}
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
  const htmlCode = ['<div class="box"></div>'];

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
        <HTMLCode code={htmlCode} />
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
  const htmlCode = [
    '<div class="box">',
    '  Content',
    '</div>'
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
        <HTMLCode code={htmlCode} />
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

  const htmlCode = [
    '<div class="parent">',
    '  <div class="box">Box</div>',
    '</div>'
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
        <HTMLCode code={htmlCode} />
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

  const htmlCode = ['<div class="box">Hover Me</div>'];

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
        <HTMLCode code={htmlCode} />
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

// ─── RESPONSIVE SECTION ──────────────────────────────────────────────────────

type WidthPreset = 320 | 480 | 640 | 768 | 1024 | 1280;
type QueryType = "min-width" | "max-width";

interface ResponsiveState { width: WidthPreset; queryType: QueryType }

const BP_TIERS = [
  { key: "xs", minW: 0,    hex: "#3b82f6", label: "Mobile",    range: "<640px" },
  { key: "sm", minW: 640,  hex: "#a855f7", label: "S.Tablet",  range: "640-768px" },
  { key: "md", minW: 768,  hex: "#10b981", label: "Tablet",    range: "768-1024px" },
  { key: "lg", minW: 1024, hex: "#f97316", label: "Desktop",   range: "1024-1280px" },
  { key: "xl", minW: 1280, hex: "#ec4899", label: "L.Desktop", range: "≥1280px" },
];

const RESP_CARDS = ["#3b82f6","#a855f7","#10b981","#f97316","#ec4899","#eab308"];

function ResponsiveSection({ t }: { t: CSSTranslations }) {
  const [s, setS] = useState<ResponsiveState>({ width: 320, queryType: "min-width" });

  const tier = s.width >= 1280 ? "xl" : s.width >= 1024 ? "lg" : s.width >= 768 ? "md" : s.width >= 640 ? "sm" : "xs";
  const cols         = tier === "lg" || tier === "xl" ? 3 : tier === "md" || tier === "sm" ? 2 : 1;
  const showSidebar  = tier === "lg" || tier === "xl";
  const showNavLinks = tier !== "xs";
  const showMoreNav  = tier === "md" || tier === "lg" || tier === "xl";
  const showNavBtn   = tier === "lg" || tier === "xl";
  const activeBp     = BP_TIERS.find(b => b.key === tier)!;

  const cssMin = [
    "/* ✅ Mobile-first (tavsiya) */",
    ".container {",
    "  display: grid;",
    "  grid-template-columns: 1fr;",
    "}",
    "",
    "@media (min-width: 640px) {",
    "  .container {",
    "    grid-template-columns: repeat(2, 1fr);",
    "  }",
    "}",
    "",
    "@media (min-width: 1024px) {",
    "  .container {",
    "    grid-template-columns: repeat(3, 1fr);",
    "  }",
    "}",
  ];

  const cssMax = [
    "/* Desktop-first */",
    ".container {",
    "  display: grid;",
    "  grid-template-columns: repeat(3, 1fr);",
    "}",
    "",
    "@media (max-width: 1023px) {",
    "  .container {",
    "    grid-template-columns: repeat(2, 1fr);",
    "  }",
    "}",
    "",
    "@media (max-width: 639px) {",
    "  .container {",
    "    grid-template-columns: 1fr;",
    "  }",
    "}",
  ];
  const htmlCode = [
    '<div class="container">',
    '  <header class="header">Header</header>',
    '  <div class="main">Main Content</div>',
    '  <aside class="sidebar">Sidebar</aside>',
    '</div>'
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="simulated kenglik" color="cyan">
          {([
            { w: 320,  vt: "xs", device: "iPhone SE"       },
            { w: 480,  vt: "xs", device: "o'rta telefon"   },
            { w: 640,  vt: "sm", device: "katta telefon"   },
            { w: 768,  vt: "md", device: "iPad / planshet" },
            { w: 1024, vt: "lg", device: "noutbuk"         },
            { w: 1280, vt: "xl", device: "desktop monitor" },
          ] as { w: WidthPreset; vt: string; device: string }[]).map(({ w, vt, device }) => (
            <PropBtn key={w} active={s.width === w} color="cyan" onClick={() => setS(p => ({ ...p, width: w }))}>
              {w}px · {device} <span className="opacity-50">({vt})</span>
            </PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="media query yondashuvi" color="purple">
          {(["min-width", "max-width"] as QueryType[]).map(v => (
            <PropBtn key={v} active={s.queryType === v} color="purple" onClick={() => setS(p => ({ ...p, queryType: v }))}>
              {v}{v === "min-width" ? " ✓" : ""}
            </PropBtn>
          ))}
        </CtrlGroup>

        <CSSCode lines={s.queryType === "min-width" ? cssMin : cssMax} />
        <HTMLCode code={htmlCode} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Explanation banner */}
        <AnimatePresence mode="wait">
          <motion.div key={tier}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-cyan-400 font-bold font-mono">{tier} — {s.width}px</code>
              {" — "}{t.responsiveExplain[tier]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Breakpoint ruler */}
        <div className="rounded-xl border border-border bg-surface-2 p-4">
          <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">Breakpoint chizig'i</p>
          <div className="flex rounded-lg overflow-hidden h-5 mb-1">
            {[
              { key: "xs", w: "20%", hex: "#3b82f6" },
              { key: "sm", w: "8%",  hex: "#a855f7" },
              { key: "md", w: "17%", hex: "#10b981" },
              { key: "lg", w: "17%", hex: "#f97316" },
              { key: "xl", w: "38%", hex: "#ec4899" },
            ].map(seg => (
              <div key={seg.key} className="relative flex items-center justify-center"
                   style={{ width: seg.w, background: seg.hex + (tier === seg.key ? "cc" : "33"), transition: "background 0.2s" }}>
                <span className="text-[8px] font-mono font-bold text-white/80">{seg.key}</span>
              </div>
            ))}
          </div>
          <div className="flex text-[9px] font-mono text-gray-600 mb-3">
            <span style={{ width: "20%" }}>0</span>
            <span style={{ width: "8%" }}>640</span>
            <span style={{ width: "17%" }}>768</span>
            <span style={{ width: "17%" }}>1024</span>
            <span style={{ width: "38%" }}>1280+</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BP_TIERS.map(bp => (
              <div key={bp.key}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
                  tier === bp.key ? "border-white/30 bg-white/10 text-white" : "border-border bg-background text-gray-600"
                }`}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: bp.hex }} />
                <span className="font-bold">{bp.key}</span>
                <span className="opacity-50 text-[9px]">{bp.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simulated browser */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">simulated browser — {s.width}px</span>
            <span className="ml-auto text-[10px] font-mono font-bold" style={{ color: activeBp.hex }}>
              {tier.toUpperCase()} — {activeBp.label}
            </span>
          </div>

          <div className="rounded-xl bg-[#0d1117] border border-border overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-2/80 border-b border-border">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 mx-2 h-4 rounded-full bg-surface/80 border border-border flex items-center px-2">
                <span className="text-[9px] text-gray-600 font-mono">logiclab.uz</span>
              </div>
              <span className="text-[9px] font-mono font-bold" style={{ color: activeBp.hex }}>{s.width}px</span>
            </div>

            {/* Simulated page */}
            <div className="p-3 space-y-2">
              {/* Navbar */}
              <motion.div layout className="flex items-center gap-2 px-2.5 py-1.5 bg-surface border border-border rounded-lg min-h-[28px]">
                <div className="w-3 h-3 rounded-sm bg-blue-500/60 shrink-0" />
                <span className="text-[9px] font-mono font-bold text-gray-300 shrink-0">Logo</span>
                <div className="ml-auto flex items-center gap-1">
                  <AnimatePresence>
                    {showNavLinks && (
                      <motion.div key="base-links" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                        className="flex items-center gap-1 overflow-hidden">
                        <span className="text-[8px] text-gray-500 font-mono px-1 py-0.5 rounded bg-surface-2 whitespace-nowrap">Home</span>
                        <span className="text-[8px] text-gray-500 font-mono px-1 py-0.5 rounded bg-surface-2 whitespace-nowrap">About</span>
                      </motion.div>
                    )}
                    {showMoreNav && (
                      <motion.div key="more-links" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                        className="flex items-center gap-1 overflow-hidden">
                        <span className="text-[8px] text-gray-500 font-mono px-1 py-0.5 rounded bg-surface-2 whitespace-nowrap">Services</span>
                        <span className="text-[8px] text-gray-500 font-mono px-1 py-0.5 rounded bg-surface-2 whitespace-nowrap">Blog</span>
                      </motion.div>
                    )}
                    {showNavBtn && (
                      <motion.span key="cta-btn" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        className="text-[8px] text-cyan-300 font-mono px-1.5 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 whitespace-nowrap">
                        Sign Up
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!showNavLinks && (
                    <div className="flex flex-col gap-0.5">
                      <div className="w-3 h-0.5 bg-gray-400 rounded" />
                      <div className="w-3 h-0.5 bg-gray-400 rounded" />
                      <div className="w-3 h-0.5 bg-gray-400 rounded" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Cards + sidebar */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <motion.div layout className="grid gap-1.5"
                    style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                    {RESP_CARDS.slice(0, cols === 1 ? 3 : cols === 2 ? 4 : 6).map((hex, i) => (
                      <motion.div key={i} layout
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="rounded-md p-1.5 border"
                        style={{ borderColor: hex + "40", background: hex + "15" }}>
                        <div className="w-full h-1.5 rounded-full mb-1" style={{ background: hex + "50" }} />
                        <div className="w-3/4 h-1 rounded-full bg-gray-700 mb-0.5" />
                        <div className="w-1/2 h-1 rounded-full bg-gray-700/50" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <AnimatePresence>
                  {showSidebar && (
                    <motion.div key="sidebar"
                      initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 68 }} exit={{ opacity: 0, width: 0 }}
                      className="shrink-0 rounded-md border border-orange-500/30 bg-orange-500/5 p-1.5 overflow-hidden">
                      <div className="text-[8px] text-orange-400 font-mono font-bold mb-1">Sidebar</div>
                      {[85, 65, 75, 50].map((w, i) => (
                        <div key={i} className="h-1 rounded-full bg-orange-500/25 mb-1" style={{ width: `${w}%` }} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Zone indicator */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 text-[10px] font-mono text-center">
              <div className={`px-2 py-2 ${s.width < 640 ? "bg-blue-500/15 text-blue-300 font-semibold" : "text-gray-600"}`}>
                &lt;640px<br /><span className="text-[9px]">1 ustun</span>
              </div>
              <div className={`px-2 py-2 border-x border-border ${s.width >= 640 && s.width < 1024 ? "bg-purple-500/15 text-purple-300 font-semibold" : "text-gray-600"}`}>
                640–1024px<br /><span className="text-[9px]">2 ustun</span>
              </div>
              <div className={`px-2 py-2 ${s.width >= 1024 ? "bg-orange-500/15 text-orange-300 font-semibold" : "text-gray-600"}`}>
                &gt;1024px<br /><span className="text-[9px]">3 ustun + sidebar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-2 gap-2">
          {t.responsiveTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── DISPLAY SECTION ──────────────────────────────────────────────────────────

interface DisplayState {
  display: "block" | "inline" | "inline-block" | "none";
  hasSize: boolean;
  hasSpacing: boolean;
}

function DisplaySection({ t, lang }: { t: CSSTranslations; lang: string }) {
  const lt = LOCAL_TEXTS[lang] || LOCAL_TEXTS.uz;
  const [s, setS] = useState<DisplayState>({ display: "block", hasSize: true, hasSpacing: true });
  const [explain, setExplain] = useState("block");

  const upd = (patch: Partial<DisplayState>, e: string) => {
    setS(p => ({ ...p, ...patch }));
    setExplain(e);
  };

  const css = [
    ".element-2 {",
    `  display: ${s.display};`,
    ...(s.hasSize ? [
      "  width: 110px;",
      "  height: 50px;"
    ] : []),
    ...(s.hasSpacing ? [
      "  margin: 12px;",
      "  padding: 8px;"
    ] : []),
    "}",
  ];

  const htmlCode = [
    '<div class="container">',
    '  <div class="element-1">1-element</div>',
    '  <div class="element-2">2-element</div>',
    '  <div class="element-3">3-element</div>',
    '</div>'
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="display" color="emerald">
          {(["block", "inline", "inline-block", "none"] as const).map(v => (
            <PropBtn key={v} active={s.display === v} color="emerald" onClick={() => upd({ display: v }, v)}>{v}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="dimensions (width / height)" color="blue">
          <PropBtn active={s.hasSize} color="blue" onClick={() => upd({ hasSize: true }, s.display)}>
            110px × 50px
          </PropBtn>
          <PropBtn active={!s.hasSize} color="blue" onClick={() => upd({ hasSize: false }, s.display)}>
            {lt.autoContent}
          </PropBtn>
        </CtrlGroup>

        <CtrlGroup title="margin / padding" color="orange">
          <PropBtn active={s.hasSpacing} color="orange" onClick={() => upd({ hasSpacing: true }, s.display)}>
            {lt.active}
          </PropBtn>
          <PropBtn active={!s.hasSpacing} color="orange" onClick={() => upd({ hasSpacing: false }, s.display)}>
            {lt.inactive}
          </PropBtn>
        </CtrlGroup>

        <CSSCode lines={css} />
        <HTMLCode code={htmlCode} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={explain} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-emerald-400 font-bold font-mono">{explain}</code>
              {" — "}
              {t.displayExplain[explain]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Live preview */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">{lt.displayPreview}</span>
          </div>

          <div className="rounded-xl bg-[#0d1117] border border-border flex flex-col justify-center min-h-[220px] p-4">
            <div className="text-[10px] text-gray-600 font-mono mb-2">{lt.flowStart}</div>
            
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="border border-white/5 rounded-lg p-3 bg-black/20"
            >
              {/* Element 1 */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="inline-block bg-blue-500/80 border border-white/10 text-white rounded-lg text-xs font-mono font-bold px-3 py-2 mr-2"
              >
                {lt.el1}
              </motion.div>

              {/* Element 2 (Target) */}
              <AnimatePresence>
                {s.display !== "none" && (
                  <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    style={{
                      display: s.display === "inline" ? "inline-block" : s.display,
                      width: s.display === "inline" ? undefined : (s.hasSize ? 110 : undefined),
                      height: s.display === "inline" ? undefined : (s.hasSize ? 50 : undefined),
                      margin: s.hasSpacing ? 12 : undefined,
                      padding: s.hasSpacing ? 8 : undefined,
                    }}
                    className="bg-emerald-500/90 border border-white/20 text-white rounded-lg text-xs font-mono font-bold items-center justify-center inline-flex"
                  >
                  <span className="text-center w-full">{lt.el2} ({s.display})</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Element 3 */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="inline-block bg-purple-500/80 border border-white/10 text-white rounded-lg text-xs font-mono font-bold px-3 py-2 ml-2"
              >
                {lt.el3}
              </motion.div>
            </motion.div>

            <div className="text-[10px] text-gray-600 font-mono mt-2">{lt.flowEnd}</div>
          </div>
        </div>

        {/* Display concepts */}
        <div className="grid grid-cols-2 gap-2">
          {t.displayTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── BOX SHADOW SECTION ───────────────────────────────────────────────────────

interface BoxShadowState {
  h: number;
  v: number;
  blur: number;
  spread: number;
  color: string;
  colorName: string;
  inset: boolean;
}

function BoxShadowSection({ t, lang }: { t: CSSTranslations; lang: string }) {
  const lt = LOCAL_TEXTS[lang] || LOCAL_TEXTS.uz;
  const [s, setS] = useState<BoxShadowState>({
    h: 8,
    v: 8,
    blur: 16,
    spread: 0,
    color: "rgba(0, 0, 0, 0.55)",
    colorName: "black",
    inset: false,
  });

  const upd = (patch: Partial<BoxShadowState>) => {
    setS(p => ({ ...p, ...patch }));
  };

  const shadowVal = `${s.inset ? "inset " : ""}${s.h}px ${s.v}px ${s.blur}px ${s.spread}px ${s.color}`;

  const css = [
    ".box {",
    "  width: 140px;",
    "  height: 140px;",
    "  background: #1e293b;",
    "  border-radius: 16px;",
    `  box-shadow: ${shadowVal};`,
    "}",
  ];

  const htmlCode = ['<div class="box">Box</div>'];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="horizontal offset (h-offset)" color="blue">
          {[-15, -8, 0, 8, 15].map(v => (
            <PropBtn key={v} active={s.h === v} color="blue" onClick={() => upd({ h: v })}>{v}px</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="vertical offset (v-offset)" color="purple">
          {[-15, -8, 0, 8, 15].map(v => (
            <PropBtn key={v} active={s.v === v} color="purple" onClick={() => upd({ v: v })}>{v}px</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="blur-radius" color="emerald">
          {[0, 4, 8, 16, 24].map(v => (
            <PropBtn key={v} active={s.blur === v} color="emerald" onClick={() => upd({ blur: v })}>{v}px</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="spread-radius" color="orange">
          {[-8, 0, 4, 8, 12].map(v => (
            <PropBtn key={v} active={s.spread === v} color="orange" onClick={() => upd({ spread: v })}>{v}px</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="shadow color" color="pink">
          {[
            { key: "black",  name: lt.colorBlack,  val: "rgba(0, 0, 0, 0.55)" },
            { key: "blue",   name: lt.colorBlue,   val: "rgba(59, 130, 246, 0.55)" },
            { key: "purple", name: lt.colorPurple, val: "rgba(168, 85, 247, 0.55)" },
            { key: "pink",   name: lt.colorPink,   val: "rgba(236, 72, 153, 0.55)" },
          ].map(c => (
            <PropBtn key={c.key} active={s.colorName === c.key} color="pink" onClick={() => upd({ color: c.val, colorName: c.key })}>{c.name}</PropBtn>
          ))}
        </CtrlGroup>

        <CtrlGroup title="inset" color="yellow">
          <PropBtn active={!s.inset} color="yellow" onClick={() => upd({ inset: false })}>{lt.outer}</PropBtn>
          <PropBtn active={s.inset} color="yellow" onClick={() => upd({ inset: true })}>{lt.inset}</PropBtn>
        </CtrlGroup>

        <CSSCode lines={css} />
        <HTMLCode code={htmlCode} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
          <p className="text-sm text-gray-300">
            <code className="text-purple-400 font-bold font-mono">box-shadow</code>
            {" — "}
            {t.boxShadowExplain.shadow}
          </p>
        </div>

        {/* Live preview */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">{lt.shadowPreview}</span>
          </div>

          <div className="rounded-xl bg-[#0d1117] border border-border flex items-center justify-center overflow-hidden p-6" style={{ minHeight: 260 }}>
            <div
              style={{
                width: 140,
                height: 140,
                background: "#1e293b",
                borderRadius: 16,
                boxShadow: shadowVal,
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.25s ease"
              }}
              className="flex items-center justify-center text-xs font-mono text-gray-400 font-bold"
            >
              {lt.boxLabel}
            </div>
          </div>
        </div>

        {/* Shadow concepts */}
        <div className="grid grid-cols-2 gap-2">
          {t.boxShadowTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── PSEUDO-CLASS SECTION ─────────────────────────────────────────────────────

const PSEUDO_CLASSES = [
  { id: "hover",        label: ":hover",          color: "#3b82f6" },
  { id: "focus",        label: ":focus",          color: "#a855f7" },
  { id: "active",       label: ":active",         color: "#ec4899" },
  { id: "first-child",  label: ":first-child",    color: "#10b981" },
  { id: "last-child",   label: ":last-child",     color: "#f97316" },
  { id: "nth-child",    label: ":nth-child(odd)", color: "#eab308" },
  { id: "not",          label: ":not(.active)",   color: "#06b6d4" },
  { id: "disabled",     label: ":disabled",       color: "#6b7280" },
  { id: "checked",      label: ":checked",        color: "#f43f5e" },
];

function PseudoClassSection({ t, lang }: { t: CSSTranslations; lang: string }) {
  const lt = LOCAL_TEXTS[lang] || LOCAL_TEXTS.uz;
  const [selected, setSelected] = useState("hover");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [checked, setChecked] = useState(false);

  const pc = PSEUDO_CLASSES.find(p => p.id === selected)!;

  const cssLines: Record<string, string[]> = {
    hover:        [".btn {","  background: #1e293b;","  color: #94a3b8;","}","",".btn:hover {","  background: #3b82f6;","  color: white;","  transform: scale(1.05);","}"],
    focus:        [".input {","  border: 2px solid #334155;","  outline: none;","}","",".input:focus {","  border-color: #a855f7;","  box-shadow: 0 0 0 3px rgba(168,85,247,0.3);","}"],
    active:       [".btn:active {","  transform: scale(0.95);","  background: #ec4899;","}"],
    "first-child": [".list li:first-child {","  color: #10b981;","  font-weight: bold;","  border-left: 3px solid #10b981;","}"],
    "last-child":  [".list li:last-child {","  color: #f97316;","  font-weight: bold;","  border-left: 3px solid #f97316;","}"],
    "nth-child":   [".list li:nth-child(odd) {","  background: rgba(234,179,8,0.1);","  color: #eab308;","}"],
    not:           [".list li:not(.active) {","  opacity: 0.4;","  filter: grayscale(1);","}"],
    disabled:      ["button:disabled {","  opacity: 0.4;","  cursor: not-allowed;","  background: #1e293b;","}"],
    checked:       ["input[type='checkbox']:checked + label {","  color: #f43f5e;","  font-weight: bold;","  text-decoration: line-through;","}"],
  };

  const explainMap: Record<string, string> = t.pseudoClassExplain;

  const htmlLinesMap: Record<string, string[]> = {
    hover:        ['<button class="btn">Hover Me</button>'],
    focus:        ['<input class="input" placeholder="..." />'],
    active:       ['<button class="btn">Click Me</button>'],
    "first-child": ['<ul class="list">', '  <li>1-element</li>', '  <li>2-element</li>', '  <li>3-element</li>', '  <li>4-element</li>', '  <li>5-element</li>', '</ul>'],
    "last-child":  ['<ul class="list">', '  <li>1-element</li>', '  <li>2-element</li>', '  <li>3-element</li>', '  <li>4-element</li>', '  <li>5-element</li>', '</ul>'],
    "nth-child":   ['<ul class="list">', '  <li>1-element</li>', '  <li>2-element</li>', '  <li>3-element</li>', '  <li>4-element</li>', '  <li>5-element</li>', '</ul>'],
    not:           ['<ul class="list">', '  <li>1-element</li>', '  <li>2-element</li>', '  <li class="active">3-element</li>', '  <li>4-element</li>', '  <li>5-element</li>', '</ul>'],
    disabled:      ['<button class="btn">Enabled</button>', '<button class="btn" disabled>Disabled</button>'],
    checked:       ['<input type="checkbox" id="chk-1" />', '<label for="chk-1">1-element</label>'],
  };
  const htmlCode = htmlLinesMap[selected] || [];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="pseudo-class" color="blue">
          {PSEUDO_CLASSES.map(p => (
            <PropBtn key={p.id} active={selected === p.id} color="blue" onClick={() => setSelected(p.id)}>
              {p.label}
            </PropBtn>
          ))}
        </CtrlGroup>
        <CSSCode lines={cssLines[selected] || []} />
        <HTMLCode code={htmlCode} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Explain banner */}
        <AnimatePresence mode="wait">
          <motion.div key={selected}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-cyan-400 font-bold font-mono">{pc.label}</code>
              {" — "}
              {explainMap[selected] ?? ""}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Live demo */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-5">
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">{lt.liveDemo}</span>

          {/* hover */}
          {selected === "hover" && (
            <div className="flex flex-col gap-3 items-start">
              <button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="px-6 py-3 rounded-xl font-mono font-bold text-sm transition-all duration-200"
                style={{
                  background: hovered ? "#3b82f6" : "#1e293b",
                  color: hovered ? "white" : "#94a3b8",
                  transform: hovered ? "scale(1.05)" : "scale(1)",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                {hovered ? lt.hoverActive : lt.hoverInactive}
              </button>
              <p className="text-xs text-gray-500 font-mono">hover: {hovered ? "true" : "false"}</p>
            </div>
          )}

          {/* focus */}
          {selected === "focus" && (
            <div className="flex flex-col gap-3">
              <input
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full max-w-xs px-4 py-2.5 rounded-xl font-mono text-sm bg-[#0d1117] text-gray-200 outline-none transition-all duration-200"
                style={{
                  border: focused ? "2px solid #a855f7" : "2px solid #334155",
                  boxShadow: focused ? "0 0 0 3px rgba(168,85,247,0.3)" : "none",
                }}
                placeholder={lt.focusPlaceholder}
              />
              <p className="text-xs text-gray-500 font-mono">focus: {focused ? "true" : "false"}</p>
            </div>
          )}

          {/* active */}
          {selected === "active" && (
            <div className="flex flex-col gap-3 items-start">
              <button
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                onMouseLeave={() => setIsActive(false)}
                className="px-6 py-3 rounded-xl font-mono font-bold text-sm text-white border border-white/10 transition-all duration-75"
                style={{
                  background: isActive ? "#ec4899" : "#1e293b",
                  transform: isActive ? "scale(0.95)" : "scale(1)",
                }}
              >
                {isActive ? lt.activeActive : lt.activeInactive}
              </button>
              <p className="text-xs text-gray-500 font-mono">active: {isActive ? "true" : "false"}</p>
            </div>
          )}

          {/* first-child / last-child / nth-child / not */}
          {["first-child", "last-child", "nth-child", "not"].includes(selected) && (
            <ul className="flex flex-col gap-1.5 w-full max-w-xs">
              {[lt.el1, lt.el2, lt.el3, "4-element", "5-element"].map((item, i) => {
                const isFirst = i === 0;
                const isLast = i === 4;
                const isOdd = i % 2 === 0;
                const isNotActive = i !== 2;

                let style: React.CSSProperties = {
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontFamily: "monospace",
                  fontSize: 13,
                  background: "#0d1117",
                  color: "#64748b",
                  borderLeft: "3px solid transparent",
                  opacity: 1,
                  transition: "all 0.15s",
                };
                if (selected === "first-child" && isFirst)  { style.color = "#10b981"; style.fontWeight = "bold"; style.borderLeft = "3px solid #10b981"; }
                if (selected === "last-child"  && isLast)   { style.color = "#f97316"; style.fontWeight = "bold"; style.borderLeft = "3px solid #f97316"; }
                if (selected === "nth-child"   && isOdd)    { style.background = "rgba(234,179,8,0.1)"; style.color = "#eab308"; }
                if (selected === "not"         && isNotActive) { style.opacity = 0.35; }
                return <li key={i} style={style}>{item}{i === 2 && selected === "not" ? lt.notActiveHelp : ""}</li>;
              })}
            </ul>
          )}

          {/* disabled */}
          {selected === "disabled" && (
            <div className="flex gap-3 items-center flex-wrap">
              <button className="px-5 py-2.5 rounded-xl font-mono font-bold text-sm text-white bg-blue-600 border border-white/10">
                {lt.enabledLabel}
              </button>
              <button disabled className="px-5 py-2.5 rounded-xl font-mono font-bold text-sm border border-white/10"
                style={{ opacity: 0.4, cursor: "not-allowed", background: "#1e293b", color: "#64748b" }}>
                {lt.disabledLabel}
              </button>
            </div>
          )}

          {/* checked */}
          {selected === "checked" && (
            <div className="flex flex-col gap-3">
              {[lt.el1, lt.el2, lt.el3].map((item, i) => {
                const id = `chk-${i}`;
                const ch = i === 0 ? checked : i === 1;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={id}
                      checked={i === 0 ? checked : i === 1}
                      onChange={i === 0 ? () => setChecked(c => !c) : undefined}
                      className="w-4 h-4 accent-pink-500"
                    />
                    <label htmlFor={id} className="font-mono text-sm transition-all duration-150"
                      style={{ color: ch ? "#f43f5e" : "#64748b", fontWeight: ch ? 700 : 400, textDecoration: ch ? "line-through" : "none" }}>
                      {item}
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="grid grid-cols-2 gap-2">
          {t.pseudoClassTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
        </div>
      </div>
    </div>
  );
}

// ─── PSEUDO-ELEMENT SECTION ───────────────────────────────────────────────────

const PSEUDO_ELEMENTS = [
  { id: "before",       label: "::before" },
  { id: "after",        label: "::after" },
  { id: "first-letter", label: "::first-letter" },
  { id: "first-line",   label: "::first-line" },
  { id: "placeholder",  label: "::placeholder" },
  { id: "selection",    label: "::selection" },
];

function PseudoElementSection({ t, lang }: { t: CSSTranslations; lang: string }) {
  const lt = LOCAL_TEXTS[lang] || LOCAL_TEXTS.uz;
  const [selected, setSelected] = useState("before");
  const [selectionText, setSelectionText] = useState("");

  const pe = PSEUDO_ELEMENTS.find(p => p.id === selected)!;
  const explainMap: Record<string, string> = t.pseudoElementExplain;

  const cssLines: Record<string, string[]> = {
    before:         [".badge::before {","  content: '★ ';","  color: #eab308;","}"],
    after:          [".tag::after {","  content: ' →';","  color: #a855f7;","  margin-left: 4px;","}"],
    "first-letter": [".paragraph::first-letter {","  font-size: 3em;","  font-weight: bold;","  color: #3b82f6;","  float: left;","  line-height: 1;","  margin-right: 4px;","}"],
    "first-line":   [".paragraph::first-line {","  color: #10b981;","  font-weight: bold;","  font-style: italic;","}"],
    placeholder:    [".input::placeholder {","  color: #a855f7;","  font-style: italic;","  opacity: 0.8;","}"],
    selection:      [".text::selection {","  background: #ec4899;","  color: white;","}"],
  };

  const htmlLinesMap: Record<string, string[]> = {
    before:         ['<div class="badge">Eslatma</div>'],
    after:          ['<a class="tag">Home</a>'],
    "first-letter": ['<p class="paragraph">', `  ${lt.flLetter}${lt.flText}`, '</p>'],
    "first-line":   ['<p class="paragraph">', `  ${lt.flLineFirst} ${lt.flLineRest}`, '</p>'],
    placeholder:    ['<input class="input" placeholder="..." />'],
    selection:      ['<p class="text">', `  ${lt.selText}`, '</p>'],
  };
  const htmlCode = htmlLinesMap[selected] || [];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Controls */}
      <div className="xl:w-[380px] shrink-0 flex flex-col gap-4">
        <CtrlGroup title="pseudo-element" color="purple">
          {PSEUDO_ELEMENTS.map(p => (
            <PropBtn key={p.id} active={selected === p.id} color="purple" onClick={() => setSelected(p.id)}>
              {p.label}
            </PropBtn>
          ))}
        </CtrlGroup>
        <CSSCode lines={cssLines[selected] || []} />
        <HTMLCode code={htmlCode} />
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Explain banner */}
        <AnimatePresence mode="wait">
          <motion.div key={selected}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
            <p className="text-sm text-gray-300">
              <code className="text-purple-400 font-bold font-mono">{pe.label}</code>
              {" — "}
              {explainMap[selected] ?? ""}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Live demo */}
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-5">
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">{lt.liveDemo}</span>

          {/* ::before */}
          {selected === "before" && (
            <div className="flex flex-col gap-3">
              {[lt.beforeBadge1, lt.beforeBadge2, lt.beforeBadge3].map(label => (
                <div key={label} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d1117] border border-white/5 font-mono text-sm text-gray-200 w-fit">
                  <span className="text-yellow-400 font-bold">★</span>
                  {label}
                </div>
              ))}
              <p className="text-[11px] text-gray-600 font-mono mt-1">{lt.beforeHelp}</p>
            </div>
          )}

          {/* ::after */}
          {selected === "after" && (
            <div className="flex flex-col gap-3">
              {[lt.afterBadge1, lt.afterBadge2, lt.afterBadge3].map(label => (
                <div key={label} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0d1117] border border-white/5 font-mono text-sm text-gray-200 w-fit">
                  {label}
                  <span className="text-purple-400 font-bold">→</span>
                </div>
              ))}
              <p className="text-[11px] text-gray-600 font-mono mt-1">{lt.afterHelp}</p>
            </div>
          )}

          {/* ::first-letter */}
          {selected === "first-letter" && (
            <div className="rounded-xl bg-[#0d1117] border border-white/5 p-5 max-w-sm">
              <p className="text-gray-300 text-sm leading-relaxed font-serif">
                <span className="text-blue-400 font-black text-5xl float-left leading-none mr-2">{lt.flLetter}</span>
                {lt.flText}
              </p>
            </div>
          )}

          {/* ::first-line */}
          {selected === "first-line" && (
            <div className="rounded-xl bg-[#0d1117] border border-white/5 p-5 max-w-sm">
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-emerald-400 font-bold italic">{lt.flLineFirst}</span>
                {" "}{lt.flLineRest}
              </p>
            </div>
          )}

          {/* ::placeholder */}
          {selected === "placeholder" && (
            <div className="flex flex-col gap-3">
              <input
                className="pseudo-ph w-full max-w-xs px-4 py-3 rounded-xl bg-[#0d1117] border border-white/10 text-gray-200 font-mono text-sm outline-none focus:border-purple-500 transition-colors"
                placeholder={lt.phPlaceholder}
              />
              <style>{`input.pseudo-ph::placeholder { color: #a855f7; font-style: italic; }`}</style>
              <p className="text-[11px] text-gray-600 font-mono">{lt.phHelp}</p>
            </div>
          )}

          {/* ::selection */}
          {selected === "selection" && (
            <div className="flex flex-col gap-3">
              <div className="rounded-xl bg-[#0d1117] border border-white/5 p-5">
                <style>{`.sel-text::selection { background: #ec4899; color: white; }`}</style>
                <p className="sel-text text-gray-200 text-sm leading-relaxed font-mono select-text">
                  {lt.selText}
                </p>
              </div>
              <p className="text-[11px] text-gray-600 font-mono">{lt.selHelp}</p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="grid grid-cols-2 gap-2">
          {t.pseudoElementTips.map(tip => <InfoCard key={tip.title} icon={tip.icon} title={tip.title} desc={tip.desc} />)}
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
    { id: "flex" as Tab,          label: "Flexbox",         icon: <Layers size={16} />,       desc: t.flexDesc,           color: "blue"    },
    { id: "grid" as Tab,          label: "Grid",            icon: <LayoutGrid size={16} />,   desc: t.gridDesc,           color: "purple"  },
    { id: "display" as Tab,       label: "Display",         icon: <Monitor size={16} />,      desc: t.displayDesc,        color: "emerald" },
    { id: "boxshadow" as Tab,     label: "Box Shadow",      icon: <Square size={16} />,       desc: t.boxShadowDesc,      color: "pink"    },
    { id: "pseudoclass" as Tab,   label: "Pseudo-class",   icon: <MousePointer size={16} />, desc: t.pseudoClassDesc,    color: "cyan"    },
    { id: "pseudoelement" as Tab, label: "Pseudo-element", icon: <Type size={16} />,          desc: t.pseudoElementDesc,  color: "yellow"  },
    { id: "animation" as Tab,     label: "Animation",       icon: <Sparkles size={16} />,     desc: t.animDesc,           color: "yellow"  },
    { id: "boxmodel" as Tab,      label: "Box Model",       icon: <Square size={16} />,       desc: t.boxDesc,            color: "orange"  },
    { id: "position" as Tab,      label: "Position",        icon: <MapPin size={16} />,       desc: t.posDesc,            color: "emerald" },
    { id: "transition" as Tab,    label: "Transition",      icon: <Zap size={16} />,          desc: t.transDesc,          color: "pink"    },
    { id: "responsive" as Tab,    label: "Responsive",      icon: <Monitor size={16} />,      desc: t.responsiveDesc,     color: "cyan"    },
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
            <Link href="/performance"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-gray-400 hover:text-gray-200 transition-colors font-mono">
              <BarChart3 size={12} />
              Resurs
            </Link>
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
            {tab === "flex"          && <FlexSection t={t} lang={lang} />}
            {tab === "grid"          && <GridSection t={t} lang={lang} />}
            {tab === "display"       && <DisplaySection t={t} lang={lang} />}
            {tab === "boxshadow"     && <BoxShadowSection t={t} lang={lang} />}
            {tab === "pseudoclass"   && <PseudoClassSection t={t} lang={lang} />}
            {tab === "pseudoelement" && <PseudoElementSection t={t} lang={lang} />}
            {tab === "animation"     && <AnimSection t={t} />}
            {tab === "boxmodel"      && <BoxModelSection t={t} />}
            {tab === "position"      && <PositionSection t={t} />}
            {tab === "transition"    && <TransitionSection t={t} />}
            {tab === "responsive"    && <ResponsiveSection t={t} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
