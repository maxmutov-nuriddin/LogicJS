"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Play, Repeat, FunctionSquare } from "lucide-react";
import { usePlaygroundStore } from "@/app/playground/store";
import { VariableView } from "./VariableView";
import { ConditionView } from "./ConditionView";
import { FlowView } from "./FlowView";
import { ConsoleOutput } from "./ConsoleOutput";
import { LoopView } from "./LoopView";
import { CallStackView } from "./CallStackView";

export function MainVisualizer() {
  const { steps, currentStepIndex, status } = usePlaygroundStore();
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const state = currentStep?.state ?? null;

  const showCondition = !!state?.activeCondition;
  const showFlow = !!state?.activeCondition || !!state?.activeBranch;
  const showLoop = !!state?.loopInfo;
  const showCallStack = (state?.callStack?.length ?? 0) > 0;

  if (status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Cpu size={28} className="text-primary-light" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-300 mb-1">Ready to visualize</h3>
          <p className="text-sm text-gray-600 max-w-[200px] leading-relaxed">
            Write your code and click <span className="text-primary-light font-medium">Run</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border">
          <Play size={12} className="text-primary-light" />
          <span className="text-xs text-gray-500">Supports loops, functions, arrays, objects…</span>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStepIndex}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="flex flex-col gap-3 h-full overflow-y-auto"
      >
        {/* Memory */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <VariableView state={state} />
        </div>

        {/* Call stack (when inside a function) */}
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

        {/* Loop iteration badge */}
        {showLoop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
              <Repeat size={16} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Loop iteration</p>
              <p className="text-lg font-black font-mono text-yellow-300">
                #{state?.loopInfo?.iteration}
              </p>
            </div>
          </motion.div>
        )}

        {/* Condition evaluation */}
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

        {/* If/else flow diagram */}
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

        {/* Function info when in step-limit or function steps */}
        {currentStep?.type === "function-call" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 flex items-center gap-3"
          >
            <FunctionSquare size={18} className="text-purple-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Entering function</p>
              <p className="text-sm font-bold font-mono text-purple-300">
                {currentStep.name}({currentStep.args.map((a, i) => `${currentStep.params[i] ?? "arg"}=${JSON.stringify(a)}`).join(", ")})
              </p>
            </div>
          </motion.div>
        )}

        {/* Console output */}
        {(state?.consoleOutput?.length ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <ConsoleOutput output={state?.consoleOutput ?? []} />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
