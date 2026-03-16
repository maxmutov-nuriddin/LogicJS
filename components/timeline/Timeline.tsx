"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Variable,
  GitBranch,
  Terminal,
  Play,
  Square,
  ArrowRight,
  SkipForward,
  RefreshCw,
  Repeat,
  CircleDot,
  FunctionSquare,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { usePlaygroundStore } from "@/app/playground/store";
import type { ExecutionStep } from "@/lib/types";

function getStepIcon(step: ExecutionStep) {
  switch (step.type) {
    case "program-start":   return <Play size={10} />;
    case "program-end":     return <Square size={10} />;
    case "declare-variable":
    case "assign-variable":
    case "update-variable": return <Variable size={10} />;
    case "evaluate-condition": return <GitBranch size={10} />;
    case "enter-if-branch": return <ArrowRight size={10} />;
    case "skip-branch":     return <SkipForward size={10} />;
    case "console-output":  return <Terminal size={10} />;
    case "loop-iteration":  return <Repeat size={10} />;
    case "loop-condition":  return <CircleDot size={10} />;
    case "loop-end":        return <RefreshCw size={10} />;
    case "function-declare":return <FunctionSquare size={10} />;
    case "function-call":   return <ChevronRight size={10} />;
    case "function-return": return <ArrowRight size={10} className="rotate-180" />;
    case "step-limit":      return <AlertTriangle size={10} />;
    default:                return <RefreshCw size={10} />;
  }
}

function getStepColor(step: ExecutionStep, isActive: boolean, isPast: boolean): string {
  const active: Record<string, string> = {
    "declare-variable":    "bg-primary border-primary text-white shadow-glow",
    "assign-variable":     "bg-primary border-primary text-white shadow-glow",
    "update-variable":     "bg-primary border-primary text-white shadow-glow",
    "evaluate-condition":  "bg-accent border-accent text-white shadow-glow-accent",
    "enter-if-branch":     "bg-success border-success text-white shadow-glow-success",
    "skip-branch":         "bg-error/80 border-error text-white",
    "console-output":      "bg-success border-success text-white shadow-glow-success",
    "loop-iteration":      "bg-yellow-500 border-yellow-400 text-black",
    "loop-condition":      "bg-accent border-accent text-white",
    "loop-end":            "bg-surface-3 border-border text-gray-300",
    "function-declare":    "bg-purple-600 border-purple-400 text-white",
    "function-call":       "bg-purple-500 border-purple-400 text-white",
    "function-return":     "bg-purple-400 border-purple-300 text-black",
    "step-limit":          "bg-error border-error text-white",
    "program-start":       "bg-primary border-primary text-white",
    "program-end":         "bg-primary border-primary text-white",
  };

  const inactive: Record<string, string> = {
    "declare-variable":    "bg-primary/10 border-primary/30 text-primary-light",
    "assign-variable":     "bg-primary/10 border-primary/30 text-primary-light",
    "update-variable":     "bg-primary/10 border-primary/30 text-primary-light",
    "evaluate-condition":  "bg-accent/10 border-accent/30 text-accent-light",
    "enter-if-branch":     "bg-success/10 border-success/30 text-success-light",
    "skip-branch":         "bg-error/10 border-error/30 text-error-light",
    "console-output":      "bg-success/10 border-success/30 text-success-light",
    "loop-iteration":      "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    "loop-condition":      "bg-accent/10 border-accent/30 text-accent-light",
    "loop-end":            "bg-surface-2 border-border text-gray-500",
    "function-declare":    "bg-purple-500/10 border-purple-500/30 text-purple-400",
    "function-call":       "bg-purple-500/10 border-purple-500/30 text-purple-400",
    "function-return":     "bg-purple-500/10 border-purple-500/30 text-purple-400",
    "step-limit":          "bg-error/10 border-error/30 text-error-light",
    "program-start":       "bg-primary/10 border-primary/30 text-primary-light",
    "program-end":         "bg-primary/10 border-primary/30 text-primary-light",
  };

  if (isActive) return active[step.type] ?? "bg-primary border-primary text-white";
  const base = inactive[step.type] ?? "bg-surface-2 border-border text-gray-500";
  return isPast ? `${base} opacity-60` : base;
}

function getStepLabel(step: ExecutionStep): string {
  switch (step.type) {
    case "program-start":    return "Start";
    case "program-end":      return "End";
    case "declare-variable": return `let ${step.name}`;
    case "assign-variable":  return `${step.name} =`;
    case "update-variable":  return `${step.name}${step.operator}`;
    case "evaluate-condition": return `if (…)`;
    case "enter-if-branch":  return `→ ${step.branch}`;
    case "skip-branch":      return `skip ${step.branch}`;
    case "console-output":   return `log`;
    case "loop-iteration":   return `#${step.iteration}`;
    case "loop-condition":   return step.result ? "✓ cond" : "✗ cond";
    case "loop-end":         return `loop end`;
    case "function-declare": return `fn ${step.name}`;
    case "function-call":    return `${step.name}()`;
    case "function-return":  return `return`;
    case "step-limit":       return `limit!`;
    default:                 return "step";
  }
}

export function Timeline() {
  const { steps, currentStepIndex, goToStep, isAutoPlaying } = usePlaygroundStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [currentStepIndex]);

  if (steps.length === 0) {
    return (
      <div className="flex items-center gap-3 px-4 h-full">
        <span className="text-xs text-gray-600 font-mono">
          Timeline will appear after running code
        </span>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-1.5 overflow-x-auto pb-1 h-full px-2"
      style={{ scrollbarWidth: "thin" }}
    >
      <AnimatePresence initial={false}>
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(index * 0.015, 0.3), duration: 0.2 }}
              className="flex items-center gap-0 shrink-0"
            >
              {/* Connector */}
              {index > 0 && (
                <div
                  className={`w-3 h-px shrink-0 transition-colors duration-300 ${
                    isPast || isActive ? "bg-primary/40" : "bg-border"
                  }`}
                />
              )}

              {/* Step button */}
              <button
                ref={isActive ? activeRef : undefined}
                onClick={() => !isAutoPlaying && goToStep(index)}
                disabled={isAutoPlaying}
                title={`Step ${index + 1}: ${getStepLabel(step)} (line ${step.line})`}
                className={`
                  flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border
                  transition-all duration-200 cursor-pointer min-w-[52px]
                  disabled:cursor-default text-center
                  ${getStepColor(step, isActive, isPast)}
                  ${!isActive && !isAutoPlaying ? "hover:opacity-90 hover:scale-105" : ""}
                  ${isActive ? "scale-105" : ""}
                `}
              >
                <div className="shrink-0">{getStepIcon(step)}</div>
                <span className="text-[10px] font-mono leading-tight max-w-[50px] truncate block">
                  {getStepLabel(step)}
                </span>
                {step.line > 0 && (
                  <span className="text-[9px] opacity-60">L{step.line}</span>
                )}
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
