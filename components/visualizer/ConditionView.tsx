"use client";

import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import type { ConditionSnapshot } from "@/lib/types";

interface ConditionViewProps {
  condition: ConditionSnapshot | null | undefined;
}

function formatValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

const OPERATOR_LABELS: Record<string, string> = {
  ">": "greater than",
  "<": "less than",
  ">=": "greater than or equal to",
  "<=": "less than or equal to",
  "===": "strictly equal to",
  "!==": "not equal to",
  "==": "equal to",
  "!=": "not equal to",
  "&&": "AND",
  "||": "OR",
};

export function ConditionView({ condition }: ConditionViewProps) {
  if (!condition) return null;

  const hasValues =
    condition.leftValue !== undefined && condition.rightValue !== undefined;
  const resultColor = condition.result ? "text-success" : "text-error";
  const resultBg = condition.result
    ? "bg-success/10 border-success/30"
    : "bg-error/10 border-error/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <GitBranch size={14} className="text-accent-light" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Condition
        </span>
      </div>

      {/* Expression display */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
        <p className="text-xs text-gray-500 mb-2">Expression</p>
        <code className="text-accent-light font-mono text-base font-bold">
          {condition.expression}
        </code>
      </div>

      {/* Value breakdown */}
      {hasValues && (
        <div className="flex items-center gap-2">
          {/* Left value */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 text-center rounded-lg border border-border bg-surface-2 py-3 px-2"
          >
            <p className="text-xs text-gray-500 mb-1">Left</p>
            <p className="text-lg font-bold font-mono text-primary-light">
              {formatValue(condition.leftValue)}
            </p>
          </motion.div>

          {/* Operator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-accent-light font-mono font-bold text-sm">
                {condition.operator}
              </span>
            </div>
            <span className="text-xs text-gray-600 text-center max-w-16 leading-tight">
              {OPERATOR_LABELS[condition.operator] ?? condition.operator}
            </span>
          </motion.div>

          {/* Right value */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 text-center rounded-lg border border-border bg-surface-2 py-3 px-2"
          >
            <p className="text-xs text-gray-500 mb-1">Right</p>
            <p className="text-lg font-bold font-mono text-primary-light">
              {formatValue(condition.rightValue)}
            </p>
          </motion.div>
        </div>
      )}

      {/* Result */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, type: "spring", stiffness: 300 }}
        className={`rounded-xl border p-4 text-center ${resultBg}`}
      >
        <p className="text-xs text-gray-500 mb-1">Result</p>
        <p className={`text-2xl font-black font-mono tracking-wide ${resultColor}`}>
          {condition.result ? "TRUE" : "FALSE"}
        </p>
      </motion.div>
    </motion.div>
  );
}
