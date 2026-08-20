"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Code2, Variable, GitBranch, Terminal,
  BookOpen, Layers, LayoutGrid, Sparkles, Zap, Play,
  ChevronRight, Eye, BarChart3, Server,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLangStore } from "@/app/playground/store";
import { UI } from "@/lib/i18n/ui";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "w-10 h-10 rounded-xl" : size === "sm" ? "w-5 h-5 rounded-md" : "w-7 h-7 rounded-lg";
  const icon = size === "lg" ? 20 : size === "sm" ? 10 : 14;
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";
  return (
    <div className="flex items-center gap-2">
      <div className={`${box} bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0`}>
        <Code2 size={icon} className="text-white" />
      </div>
      <span className={`font-black ${text} text-white font-mono tracking-tight`}>
        Logic<span className="text-primary-light">Lab</span>
      </span>
    </div>
  );
}

// ─── Mini JS preview (decorative) ────────────────────────────────────────────

function MiniJSPreview() {
  return (
    <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden font-mono text-xs">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-surface-2/60">
        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-green-500/60" />
        <span className="ml-2 text-[10px] text-gray-600">script.js</span>
      </div>
      <div className="p-3 space-y-0.5 leading-5">
        <div><span className="text-blue-400">let</span> <span className="text-primary-light">x</span> <span className="text-gray-500">= </span><span className="text-orange-400">10</span><span className="text-gray-600">;</span></div>
        <div><span className="text-blue-400">let</span> <span className="text-primary-light">y</span> <span className="text-gray-500">= </span><span className="text-orange-400">3</span><span className="text-gray-600">;</span></div>
        <div className="h-1" />
        <div className="bg-primary/12 border-l-2 border-primary -mx-3 px-3 rounded-r">
          <span className="text-yellow-400">if</span> <span className="text-gray-400">(</span><span className="text-primary-light">x</span> <span className="text-accent-light">&gt;</span> <span className="text-primary-light">y</span><span className="text-gray-400">)</span> <span className="text-gray-600">{"{"}</span>
        </div>
        <div className="pl-3"><span className="text-success-light">console</span><span className="text-gray-500">.</span><span className="text-success-light">log</span><span className="text-gray-400">(</span><span className="text-green-400">"katta"</span><span className="text-gray-400">)</span><span className="text-gray-600">;</span></div>
        <div><span className="text-gray-600">{"}"}</span></div>
      </div>
      {/* Step indicator */}
      <div className="px-3 pb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] text-primary-light">Shart tekshirilmoqda: x &gt; y → TRUE</span>
      </div>
    </div>
  );
}

// ─── Mini CSS preview (decorative) ───────────────────────────────────────────

function MiniCSSPreview() {
  const boxes = [
    { color: "#3b82f6", label: "A" },
    { color: "#a855f7", label: "B" },
    { color: "#10b981", label: "C" },
    { color: "#f97316", label: "D" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {/* Live preview */}
      <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-surface-2/60">
          <div className="w-2 h-2 rounded-full bg-rose-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <span className="ml-2 text-[10px] text-gray-600">live preview</span>
        </div>
        <div className="p-3 flex items-end justify-center gap-2 py-4">
          {boxes.map((b, i) => (
            <motion.div
              key={b.label}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
              className="rounded-lg flex items-center justify-center font-mono font-black text-white text-xs border border-white/20"
              style={{ background: b.color + "cc", width: 28, height: 28 + i * 6 }}
            >
              {b.label}
            </motion.div>
          ))}
        </div>
      </div>
      {/* CSS + HTML panels */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border bg-[#0d1117] overflow-hidden">
          <div className="px-2 py-1 border-b border-border/50 bg-surface-2/40">
            <span className="text-[9px] text-gray-600 font-mono">style.css</span>
          </div>
          <div className="p-2 font-mono text-[9px] space-y-0.5 leading-4">
            <div><span className="text-purple-400">.box</span><span className="text-gray-600"> {"{ "}</span></div>
            <div className="pl-2"><span className="text-blue-400">display</span><span className="text-gray-600">: </span><span className="text-orange-300">flex</span><span className="text-gray-600">;</span></div>
            <div className="pl-2"><span className="text-blue-400">gap</span><span className="text-gray-600">: </span><span className="text-orange-300">8px</span><span className="text-gray-600">;</span></div>
            <div><span className="text-gray-600">{" }"}</span></div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-[#0d1117] overflow-hidden">
          <div className="px-2 py-1 border-b border-border/50 bg-surface-2/40">
            <span className="text-[9px] text-gray-600 font-mono">index.html</span>
          </div>
          <div className="p-2 font-mono text-[9px] space-y-0.5 leading-4">
            <div><span className="text-blue-400 font-semibold">&lt;div</span><span className="text-yellow-300"> class</span><span className="text-gray-500">=</span><span className="text-orange-300">"box"</span><span className="text-blue-400 font-semibold">&gt;</span></div>
            <div className="pl-2"><span className="text-blue-400 font-semibold">&lt;div</span><span className="text-blue-400 font-semibold">&gt;</span><span className="text-gray-300">A</span><span className="text-blue-400 font-semibold">&lt;/div&gt;</span></div>
            <div className="pl-2"><span className="text-blue-400 font-semibold">&lt;div</span><span className="text-blue-400 font-semibold">&gt;</span><span className="text-gray-300">B</span><span className="text-blue-400 font-semibold">&lt;/div&gt;</span></div>
            <div><span className="text-blue-400 font-semibold">&lt;/div&gt;</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mini Performance preview (decorative) ───────────────────────────────────

function MiniPerformancePreview() {
  const bars = [
    { label: "for",   a: 100, b: 68,  colorA: "#3b82f6", colorB: "#10b981" },
    { label: "fib()", a: 100, b: 18,  colorA: "#f43f5e", colorB: "#10b981" },
    { label: "search",a: 100, b: 44,  colorA: "#f97316", colorB: "#10b981" },
  ];
  return (
    <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-surface-2/60">
        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-green-500/60" />
        <span className="ml-2 text-[10px] text-gray-600">algorithm benchmark</span>
      </div>
      <div className="p-3 flex flex-col gap-2.5">
        {bars.map((b) => (
          <div key={b.label} className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-600 font-mono">{b.label}</span>
            <div className="flex flex-col gap-0.5">
              <div className="h-2.5 rounded-full overflow-hidden bg-surface-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${b.a}%` }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                  style={{ background: b.colorA + "99" }}
                  className="h-full rounded-full"
                />
              </div>
              <div className="h-2.5 rounded-full overflow-hidden bg-surface-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${b.b}%` }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
                  style={{ background: b.colorB + "cc" }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500/60" /><span className="text-[10px] text-gray-600">ko'p qadam</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500/80" /><span className="text-[10px] text-gray-600">kam qadam ✓</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Mini Backend preview (decorative) ───────────────────────────────────────

function MiniBackendPreview() {
  const steps = [
    { label: "Client",   color: "#3b82f6", icon: "🖥️" },
    { label: "Server",   color: "#10b981", icon: "⚡" },
    { label: "Database", color: "#a855f7", icon: "🗄️" },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-surface-2/60">
          <div className="w-2 h-2 rounded-full bg-rose-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <span className="ml-2 text-[10px] text-gray-600">HTTP flow · live</span>
        </div>
        <div className="p-3 flex items-center justify-center gap-2 py-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
                className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base border border-white/10"
                  style={{ background: s.color + "22" }}>{s.icon}</div>
                <span className="text-[9px] text-gray-600">{s.label}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="flex flex-col gap-0.5 mb-3">
                  <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.4 }}
                    className="text-[10px] text-emerald-600">→</motion.div>
                  <motion.div animate={{ x: [0, -3, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.4 + 0.5 }}
                    className="text-[10px] text-blue-600">←</motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-[#0d1117] overflow-hidden">
        <div className="px-2 py-1 border-b border-border/50 bg-surface-2/40">
          <span className="text-[9px] text-gray-600 font-mono">server.js</span>
        </div>
        <div className="p-2 font-mono text-[9px] space-y-0.5 leading-4">
          <div><span className="text-blue-400 font-semibold">const</span><span className="text-gray-300"> app </span><span className="text-gray-500">= express();</span></div>
          <div><span className="text-gray-500">app.</span><span className="text-yellow-300">get</span><span className="text-gray-500">{'(\'/api/users\', '}</span><span className="text-blue-400 font-semibold">async</span><span className="text-gray-300"> (req, res) </span><span className="text-gray-500">{"=> {"}</span></div>
          <div className="pl-2"><span className="text-blue-400 font-semibold">const</span><span className="text-gray-300"> users </span><span className="text-gray-500">= </span><span className="text-blue-400 font-semibold">await</span><span className="text-gray-300"> db.</span><span className="text-yellow-300">query</span><span className="text-gray-500">(...);</span></div>
          <div className="pl-2"><span className="text-gray-300">res.</span><span className="text-yellow-300">json</span><span className="text-gray-500">(users);</span></div>
          <div><span className="text-gray-500">{"});"}</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Tool card ────────────────────────────────────────────────────────────────

interface ToolCardProps {
  href: string;
  tag: string;
  title: string;
  subtitle: string;
  chips: string[];
  preview: React.ReactNode;
  gradient: string;
  border: string;
  shadow: string;
  tagColor: string;
  btnColor: string;
  delay: number;
  openLabel: string;
}

function ToolCard({ href, tag, title, subtitle, chips, preview, gradient, border, shadow, tagColor, btnColor, delay, openLabel }: ToolCardProps) {
  return (
    <motion.div {...fadeUp(delay)} className="h-full">
      <Link href={href} className="group block h-full">
        <div className={`h-full rounded-2xl border ${border} bg-surface p-6 flex flex-col gap-5 transition-all duration-300 hover:${shadow} hover:scale-[1.01] hover:-translate-y-0.5`}>
          {/* Top: tag + title */}
          <div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${tagColor}`}>
              <Zap size={10} />
              {tag}
            </span>
            <h2 className="text-xl font-black text-white mb-1.5">{title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{subtitle}</p>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-1.5">
            {chips.map(c => (
              <span key={c} className="text-xs px-2 py-0.5 rounded-md bg-surface-2 border border-border text-gray-500 font-mono">{c}</span>
            ))}
          </div>

          {/* Preview */}
          <div className="flex-1">{preview}</div>

          {/* CTA */}
          <div className={`flex items-center gap-2 text-sm font-semibold ${btnColor} group-hover:gap-3 transition-all duration-200`}>
            {openLabel}
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Feature item ─────────────────────────────────────────────────────────────

function Feature({ icon, title, desc, color }: { icon: React.ReactNode; color: string; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex gap-4 p-4 rounded-2xl border border-border bg-surface hover:border-border/80 transition-colors"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-bold text-gray-200 mb-0.5">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { lang } = useLangStore();
  const t = UI[lang];

  const FEATURE_ICONS = [
    <Eye size={16} className="text-primary-light" />,
    <Variable size={16} className="text-accent-light" />,
    <GitBranch size={16} className="text-success-light" />,
    <Layers size={16} className="text-orange-400" />,
    <LayoutGrid size={16} className="text-pink-400" />,
    <Sparkles size={16} className="text-yellow-400" />,
    <Terminal size={16} className="text-success-light" />,
    <BookOpen size={16} className="text-accent-light" />,
    <ChevronRight size={16} className="text-primary-light" />,
  ];
  const FEATURE_COLORS = [
    "bg-primary/10", "bg-accent/10", "bg-success/10", "bg-orange-500/10",
    "bg-pink-500/10", "bg-yellow-500/10", "bg-success/10", "bg-accent/10", "bg-primary/10",
  ];

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(#3b82f6 1px,transparent 1px),linear-gradient(to right,#3b82f6 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-32 right-1/4 w-[400px] h-[400px] bg-accent/4 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] bg-success/3 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="z-10 border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-150 font-medium">
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

      {/* Hero */}
      <section className="relative z-10 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 pt-20 pb-10">
        {/* Left Floating Code Block */}
        <div className="hidden xl:block absolute left-4 2xl:left-12 top-[12%] w-72 rounded-2xl border border-border/40 bg-[#0d1117]/85 backdrop-blur-md p-4 shadow-2xl rotate-[-3deg] opacity-45 hover:opacity-100 hover:rotate-[0deg] transition-all duration-300 font-mono text-[11px] select-none pointer-events-auto text-left">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-border/40">
            <div className="w-2 h-2 rounded-full bg-rose-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <span className="text-[10px] text-gray-500 ml-2">bubbleSort.js</span>
          </div>
          <div className="space-y-0.5 leading-5">
            <div><span className="text-blue-400">async function</span> <span className="text-yellow-300">sort</span><span className="text-gray-400">(arr) {"{"}</span></div>
            <div className="pl-3"><span className="text-blue-400">for</span> <span className="text-gray-400">(</span><span className="text-blue-400">let</span> <span className="text-gray-300">i</span> <span className="text-gray-400">= </span><span className="text-orange-400">0</span><span className="text-gray-400">; i &lt; arr.length; i++) {"{"}</span></div>
            <div className="pl-6"><span className="text-blue-400">for</span> <span className="text-gray-400">(</span><span className="text-blue-400">let</span> <span className="text-gray-300">j</span> <span className="text-gray-400">= </span><span className="text-orange-400">0</span><span className="text-gray-400">; j &lt; arr.length - i - </span><span className="text-orange-400">1</span><span className="text-gray-400">; j++) {"{"}</span></div>
            <div className="pl-9"><span className="text-yellow-400">if</span> <span className="text-gray-400">(arr[j] &gt; arr[j+</span><span className="text-orange-400">1</span><span className="text-gray-400">]) {"{"}</span></div>
            <div className="pl-12"><span className="text-blue-400">await</span> <span className="text-yellow-300">swap</span><span className="text-gray-400">(arr, j, j+</span><span className="text-orange-400">1</span><span className="text-gray-400">);</span></div>
            <div className="pl-9"><span className="text-gray-400">{"}"}</span></div>
            <div className="pl-6"><span className="text-gray-400">{"}"}</span></div>
            <div className="pl-3"><span className="text-gray-400">{"}"}</span></div>
            <div><span className="text-gray-400">{"}"}</span></div>
          </div>
        </div>

        {/* Right Floating Code Block */}
        <div className="hidden xl:block absolute right-4 2xl:right-12 top-[18%] w-72 rounded-2xl border border-border/40 bg-[#0d1117]/85 backdrop-blur-md p-4 shadow-2xl rotate-[3deg] opacity-45 hover:opacity-100 hover:rotate-[0deg] transition-all duration-300 font-mono text-[11px] select-none pointer-events-auto text-left">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-border/40">
            <div className="w-2 h-2 rounded-full bg-rose-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <span className="text-[10px] text-gray-500 ml-2">responsive.css</span>
          </div>
          <div className="space-y-0.5 leading-5">
            <div><span className="text-blue-400">@media</span> <span className="text-gray-400">(</span><span className="text-blue-400">max-width</span><span className="text-gray-400">: </span><span className="text-orange-400">1024px</span><span className="text-gray-400">) {"{"}</span></div>
            <div className="pl-3"><span className="text-purple-400">.container</span> <span className="text-gray-400">{"{"}</span></div>
            <div className="pl-6"><span className="text-blue-400">display</span><span className="text-gray-400">: </span><span className="text-orange-300">grid</span><span className="text-gray-400">;</span></div>
            <div className="pl-6"><span className="text-blue-400">grid-template-columns</span><span className="text-gray-400">: </span><span className="text-orange-300">repeat(2, 1fr)</span><span className="text-gray-400">;</span></div>
            <div className="pl-6"><span className="text-blue-400">gap</span><span className="text-gray-400">: </span><span className="text-orange-300">20px</span><span className="text-gray-400">;</span></div>
            <div className="pl-3"><span className="text-gray-400">{"}"}</span></div>
            <div><span className="text-gray-400">{"}"}</span></div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">

          <motion.div {...fadeUp(0)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary-light text-xs font-semibold mb-8 tracking-wide">
            <Zap size={11} />
            {t.homeBadge}
          </motion.div>

          <motion.h1 {...fadeUp(0.08)}
            className="text-5xl md:text-7xl font-black text-white mb-5 leading-[1.05] tracking-tight">
            {t.homeTitle1}
            <br />
            <span className="bg-gradient-to-r from-primary-light via-accent-light to-success-light bg-clip-text text-transparent">
              {t.homeTitle2}
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)}
            className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
            {t.homeSubtitle}
          </motion.p>

          <motion.div {...fadeUp(0.22)} className="flex items-center gap-3 flex-wrap justify-center">
            <Link href="/playground"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-200 shadow-glow hover:shadow-[0_0_40px_rgba(59,130,246,0.35)]">
              <Code2 size={15} />
              JS Playground
              <ArrowRight size={14} />
            </Link>
            <Link href="/css"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-surface-2 hover:bg-surface-3 text-gray-300 font-bold border border-border hover:border-accent/40 transition-all duration-200">
              <Layers size={15} />
              CSS {t.homeCssTitle}
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Four tool cards */}
      <section className="relative z-10 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <ToolCard
            href="/playground"
            delay={0.1}
            tag="JavaScript"
            title="Execution Visualizer"
            subtitle={t.homeJsSubtitle}
            chips={["variables", "if/else", "for loop", "functions", "arrays", "objects"]}
            preview={<MiniJSPreview />}
            gradient="from-primary/5 to-primary/0"
            border="border-primary/20 hover:border-primary/40"
            shadow="shadow-glow"
            tagColor="border-primary/30 bg-primary/8 text-primary-light"
            btnColor="text-primary-light"
            openLabel={t.homeOpen}
          />
          <ToolCard
            href="/css"
            delay={0.18}
            tag="CSS"
            title={t.homeCssTitle}
            subtitle={t.homeCssSubtitle}
            chips={["flexbox", "grid", "display", "box-shadow", "animations", "transitions", "position", "responsive", ":hover", "::before"]}
            preview={<MiniCSSPreview />}
            gradient="from-accent/5 to-accent/0"
            border="border-accent/20 hover:border-accent/40"
            shadow="shadow-glow-accent"
            tagColor="border-accent/30 bg-accent/8 text-accent-light"
            btnColor="text-accent-light"
            openLabel={t.homeOpen}
          />
          <ToolCard
            href="/performance"
            delay={0.26}
            tag="Benchmark"
            title="Resurs Tahlilchi"
            subtitle="if/else vs switch, for vs while, rekursiya vs iteratsiya — real executor o'lchovlari bilan solishtiring."
            chips={["call stack", "xotira", "tsikl", "funksiya", "qidiruv"]}
            preview={<MiniPerformancePreview />}
            gradient="from-emerald-500/5 to-emerald-500/0"
            border="border-emerald-500/20 hover:border-emerald-500/40"
            shadow="shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            tagColor="border-emerald-500/30 bg-emerald-500/8 text-emerald-300"
            btnColor="text-emerald-400"
            openLabel={t.homeOpen}
          />
          <ToolCard
            href="/backend"
            delay={0.34}
            tag="Backend"
            title={t.homeBackendTitle}
            subtitle={t.homeBackendSubtitle}
            chips={["HTTP", "REST API", "JWT", "middleware", "WebSocket", "CORS"]}
            preview={<MiniBackendPreview />}
            gradient="from-teal-500/5 to-teal-500/0"
            border="border-teal-500/20 hover:border-teal-500/40"
            shadow="shadow-[0_0_30px_rgba(20,184,166,0.15)]"
            tagColor="border-teal-500/30 bg-teal-500/8 text-teal-300"
            btnColor="text-teal-400"
            openLabel={t.homeOpen}
          />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            {t.homeFeaturesTitle.split("LogicLab")[0]}
            <span className="text-primary-light">LogicLab</span>
            {t.homeFeaturesTitle.split("LogicLab")[1]}
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            {t.homeFeaturesSubtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {t.homeFeatures.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}>
              <Feature icon={FEATURE_ICONS[i]} color={FEATURE_COLORS[i]} title={f.title} desc={f.desc} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}
          className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">{t.homeHowTitle}</h2>
          <p className="text-gray-500 text-sm">{t.homeHowSubtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="absolute top-8 left-[calc(33%-1px)] w-[34%] h-px bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 hidden md:block" />
          <div className="absolute top-8 right-[calc(33%-1px)] w-[34%] h-px bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 hidden md:block" />

          {t.homeSteps.map((step, i) => (
            <motion.div key={step.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.4 }}
              className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-surface to-surface-2 border border-border flex items-center justify-center mb-4 relative z-10 shadow-glow">
                <span className="text-2xl font-black text-primary-light font-mono">{i + 1}</span>
              </div>
              <h3 className="font-bold text-white mb-1.5 text-sm">{step.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-surface to-accent/5 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/3 to-accent/5 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative">{t.homeCtaTitle}</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed relative">{t.homeCtaSubtitle}</p>
          <div className="flex items-center gap-3 justify-center flex-wrap relative">
            <Link href="/playground"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-200 shadow-glow hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              <Code2 size={15} />
              JS Playground
              <ArrowRight size={14} />
            </Link>
            <Link href="/css"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-surface-2 hover:bg-surface-3 text-gray-300 font-bold border border-border hover:border-accent/40 transition-all duration-200">
              <Layers size={15} />
              CSS {t.homeCssTitle}
              <ArrowRight size={14} />
            </Link>
            <Link href="/backend"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-surface-2 hover:bg-surface-3 text-gray-300 font-bold border border-border hover:border-teal-500/40 transition-all duration-200">
              <Server size={15} />
              Backend Visualizer
              <ArrowRight size={14} />
            </Link>
            <Link href="/performance"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-surface-2 hover:bg-surface-3 text-gray-300 font-bold border border-border hover:border-emerald-500/40 transition-all duration-200">
              <BarChart3 size={15} />
              Resurs Tahlilchi
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 py-8 flex items-center justify-between gap-4 flex-wrap">
          <Logo size="sm" />
          <p className="text-xs text-gray-600">{t.homeFooterDesc2}</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/playground" className="hover:text-gray-400 transition-colors">JS Playground</Link>
            <Link href="/css" className="hover:text-gray-400 transition-colors">CSS {t.homeCssTitle}</Link>
            <Link href="/backend" className="hover:text-gray-400 transition-colors">Backend Visualizer</Link>
            <Link href="/performance" className="hover:text-gray-400 transition-colors">Resurs Tahlilchi</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

