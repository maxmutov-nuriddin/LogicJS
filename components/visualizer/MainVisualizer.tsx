"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, Play, Variable, GitBranch, Repeat, FunctionSquare,
  Terminal, ArrowRight, SkipForward, RefreshCw, CircleDot,
} from "lucide-react";
import { usePlaygroundStore } from "@/app/playground/store";
import { VariableView } from "./VariableView";
import { ConditionView } from "./ConditionView";
import { FlowView } from "./FlowView";
import { ConsoleOutput } from "./ConsoleOutput";
import { LoopView } from "./LoopView";
import { CallStackView } from "./CallStackView";
import type { ExecutionStep } from "@/lib/types";
import { formatValue } from "@/lib/engine/executor";

// ─── Activity banner ───────────────────────────────────────────────────────────

interface BannerConfig {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  colors: string;
}

function getActivityBanner(step: ExecutionStep | null): BannerConfig | null {
  if (!step) return null;
  switch (step.type) {
    case "program-start":
      return { icon: <Play size={16} />, title: "Dastur boshlandi", subtitle: "JavaScript kodni yuqoridan pastga o'qiydi", colors: "border-blue-500/30 bg-blue-500/8 text-blue-400" };
    case "program-end":
      return { icon: <Play size={16} />, title: "Dastur tugadi", subtitle: "Barcha buyruqlar bajarildi", colors: "border-blue-500/30 bg-blue-500/8 text-blue-400" };
    case "declare-variable":
      return { icon: <Variable size={16} />, title: `${step.name} yaratildi`, subtitle: `Xotiraga "${step.name}" nomi bilan joy ajratildi = ${formatValue(step.value)}`, colors: "border-primary/30 bg-primary/8 text-primary-light" };
    case "assign-variable":
      return { icon: <Variable size={16} />, title: `${step.name} yangilandi`, subtitle: `${formatValue(step.oldValue)} → ${formatValue(step.value)}`, colors: "border-primary/30 bg-primary/8 text-primary-light" };
    case "update-variable":
      return { icon: <Variable size={16} />, title: `${step.name}${step.operator}`, subtitle: `${formatValue(step.oldValue)} → ${formatValue(step.newValue)}`, colors: "border-primary/30 bg-primary/8 text-primary-light" };
    case "evaluate-condition":
      return { icon: <GitBranch size={16} />, title: "Shart tekshirildi", subtitle: `"${step.expression}" → ${step.result ? "TRUE ✓" : "FALSE ✗"}`, colors: "border-accent/30 bg-accent/8 text-accent-light" };
    case "loop-condition":
      return { icon: <CircleDot size={16} />, title: "Tsikl sharti", subtitle: `"${step.expression}" → ${step.result ? "TRUE — davom etadi" : "FALSE — to'xtaydi"}`, colors: "border-yellow-500/30 bg-yellow-500/8 text-yellow-400" };
    case "enter-if-branch":
      return { icon: <ArrowRight size={16} />, title: step.branch === "if" ? "if blokiga kirdi" : "else blokiga kirdi", subtitle: step.branch === "if" ? "Shart TRUE edi, shuning uchun if { } bajariladi" : "Shart FALSE edi, shuning uchun else { } bajariladi", colors: "border-emerald-500/30 bg-emerald-500/8 text-emerald-400" };
    case "skip-branch":
      return { icon: <SkipForward size={16} />, title: step.branch === "if" ? "if bloki o'tkazib yuborildi" : "else bloki o'tkazib yuborildi", subtitle: step.branch === "if" ? "Shart FALSE edi" : "Shart TRUE edi", colors: "border-rose-500/30 bg-rose-500/8 text-rose-400" };
    case "loop-iteration":
      return { icon: <Repeat size={16} />, title: `${step.iteration}-chi aylanish`, subtitle: `${step.loopType} tsikli davom etmoqda`, colors: "border-yellow-500/30 bg-yellow-500/8 text-yellow-400" };
    case "loop-end":
      return { icon: <RefreshCw size={16} />, title: "Tsikl tugadi", subtitle: `Jami ${step.totalIterations} marta aylanildi`, colors: "border-gray-500/30 bg-gray-500/8 text-gray-400" };
    case "function-declare":
      return { icon: <FunctionSquare size={16} />, title: `${step.name}() aniqlandi`, subtitle: "Funksiya eslab qolindi, chaqirilganda ishlaydi", colors: "border-purple-500/30 bg-purple-500/8 text-purple-400" };
    case "function-call":
      return { icon: <FunctionSquare size={16} />, title: `${step.name}() chaqirildi`, subtitle: `${step.args.length > 0 ? `Argumentlar: ${step.args.map((a, i) => `${step.params[i] ?? "arg"}=${formatValue(a)}`).join(", ")  }` : "Argumentsiz chaqirildi"}`, colors: "border-purple-500/30 bg-purple-500/8 text-purple-400" };
    case "function-return":
      return { icon: <FunctionSquare size={16} />, title: `${step.name}() qaytdi`, subtitle: `Qaytgan qiymat: ${formatValue(step.value)}`, colors: "border-purple-500/30 bg-purple-500/8 text-purple-400" };
    case "console-output":
      return { icon: <Terminal size={16} />, title: "console.log chaqirildi", subtitle: `Ekranga chiqarildi: ${step.value.length > 40 ? step.value.slice(0, 40) + "…" : step.value}`, colors: "border-emerald-500/30 bg-emerald-500/8 text-emerald-400" };
    default:
      return null;
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export function MainVisualizer() {
  const { steps, currentStepIndex, status } = usePlaygroundStore();
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const state = currentStep?.state ?? null;

  const showCondition = !!state?.activeCondition;
  const showFlow = !!state?.activeCondition || !!state?.activeBranch;
  const showLoop = !!state?.loopInfo;
  const showCallStack = (state?.callStack?.length ?? 0) > 0;
  const banner = getActivityBanner(currentStep);

  // Extract loop info from current step for LoopView
  const loopConditionStep = currentStep?.type === "loop-condition" ? currentStep : null;
  const loopIterationStep = currentStep?.type === "loop-iteration" ? currentStep : null;

  if (status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Cpu size={28} className="text-primary-light" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-300 mb-1">Vizualizatsiyaga tayyor</h3>
          <p className="text-sm text-gray-600 max-w-[200px] leading-relaxed">
            Kod yozing va <span className="text-primary-light font-medium">Run</span> tugmasini bosing
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border">
          <Play size={12} className="text-primary-light" />
          <span className="text-xs text-gray-500">Loop, funksiya, array, object…</span>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStepIndex}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col gap-3 h-full overflow-y-auto pb-2"
      >

        {/* ── 1. Activity banner ── */}
        <AnimatePresence mode="wait">
          {banner && (
            <motion.div
              key={currentStep?.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${banner.colors}`}
            >
              <div className="mt-0.5 shrink-0">{banner.icon}</div>
              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight">{banner.title}</p>
                <p className="text-xs opacity-70 mt-0.5 leading-snug break-words">{banner.subtitle}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 2. Variables (memory) ── */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <VariableView state={state} />
        </div>

        {/* ── 3. Loop progress ── */}
        <AnimatePresence>
          {(showLoop || loopConditionStep || loopIterationStep) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-yellow-500/20 bg-surface p-4"
            >
              <LoopView
                iteration={
                  loopConditionStep?.iteration ??
                  loopIterationStep?.iteration ??
                  state?.loopInfo?.iteration ?? 0
                }
                loopType={loopIterationStep?.loopType ?? "for"}
                expression={loopConditionStep?.expression}
                conditionResult={loopConditionStep?.result}
                variables={state?.variables}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 4. Condition breakdown ── */}
        <AnimatePresence>
          {showCondition && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-accent/20 bg-surface p-4"
            >
              <ConditionView condition={state?.activeCondition} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 5. If/else flow diagram ── */}
        <AnimatePresence>
          {showFlow && !showLoop && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <FlowView state={state} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 6. Call stack ── */}
        <AnimatePresence>
          {showCallStack && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-purple-500/20 bg-surface p-4"
            >
              <CallStackView stack={state?.callStack ?? []} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 7. Console output ── */}
        <AnimatePresence>
          {(state?.consoleOutput?.length ?? 0) > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <ConsoleOutput output={state?.consoleOutput ?? []} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
