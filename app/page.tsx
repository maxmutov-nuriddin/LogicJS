"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Code2, Variable, GitBranch, Terminal,
  BookOpen, Layers, LayoutGrid, Sparkles, Zap, Play,
  ChevronRight, Eye,
} from "lucide-react";

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
    { color: "#3b82f6", label: "A", w: 48, h: 48 },
    { color: "#a855f7", label: "B", w: 64, h: 64 },
    { color: "#10b981", label: "C", w: 48, h: 40 },
    { color: "#f97316", label: "D", w: 56, h: 52 },
  ];
  return (
    <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 bg-surface-2/60">
        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-green-500/60" />
        <span className="ml-2 text-[10px] text-gray-600">style.css · live preview</span>
      </div>
      {/* Flex preview */}
      <div className="p-3">
        <div className="flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-border/60 bg-surface-2/30">
          {boxes.map(b => (
            <motion.div
              key={b.label}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: boxes.indexOf(b) * 0.3, ease: "easeInOut" }}
              className="rounded-lg flex items-center justify-center font-mono font-black text-white text-sm border border-white/20"
              style={{ background: b.color + "cc", width: b.w * 0.7, height: b.h * 0.7 }}
            >
              {b.label}
            </motion.div>
          ))}
        </div>
        <div className="mt-2 font-mono text-[10px] text-gray-600 space-y-0.5">
          <div><span className="text-blue-400">display</span><span className="text-gray-600">: </span><span className="text-orange-300">flex</span><span className="text-gray-600">;</span></div>
          <div><span className="text-blue-400">justify-content</span><span className="text-gray-600">: </span><span className="text-orange-300">center</span><span className="text-gray-600">;</span></div>
          <div><span className="text-blue-400">align-items</span><span className="text-gray-600">: </span><span className="text-orange-300">flex-end</span><span className="text-gray-600">;</span></div>
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
}

function ToolCard({ href, tag, title, subtitle, chips, preview, gradient, border, shadow, tagColor, btnColor, delay }: ToolCardProps) {
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
            Ochish
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
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link href="/css"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-150 font-medium">
              <Layers size={13} />
              CSS
            </Link>
            <Link href="/playground"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all duration-150 shadow-glow">
              <Play size={13} />
              JavaScript
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-10">
        <div className="flex flex-col items-center text-center">

          <motion.div {...fadeUp(0)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary-light text-xs font-semibold mb-8 tracking-wide">
            <Zap size={11} />
            Interaktiv o'rganish platformasi
          </motion.div>

          <motion.h1 {...fadeUp(0.08)}
            className="text-5xl md:text-7xl font-black text-white mb-5 leading-[1.05] tracking-tight">
            Kodni ko'rib
            <br />
            <span className="bg-gradient-to-r from-primary-light via-accent-light to-success-light bg-clip-text text-transparent">
              o'rgan
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)}
            className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
            <span className="text-primary-light font-semibold">JavaScript</span> va{" "}
            <span className="text-accent-light font-semibold">CSS</span> ni vizual,
            interaktiv tarzda tushuning. Har bir qadamda nima bo'lishini ko'ring.
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
              CSS Vizualizator
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Two tool cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <ToolCard
            href="/playground"
            delay={0.1}
            tag="JavaScript"
            title="Execution Visualizer"
            subtitle="Kodingiz qadam-qadam qanday bajarilishini koring. O'zgaruvchilar, shartlar, tsikllar, funksiyalar — barchasi ko'z oldingizda."
            chips={["variables", "if/else", "for loop", "functions", "arrays", "objects"]}
            preview={<MiniJSPreview />}
            gradient="from-primary/5 to-primary/0"
            border="border-primary/20 hover:border-primary/40"
            shadow="shadow-glow"
            tagColor="border-primary/30 bg-primary/8 text-primary-light"
            btnColor="text-primary-light"
          />
          <ToolCard
            href="/css"
            delay={0.18}
            tag="CSS"
            title="Layout Vizualizator"
            subtitle="Flexbox, Grid va animatsiyalarni bosib-ko'rib o'rganing. Har bir xususiyat live ko'rinadi — hech narsa yozmasangiz ham."
            chips={["flexbox", "grid", "animations", "@keyframes", "transitions"]}
            preview={<MiniCSSPreview />}
            gradient="from-accent/5 to-accent/0"
            border="border-accent/20 hover:border-accent/40"
            shadow="shadow-glow-accent"
            tagColor="border-accent/30 bg-accent/8 text-accent-light"
            btnColor="text-accent-light"
          />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}
          className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Nima uchun <span className="text-primary-light">LogicLab</span>?
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            Kitob o'qib tushunmadingizmi? Ko'rib o'rganing — tushunish ancha oson.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}>
              <Feature {...f} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.45 }}
          className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">Qanday ishlaydi?</h2>
          <p className="text-gray-500 text-sm">3 ta qadam — hammasi shu</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting lines */}
          <div className="absolute top-8 left-[calc(33%-1px)] w-[34%] h-px bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 hidden md:block" />
          <div className="absolute top-8 right-[calc(33%-1px)] w-[34%] h-px bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 hidden md:block" />

          {HOW_IT_WORKS.map((step, i) => (
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
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-surface to-accent/5 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/3 to-accent/5 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative">
            O'rganishni boshlang
          </h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed relative">
            JavaScript va CSS ni tushunarli tarzda o'rganish uchun hamma narsa shu yerda.
          </p>
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
              CSS Vizualizator
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between gap-4 flex-wrap">
          <Logo size="sm" />
          <p className="text-xs text-gray-600">JavaScript va CSS o'rganuvchilar uchun</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/playground" className="hover:text-gray-400 transition-colors">JS Playground</Link>
            <Link href="/css" className="hover:text-gray-400 transition-colors">CSS Vizualizator</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Eye size={16} className="text-primary-light" />,
    color: "bg-primary/10",
    title: "Vizual bajarish",
    desc: "Kod qanday ishlashini ko'z bilan ko'ring. Har bir qadam animatsiya bilan ko'rsatiladi.",
  },
  {
    icon: <Variable size={16} className="text-accent-light" />,
    color: "bg-accent/10",
    title: "Xotira holati",
    desc: "O'zgaruvchilar xotirada qanday saqlanishini, qiymatlar qanday o'zgarishini koring.",
  },
  {
    icon: <GitBranch size={16} className="text-success-light" />,
    color: "bg-success/10",
    title: "Shart va tarmoqlar",
    desc: "if/else shartlari qanday tekshirilishini va qaysi blok bajarilishini koring.",
  },
  {
    icon: <Layers size={16} className="text-orange-400" />,
    color: "bg-orange-500/10",
    title: "Flexbox vizualizator",
    desc: "flex-direction, justify-content, align-items — tugmani bosib live o'zgaring.",
  },
  {
    icon: <LayoutGrid size={16} className="text-pink-400" />,
    color: "bg-pink-500/10",
    title: "Grid vizualizator",
    desc: "Ustunlar, bo'shliqlar, span — CSS Grid ni interaktiv tarzda tushunib oling.",
  },
  {
    icon: <Sparkles size={16} className="text-yellow-400" />,
    color: "bg-yellow-500/10",
    title: "CSS animatsiyalar",
    desc: "@keyframes, timing-function, duration — real animatsiyalarni ko'rib o'rgan.",
  },
  {
    icon: <Terminal size={16} className="text-success-light" />,
    color: "bg-success/10",
    title: "Konsol natijasi",
    desc: "console.log qachon va qaysi qiymat bilan chaqirilishini aynan shu lahzada koring.",
  },
  {
    icon: <BookOpen size={16} className="text-accent-light" />,
    color: "bg-accent/10",
    title: "Oson tushuntirish",
    desc: "Har bir qadam uchun sodda tilda izoh beriladi — qachon va nima uchun tushuntiriladi.",
  },
  {
    icon: <ChevronRight size={16} className="text-primary-light" />,
    color: "bg-primary/10",
    title: "Qadam-qadam boshqaruv",
    desc: "Oldinga, orqaga, tezlik tanlash — o'z sur'atda o'rgan. Auto-play ham bor.",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Vositani tanlang",
    description: "JavaScript playground yoki CSS vizualizatorni oching.",
  },
  {
    title: "Kod yozing yoki tanlang",
    description: "O'z kodingizni yozing yoki tayyor misolllardan birini tanlang.",
  },
  {
    title: "Vizual koring",
    description: "Run tugmasi → har bir qadam animatsiya bilan tushuntiriladi.",
  },
];
