"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Variable, GitBranch, Terminal, Play, ArrowRight,
  SkipForward, Square, Repeat, CircleDot, FunctionSquare,
  ChevronRight, AlertTriangle, RefreshCw,
} from "lucide-react";
import { usePlaygroundStore, useLangStore } from "@/app/playground/store";
import type { ExecutionStep } from "@/lib/types";
import { formatValue } from "@/lib/engine/executor";
import { UI } from "@/lib/i18n/ui";
import type { UITranslations } from "@/lib/i18n/ui";

// ─── Metadata helpers ─────────────────────────────────────────────────────────

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

function getStepIcon(step: ExecutionStep) {
  switch (step.type) {
    case "program-start":
    case "program-end":      return <Play size={15} />;
    case "declare-variable":
    case "assign-variable":
    case "update-variable":  return <Variable size={15} />;
    case "evaluate-condition": return <GitBranch size={15} />;
    case "enter-if-branch":  return <ArrowRight size={15} />;
    case "skip-branch":      return <SkipForward size={15} />;
    case "console-output":   return <Terminal size={15} />;
    case "loop-iteration":   return <Repeat size={15} />;
    case "loop-condition":   return <CircleDot size={15} />;
    case "loop-end":         return <RefreshCw size={15} />;
    case "function-declare": return <FunctionSquare size={15} />;
    case "function-call":    return <ChevronRight size={15} />;
    case "function-return":  return <ArrowRight size={15} className="rotate-180" />;
    case "step-limit":       return <AlertTriangle size={15} />;
    default:                 return <Square size={15} />;
  }
}

function getStepColor(step: ExecutionStep): string {
  switch (step.type) {
    case "declare-variable":
    case "assign-variable":
    case "update-variable":  return "text-primary-light bg-primary/10 border-primary/20";
    case "evaluate-condition":
    case "loop-condition":   return "text-accent-light bg-accent/10 border-accent/20";
    case "enter-if-branch":
    case "loop-iteration":
    case "console-output":   return "text-success-light bg-success/10 border-success/20";
    case "skip-branch":      return "text-error-light bg-error/10 border-error/20";
    case "function-declare":
    case "function-call":
    case "function-return":  return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    case "loop-end":         return "text-gray-400 bg-surface-2 border-border";
    case "step-limit":       return "text-error-light bg-error/10 border-error/20";
    default:                 return "text-primary-light bg-primary/10 border-primary/20";
  }
}

// ─── Step detail renderers ────────────────────────────────────────────────────

function StepDetails({ step, t }: { step: ExecutionStep; t: UITranslations }) {
  switch (step.type) {
    case "declare-variable":
    case "assign-variable": {
      const hasOld = step.type === "assign-variable" && step.oldValue !== undefined;
      return (
        <div className="rounded-lg border border-border bg-background p-3 font-mono text-sm space-y-1">
          <div><span className="text-gray-500">{t.detailName}: </span><span className="text-primary-light font-bold">{step.name}</span></div>
          {hasOld && step.type === "assign-variable" && (
            <div><span className="text-gray-500">{t.detailBefore}: </span><span className="text-error-light line-through">{formatValue(step.oldValue)}</span></div>
          )}
          <div><span className="text-gray-500">{t.detailValue}: </span><span className="text-success-light font-bold">{formatValue(step.value)}</span></div>
          <div><span className="text-gray-500">{t.detailType}: </span><span className="text-accent-light">{typeof step.value === "object" && Array.isArray(step.value) ? "array" : typeof step.value}</span></div>
        </div>
      );
    }

    case "update-variable":
      return (
        <div className="rounded-lg border border-border bg-background p-3 font-mono text-sm space-y-1">
          <div><span className="text-gray-500">{t.detailName}: </span><span className="text-primary-light font-bold">{step.name}</span></div>
          <div><span className="text-gray-500">{t.detailBefore}: </span><span className="text-error-light">{formatValue(step.oldValue)}</span></div>
          <div><span className="text-gray-500">{t.detailValue}: </span><span className="text-success-light font-bold">{formatValue(step.newValue)}</span></div>
          <div><span className="text-gray-500">{t.detailOp}: </span><span className="text-accent-light">{step.operator}</span></div>
        </div>
      );

    case "evaluate-condition":
    case "loop-condition":
      return (
        <div className="rounded-lg border border-border bg-background p-3 font-mono text-sm space-y-1">
          <div><span className="text-gray-500">{t.detailExpr}: </span><span className="text-accent-light font-bold">{step.expression}</span></div>
          {step.type === "evaluate-condition" && step.leftValue !== undefined && (
            <>
              <div><span className="text-gray-500">{t.condLeft}: </span><span className="text-primary-light">{formatValue(step.leftValue)}</span></div>
              <div><span className="text-gray-500">{t.condRight}: </span><span className="text-primary-light">{formatValue(step.rightValue)}</span></div>
            </>
          )}
          <div>
            <span className="text-gray-500">{t.detailResult}: </span>
            <span className={`font-bold ${step.result ? "text-success-light" : "text-error-light"}`}>
              {step.result ? "TRUE ✓" : "FALSE ✗"}
            </span>
          </div>
        </div>
      );

    case "console-output":
      return (
        <div className="rounded-lg border border-border bg-background p-3 font-mono text-sm flex items-start gap-2">
          <span className="text-success shrink-0">›</span>
          <span className="text-success-light break-all">{step.value}</span>
        </div>
      );

    case "loop-iteration":
      return (
        <div className="rounded-lg border border-border bg-background p-3 font-mono text-sm space-y-1">
          <div><span className="text-gray-500">{t.detailLoop}: </span><span className="text-yellow-400">{step.loopType}</span></div>
          <div><span className="text-gray-500">{t.detailIteration}: </span><span className="text-yellow-300 font-bold">#{step.iteration}</span></div>
        </div>
      );

    case "loop-end":
      return (
        <div className="rounded-lg border border-border bg-background p-3 font-mono text-sm space-y-1">
          <div><span className="text-gray-500">{t.detailType}: </span><span className="text-gray-300">{step.loopType}</span></div>
          <div><span className="text-gray-500">{t.detailTotalRuns}: </span><span className="text-success-light font-bold">{step.totalIterations}</span></div>
        </div>
      );

    case "function-declare":
      return (
        <div className="rounded-lg border border-border bg-background p-3 font-mono text-sm space-y-1">
          <div><span className="text-gray-500">{t.detailName}: </span><span className="text-purple-400 font-bold">{step.name}</span></div>
          <div><span className="text-gray-500">{t.detailParams}: </span>
            {step.params.length === 0
              ? <span className="text-gray-600">{t.detailNone}</span>
              : step.params.map(p => <span key={p} className="text-purple-300 mr-1">{p}</span>)
            }
          </div>
        </div>
      );

    case "function-call":
      return (
        <div className="rounded-lg border border-border bg-background p-3 font-mono text-sm space-y-1">
          <div><span className="text-gray-500">{t.detailName}: </span><span className="text-purple-400 font-bold">{step.name}()</span></div>
          {step.args.length > 0 && (
            <div>
              <span className="text-gray-500">{t.detailArgs}: </span>
              {step.args.map((a, i) => (
                <span key={i} className="text-purple-300 mr-2">{step.params[i]}={formatValue(a)}</span>
              ))}
            </div>
          )}
        </div>
      );

    case "function-return":
      return (
        <div className="rounded-lg border border-border bg-background p-3 font-mono text-sm space-y-1">
          <div><span className="text-gray-500">{t.detailFrom}: </span><span className="text-purple-400 font-bold">{step.name}()</span></div>
          <div><span className="text-gray-500">{t.detailValue}: </span><span className="text-success-light font-bold">{formatValue(step.value)}</span></div>
        </div>
      );

    default:
      return null;
  }
}

// ─── Variable snapshot sidebar ────────────────────────────────────────────────

function VariableSnapshot({ state, t }: { state: ExecutionStep["state"]; t: UITranslations }) {
  const entries = Object.entries(state.variables);
  if (entries.length === 0) return null;

  return (
    <div className="mt-3 rounded-lg border border-border bg-background p-3">
      <p className="text-xs text-gray-600 mb-2 font-mono uppercase tracking-wider">{t.memSnapshot}</p>
      <div className="space-y-1">
        {entries.map(([name, value]) => (
          <div key={name} className="flex items-center justify-between gap-2 text-xs font-mono">
            <span className={`text-gray-400 ${state.changedVariable === name ? "text-primary-light font-bold" : ""}`}>
              {name}
            </span>
            <span className={`text-right truncate max-w-[120px] ${state.changedVariable === name ? "text-success-light font-bold" : "text-gray-300"}`}>
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
      {(state.consoleOutput?.length ?? 0) > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-gray-600 mb-1">{t.consoleLines(state.consoleOutput.length)}</p>
          {state.consoleOutput.slice(-3).map((line, i) => (
            <div key={i} className="text-xs font-mono text-success-light truncate">› {line}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Call stack display ───────────────────────────────────────────────────────

function CallStack({ stack, t }: { stack?: string[]; t: UITranslations }) {
  if (!stack || stack.length === 0) return null;
  return (
    <div className="mt-2 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3">
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{t.callStack}</p>
      <div className="space-y-1">
        {[...stack].reverse().map((fn, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-purple-400" />
            <span className="text-xs font-mono text-purple-300">{fn}()</span>
            {i === 0 && <span className="text-xs text-gray-600 ml-auto">← current</span>}
          </div>
        ))}
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-1 h-1 rounded-full bg-gray-600" />
          <span className="text-xs font-mono text-gray-500">(global)</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function ExplanationPanel() {
  const { steps, currentStepIndex, status, errorMessage } = usePlaygroundStore();
  const { lang } = useLangStore();
  const t = UI[lang];
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-2.5"
            >
              {/* Step type badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit ${getStepColor(currentStep)}`}>
                {getStepIcon(currentStep)}
                <span className="text-xs font-semibold">{getStepTypeLabel(currentStep, t)}</span>
              </div>

              {/* Line number */}
              {currentStep.line > 0 && (
                <p className="text-xs text-gray-600 font-mono">Line {currentStep.line}</p>
              )}

              {/* Explanation text */}
              <div className="rounded-xl border border-border bg-surface-2 p-3">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {currentStep.explanation.split(/`([^`]+)`/).map((part, i) =>
                    i % 2 === 1 ? (
                      <code key={i} className="text-primary-light font-mono bg-primary/10 px-1.5 py-0.5 rounded text-xs">
                        {part}
                      </code>
                    ) : (part)
                  )}
                </p>
              </div>

              {/* Step-specific details */}
              <StepDetails step={currentStep} t={t} />

              {/* Call stack */}
              <CallStack stack={currentStep.state.callStack} t={t} />

              {/* Variable snapshot */}
              <VariableSnapshot state={currentStep.state} t={t} />

              {/* Next step hint */}
              {currentStepIndex < steps.length - 1 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-gray-600">
                    <span className="text-gray-500">{t.next} </span>
                    {getStepTypeLabel(steps[currentStepIndex + 1], t)}
                    {steps[currentStepIndex + 1].line > 0 && t.onLine(steps[currentStepIndex + 1].line)}
                  </p>
                </div>
              )}

              {currentStep.type === "program-end" && (
                <div className="rounded-xl border border-success/20 bg-success/5 p-3">
                  <p className="text-xs text-success-light font-semibold">{t.programComplete}</p>
                  <p className="text-xs text-gray-500 mt-1">{t.programCompleteDesc}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center">
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
