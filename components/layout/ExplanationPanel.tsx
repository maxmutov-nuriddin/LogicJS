"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Variable, GitBranch, Terminal, Play, ArrowRight,
  SkipForward, Square, Repeat, CircleDot, FunctionSquare,
  ChevronRight, AlertTriangle, RefreshCw, MapPin, ArrowDown,
  CheckCircle2, XCircle, HelpCircle, Zap,
} from "lucide-react";
import { usePlaygroundStore, useLangStore } from "@/app/playground/store";
import type { ExecutionStep } from "@/lib/types";
import { formatValue } from "@/lib/engine/executor";
import { UI } from "@/lib/i18n/ui";
import type { UITranslations } from "@/lib/i18n/ui";

// ─── Step metadata helpers ─────────────────────────────────────────────────────

function getStepTypeLabel(step: ExecutionStep, t: UITranslations): string {
  switch (step.type) {
    case "program-start":    return t.stepType_program_start;
    case "program-end":      return t.stepType_program_end;
    case "declare-variable": return t.stepType_declare_variable;
    case "assign-variable":  return t.stepType_assign_variable;
    case "update-variable":  return t.stepType_update_variable;
    case "evaluate-condition": return t.stepType_evaluate_condition;
    case "enter-if-branch":  return step.branch === "if" ? t.stepType_enter_if : t.stepType_enter_else;
    case "skip-branch":      return step.branch === "if" ? t.stepType_skip_if : t.stepType_skip_else;
    case "console-output":   return t.stepType_console_output;
    case "loop-iteration":   return t.stepType_loop_iteration(step.iteration);
    case "loop-condition":   return t.stepType_loop_condition;
    case "loop-end":         return t.stepType_loop_end;
    case "function-declare": return t.stepType_function_declare;
    case "function-call":    return t.stepType_function_call(step.name);
    case "function-return":  return t.stepType_function_return(step.name);
    case "step-limit":       return t.stepType_step_limit;
  }
}

function getStepIcon(step: ExecutionStep, size = 15) {
  switch (step.type) {
    case "program-start":
    case "program-end":      return <Play size={size} />;
    case "declare-variable":
    case "assign-variable":
    case "update-variable":  return <Variable size={size} />;
    case "evaluate-condition": return <GitBranch size={size} />;
    case "enter-if-branch":  return <ArrowRight size={size} />;
    case "skip-branch":      return <SkipForward size={size} />;
    case "console-output":   return <Terminal size={size} />;
    case "loop-iteration":   return <Repeat size={size} />;
    case "loop-condition":   return <CircleDot size={size} />;
    case "loop-end":         return <RefreshCw size={size} />;
    case "function-declare": return <FunctionSquare size={size} />;
    case "function-call":    return <ChevronRight size={size} />;
    case "function-return":  return <ArrowRight size={size} className="rotate-180" />;
    case "step-limit":       return <AlertTriangle size={size} />;
    default:                 return <Square size={size} />;
  }
}

function getStepColor(step: ExecutionStep) {
  switch (step.type) {
    case "declare-variable":
    case "assign-variable":
    case "update-variable":  return { badge: "text-primary-light bg-primary/15 border-primary/30", accent: "border-primary/30 bg-primary/5" };
    case "evaluate-condition":
    case "loop-condition":   return { badge: "text-accent-light bg-accent/15 border-accent/30", accent: "border-accent/30 bg-accent/5" };
    case "enter-if-branch":
    case "loop-iteration":
    case "console-output":   return { badge: "text-success-light bg-success/15 border-success/30", accent: "border-success/30 bg-success/5" };
    case "skip-branch":      return { badge: "text-error-light bg-error/15 border-error/30", accent: "border-error/30 bg-error/5" };
    case "function-declare":
    case "function-call":
    case "function-return":  return { badge: "text-purple-400 bg-purple-500/15 border-purple-500/30", accent: "border-purple-500/30 bg-purple-500/5" };
    case "loop-end":         return { badge: "text-gray-400 bg-surface-2 border-border", accent: "border-border bg-surface-2" };
    case "step-limit":       return { badge: "text-error-light bg-error/15 border-error/30", accent: "border-error/30 bg-error/5" };
    default:                 return { badge: "text-primary-light bg-primary/15 border-primary/30", accent: "border-primary/30 bg-primary/5" };
  }
}

// ─── Visual result card per step type ────────────────────────────────────────

function VisualResult({ step }: { step: ExecutionStep }) {
  switch (step.type) {
    // Variable: show before → after
    case "declare-variable":
    case "assign-variable": {
      const hasOld = step.type === "assign-variable" && step.oldValue !== undefined;
      return (
        <div className="flex items-center gap-2 mt-1">
          {hasOld && step.type === "assign-variable" ? (
            <>
              <div className="flex-1 rounded-lg border border-border bg-background p-2.5 text-center">
                <div className="text-[10px] text-gray-600 mb-1 uppercase tracking-wider">Avval</div>
                <div className="font-mono text-sm text-error-light line-through">{formatValue(step.oldValue)}</div>
              </div>
              <ArrowRight size={18} className="text-gray-600 shrink-0" />
              <div className="flex-1 rounded-lg border border-success/30 bg-success/5 p-2.5 text-center">
                <div className="text-[10px] text-success-light mb-1 uppercase tracking-wider">Yangi</div>
                <div className="font-mono text-sm text-success-light font-bold">{formatValue(step.value)}</div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <div className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-primary-light font-bold">
                {step.name}
              </div>
              <span className="text-gray-500">=</span>
              <div className="rounded-lg border border-success/30 bg-success/5 px-3 py-2 font-mono text-sm text-success-light font-bold">
                {formatValue(step.value)}
              </div>
              <span className="text-xs text-gray-600 ml-auto">({typeof step.value === "object" && Array.isArray(step.value) ? "array" : typeof step.value})</span>
            </div>
          )}
        </div>
      );
    }

    case "update-variable":
      return (
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 rounded-lg border border-border bg-background p-2.5 text-center">
            <div className="text-[10px] text-gray-600 mb-1 uppercase tracking-wider">Avval</div>
            <div className="font-mono text-sm text-error-light">{formatValue(step.oldValue)}</div>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <ArrowRight size={16} className="text-accent-light shrink-0" />
            <span className="text-[10px] text-accent-light font-mono">{step.operator}</span>
          </div>
          <div className="flex-1 rounded-lg border border-success/30 bg-success/5 p-2.5 text-center">
            <div className="text-[10px] text-success-light mb-1 uppercase tracking-wider">Keyin</div>
            <div className="font-mono text-sm text-success-light font-bold">{formatValue(step.newValue)}</div>
          </div>
        </div>
      );

    // Condition: big TRUE / FALSE badge
    case "evaluate-condition":
    case "loop-condition": {
      const isTrue = step.result;
      return (
        <div className="space-y-2 mt-1">
          {step.type === "evaluate-condition" && step.leftValue !== undefined && (
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-primary-light">
                {formatValue(step.leftValue)}
              </div>
              <span className="text-accent-light font-mono text-base font-bold">
                {step.operator}
              </span>
              <div className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-primary-light">
                {formatValue(step.rightValue)}
              </div>
            </div>
          )}
          <div className={`flex items-center justify-center gap-2 rounded-xl border py-3 font-bold text-base ${
            isTrue ? "border-success/40 bg-success/10 text-success-light" : "border-error/40 bg-error/10 text-error-light"
          }`}>
            {isTrue
              ? <><CheckCircle2 size={20} /> TRUE — if blokiga kiradi</>
              : <><XCircle size={20} /> FALSE — else blokiga o'tadi</>
            }
          </div>
        </div>
      );
    }

    // Enter/skip branch
    case "enter-if-branch": {
      const isIf = step.branch === "if";
      return (
        <div className={`flex items-center gap-3 rounded-xl border p-3 mt-1 ${isIf ? "border-success/30 bg-success/5" : "border-accent/30 bg-accent/5"}`}>
          <ArrowRight size={22} className={isIf ? "text-success-light" : "text-accent-light"} />
          <div>
            <div className={`font-bold text-sm ${isIf ? "text-success-light" : "text-accent-light"}`}>
              {isIf ? "if { ... }" : "else { ... }"} blokiga kirildi
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {isIf ? "Shart TRUE edi" : "Shart FALSE edi"}
            </div>
          </div>
        </div>
      );
    }

    case "skip-branch": {
      const isIf = step.branch === "if";
      return (
        <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error/5 p-3 mt-1">
          <SkipForward size={22} className="text-error-light" />
          <div>
            <div className="font-bold text-sm text-error-light">
              {isIf ? "if { ... }" : "else { ... }"} bloki o'tkazib yuborildi
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {isIf ? "Shart FALSE edi" : "Shart TRUE edi"}
            </div>
          </div>
        </div>
      );
    }

    // Console output
    case "console-output":
      return (
        <div className="flex items-start gap-2 rounded-xl border border-success/30 bg-success/5 p-3 mt-1 font-mono">
          <span className="text-success-light text-lg shrink-0">›</span>
          <span className="text-success-light text-sm break-all">{step.value}</span>
        </div>
      );

    // Loop iteration: counter dots
    case "loop-iteration":
      return (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 mt-1">
          <Repeat size={20} className="text-yellow-400 shrink-0" />
          <div className="flex-1">
            <div className="text-sm text-yellow-300 font-bold">{step.iteration}-chi aylanish</div>
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {Array.from({ length: Math.min(step.iteration, 20) }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === step.iteration - 1 ? "bg-yellow-400" : "bg-yellow-800"}`} />
              ))}
              {step.iteration > 20 && <span className="text-xs text-yellow-700">+{step.iteration - 20}</span>}
            </div>
          </div>
        </div>
      );

    case "loop-end":
      return (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3 mt-1">
          <RefreshCw size={20} className="text-gray-400" />
          <div>
            <div className="text-sm text-gray-300 font-bold">Tsikl tugadi</div>
            <div className="text-xs text-gray-500 mt-0.5">Jami {step.totalIterations} marta aylanildi</div>
          </div>
        </div>
      );

    // Function call: args display
    case "function-call":
      return (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3 mt-1 font-mono text-sm">
          <span className="text-purple-400 font-bold">{step.name}</span>
          <span className="text-gray-500">(</span>
          {step.args.map((a, i) => (
            <span key={i}>
              <span className="text-purple-300">{step.params[i]}</span>
              <span className="text-gray-600">=</span>
              <span className="text-success-light">{formatValue(a)}</span>
              {i < step.args.length - 1 && <span className="text-gray-500">, </span>}
            </span>
          ))}
          <span className="text-gray-500">)</span>
        </div>
      );

    case "function-return":
      return (
        <div className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/5 p-3 mt-1">
          <ArrowRight size={18} className="text-purple-400 rotate-180 shrink-0" />
          <div className="font-mono text-sm">
            <span className="text-purple-400">{step.name}()</span>
            <span className="text-gray-500"> → </span>
            <span className="text-success-light font-bold">{formatValue(step.value)}</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─── Call stack ───────────────────────────────────────────────────────────────

function CallStack({ stack, t }: { stack?: string[]; t: UITranslations }) {
  if (!stack || stack.length === 0) return null;
  return (
    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3">
      <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider font-semibold">{t.callStack}</p>
      <div className="space-y-1">
        {[...stack].reverse().map((fn, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-xs font-mono text-purple-300">{fn}()</span>
            {i === 0 && <span className="text-[10px] text-gray-600 ml-auto">← hozir shu yerda</span>}
          </div>
        ))}
        <div className="flex items-center gap-2 opacity-40">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
          <span className="text-xs font-mono text-gray-500">(global)</span>
        </div>
      </div>
    </div>
  );
}

// ─── Variable memory snapshot ─────────────────────────────────────────────────

function VariableSnapshot({ state, t }: { state: ExecutionStep["state"]; t: UITranslations }) {
  const entries = Object.entries(state.variables);
  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-[10px] text-gray-600 mb-2 font-mono uppercase tracking-wider">{t.memSnapshot}</p>
      <div className="grid grid-cols-2 gap-1">
        {entries.map(([name, value]) => {
          const isChanged = state.changedVariable === name;
          return (
            <div key={name} className={`flex items-center justify-between gap-1 rounded-lg px-2 py-1 text-xs font-mono ${
              isChanged ? "bg-primary/10 border border-primary/20" : "bg-surface-2"
            }`}>
              <span className={isChanged ? "text-primary-light font-bold" : "text-gray-500"}>{name}</span>
              <span className={`truncate max-w-[60px] text-right ${isChanged ? "text-success-light font-bold" : "text-gray-300"}`}>
                {formatValue(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function ExplanationPanel() {
  const { steps, currentStepIndex, status, errorMessage } = usePlaygroundStore();
  const { lang } = useLangStore();
  const t = UI[lang];
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const nextStep = currentStepIndex >= 0 && currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  if (status === "idle") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={14} className="text-accent-light" />
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t.explanation}</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BookOpen size={24} className="text-gray-700 mx-auto mb-2" />
            <p className="text-xs text-gray-600">{t.explanationEmpty}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={14} className="text-error-light" />
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t.errorTitle}</span>
        </div>
        <div className="rounded-xl border border-error/20 bg-error/5 p-4">
          <p className="text-sm text-error-light font-mono">{errorMessage}</p>
          <p className="text-xs text-gray-500 mt-2">{t.errorHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <BookOpen size={14} className="text-accent-light" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{t.explanation}</span>
        {currentStep && (
          <span className="ml-auto text-xs text-gray-600 font-mono">
            {currentStepIndex + 1}/{steps.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence mode="wait">
          {currentStep ? (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-2.5 pb-2"
            >
              {/* ── 1. QAYSI QATOR + NIMA BO'LDI ── */}
              <div className="flex items-stretch gap-2">
                {/* Line number - big and prominent */}
                {currentStep.line > 0 && (
                  <div className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl bg-surface-2 border border-border min-w-[56px]">
                    <MapPin size={12} className="text-accent-light" />
                    <span className="text-xl font-bold text-white font-mono leading-none">{currentStep.line}</span>
                    <span className="text-[9px] text-gray-600 uppercase tracking-wider leading-none">qator</span>
                  </div>
                )}

                {/* Step type badge - what happened */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 ${getStepColor(currentStep).badge}`}>
                  <div className="shrink-0">{getStepIcon(currentStep, 18)}</div>
                  <span className="text-sm font-bold leading-snug">{getStepTypeLabel(currentStep, t)}</span>
                </div>
              </div>

              {/* ── 2. VISUAL NATIJA ── */}
              <VisualResult step={currentStep} />

              {/* ── 3. NIMA UCHUN? (explanation) ── */}
              <div className={`rounded-xl border p-3 ${getStepColor(currentStep).accent}`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <HelpCircle size={11} className="text-gray-500 shrink-0" />
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Nima uchun?</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {currentStep.explanation.split(/`([^`]+)`/).map((part, i) =>
                    i % 2 === 1 ? (
                      <code key={i} className="text-primary-light font-mono bg-primary/15 px-1.5 py-0.5 rounded text-xs">
                        {part}
                      </code>
                    ) : part
                  )}
                </p>
              </div>

              {/* ── 4. CALL STACK ── */}
              <CallStack stack={currentStep.state.callStack} t={t} />

              {/* ── 5. XOTIRA HOLATI ── */}
              <VariableSnapshot state={currentStep.state} t={t} />

              {/* ── 6. KEYINGI QADAM ── */}
              {nextStep && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-surface-2">
                  <ArrowDown size={13} className="text-gray-600 shrink-0" />
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider shrink-0">Keyingi:</span>
                    <span className="text-xs text-gray-300 font-semibold truncate">
                      {getStepTypeLabel(nextStep, t)}
                    </span>
                  </div>
                  {nextStep.line > 0 && (
                    <div className="flex items-center gap-1 shrink-0">
                      <MapPin size={10} className="text-gray-600" />
                      <span className="text-[10px] text-gray-600 font-mono">{nextStep.line}-qator</span>
                    </div>
                  )}
                </div>
              )}

              {/* ── 7. DASTUR TUGADI ── */}
              {currentStep.type === "program-end" && (
                <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-3">
                  <Zap size={20} className="text-success-light shrink-0" />
                  <div>
                    <p className="text-sm text-success-light font-bold">{t.programComplete}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.programCompleteDesc}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center">
                <Square size={24} className="text-gray-700 mx-auto mb-2" />
                <p className="text-xs text-gray-600">{t.noStepSelected}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
