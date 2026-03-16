"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Cpu,
  GitBranch,
  Terminal,
  Variable,
  Zap,
  BookOpen,
  Eye,
  PlayCircle,
} from "lucide-react";

const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const STAGGER = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(to right, #3b82f6 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-32 left-10 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-32 right-10 w-64 h-64 bg-success/5 rounded-full blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-base text-white font-mono tracking-tight">
              Logic<span className="text-primary-light">JS</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/css"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-gray-300 text-sm font-semibold border border-border transition-all duration-200"
            >
              CSS Vizualizator
            </Link>
            <Link
              href="/playground"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all duration-200 shadow-glow"
            >
              <PlayCircle size={14} />
              Open Playground
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
        <motion.div
          variants={STAGGER}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div
            variants={FADE_UP}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary-light text-sm font-medium mb-8"
          >
            <Zap size={12} className="text-primary-light" />
            JavaScript Execution Visualizer
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={FADE_UP}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight"
          >
            See exactly how
            <br />
            <span className="bg-gradient-to-r from-primary-light via-accent-light to-primary-light bg-clip-text text-transparent">
              JavaScript runs
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={FADE_UP}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
          >
            LogicJS visualizes your code execution step by step. Watch variables
            come to life, conditions get evaluated, and branches get chosen —
            all in real time.
          </motion.p>

          {/* CTA */}
          <motion.div variants={FADE_UP} className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/playground"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-base transition-all duration-200 shadow-glow hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
            >
              Open Playground
              <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-surface-2 hover:bg-surface-3 text-gray-300 font-semibold text-base border border-border transition-all duration-200"
            >
              Learn more
            </a>
          </motion.div>
        </motion.div>

        {/* Hero code preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.1)]">
            {/* Title bar */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-surface-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-gray-500 font-mono">
                playground.js — LogicJS
              </span>
            </div>

            {/* Mock content */}
            <div className="grid md:grid-cols-2 divide-x divide-border">
              {/* Code side */}
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div className="flex gap-4">
                  <div className="text-gray-700 select-none text-right leading-relaxed">
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <div key={n}>{n}</div>
                    ))}
                  </div>
                  <div className="leading-relaxed">
                    <div>
                      <span className="text-accent-light">let</span>{" "}
                      <span className="text-primary-light">a</span>{" "}
                      <span className="text-gray-400">=</span>{" "}
                      <span className="text-orange-400">5</span>
                      <span className="text-gray-500">;</span>
                    </div>
                    <div className="h-4" />
                    <div className="bg-primary/10 border-l-2 border-primary -mx-2 px-2 rounded-r">
                      <span className="text-yellow-400">if</span>{" "}
                      <span className="text-gray-300">(</span>
                      <span className="text-primary-light">a</span>{" "}
                      <span className="text-accent-light">&gt;</span>{" "}
                      <span className="text-orange-400">3</span>
                      <span className="text-gray-300">)</span>{" "}
                      <span className="text-gray-500">{"{"}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-success-light">console</span>
                      <span className="text-gray-400">.</span>
                      <span className="text-success-light">log</span>
                      <span className="text-gray-300">(</span>
                      <span className="text-green-400">&quot;big&quot;</span>
                      <span className="text-gray-300">)</span>
                      <span className="text-gray-500">;</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{"}"}</span>{" "}
                      <span className="text-yellow-400">else</span>{" "}
                      <span className="text-gray-500">{"{"}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-success-light">console</span>
                      <span className="text-gray-400">.</span>
                      <span className="text-success-light">log</span>
                      <span className="text-gray-300">(</span>
                      <span className="text-green-400">&quot;small&quot;</span>
                      <span className="text-gray-300">)</span>
                      <span className="text-gray-500">;</span>
                    </div>
                    <div>
                      <span className="text-gray-500">{"}"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualization side */}
              <div className="p-6 flex flex-col gap-4">
                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-primary-light font-mono">
                    Step 3: Evaluate Condition
                  </span>
                </div>

                {/* Memory */}
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-gray-600 mb-2">Memory</p>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-gray-300 font-semibold">a</span>
                      <span className="text-xs font-mono bg-primary/10 text-primary-light border border-primary/20 px-1.5 py-0.5 rounded">
                        number
                      </span>
                    </div>
                    <div className="text-center py-1 rounded font-mono font-bold text-lg text-primary-light">
                      5
                    </div>
                  </div>
                </div>

                {/* Condition */}
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-3">
                  <p className="text-xs text-gray-600 mb-2">Condition</p>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="rounded-lg border border-border bg-background px-3 py-2 text-center">
                      <p className="text-xs text-gray-500">Left</p>
                      <p className="font-mono font-bold text-primary-light">5</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <span className="text-accent-light font-mono text-xs font-bold">&gt;</span>
                    </div>
                    <div className="rounded-lg border border-border bg-background px-3 py-2 text-center">
                      <p className="text-xs text-gray-500">Right</p>
                      <p className="font-mono font-bold text-primary-light">3</p>
                    </div>
                  </div>
                  <div className="mt-2 rounded-lg bg-success/10 border border-success/30 py-1.5 text-center">
                    <span className="text-success font-black font-mono">TRUE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Everything you need to
            <span className="text-primary-light"> understand JS</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Watch your code execute one step at a time, with full context of
            what&apos;s happening and why.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-2xl border border-border bg-surface p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feature.iconBg} group-hover:scale-110 transition-transform duration-200`}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            How it works
          </h2>
          <p className="text-gray-400">Three simple steps to understand your code</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 hidden md:block" />

          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4 relative z-10">
                <span className="text-2xl font-black text-primary-light font-mono">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/5 pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative">
            Start learning JavaScript<br />the right way
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto relative">
            Open the playground now and watch your code come to life, one step
            at a time.
          </p>
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-base transition-all duration-200 shadow-glow hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] relative"
          >
            Open Playground
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Code2 size={10} className="text-white" />
            </div>
            <span className="font-bold text-sm text-gray-400 font-mono">
              LogicJS
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Built for JavaScript learners everywhere
          </p>
        </div>
      </footer>
    </main>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    title: "Step-by-step execution",
    description:
      "Walk through code one statement at a time. Go forward, backward, or jump to any step.",
    icon: <Cpu size={20} className="text-primary-light" />,
    iconBg: "bg-primary/10 border border-primary/20",
  },
  {
    title: "Memory visualization",
    description:
      "See variables appear in memory, their values, and types. Watch them update in real time.",
    icon: <Variable size={20} className="text-accent-light" />,
    iconBg: "bg-accent/10 border border-accent/20",
  },
  {
    title: "Condition evaluation",
    description:
      "Understand how if/else conditions work. See left/right values and the final TRUE/FALSE result.",
    icon: <GitBranch size={20} className="text-success-light" />,
    iconBg: "bg-success/10 border border-success/20",
  },
  {
    title: "Flow diagrams",
    description:
      "Visual flow charts show which branch was taken. Skipped paths are clearly marked.",
    icon: <Eye size={20} className="text-primary-light" />,
    iconBg: "bg-primary/10 border border-primary/20",
  },
  {
    title: "Console output",
    description:
      "See console.log output appear exactly when each call executes, with live updates.",
    icon: <Terminal size={20} className="text-success-light" />,
    iconBg: "bg-success/10 border border-success/20",
  },
  {
    title: "Human explanations",
    description:
      "Every step comes with a plain-English explanation of what JavaScript is doing and why.",
    icon: <BookOpen size={20} className="text-accent-light" />,
    iconBg: "bg-accent/10 border border-accent/20",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Write your code",
    description:
      "Type JavaScript in the Monaco editor. Use the built-in presets or write your own.",
  },
  {
    title: "Click Run",
    description:
      "LogicJS parses your code with Babel and builds an execution timeline instantly.",
  },
  {
    title: "Step through it",
    description:
      "Use the controls to walk step by step. Read explanations and watch the visualizer update.",
  },
];
