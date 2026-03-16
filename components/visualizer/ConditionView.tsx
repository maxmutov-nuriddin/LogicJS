"use client";

import { motion } from "framer-motion";
import { GitBranch, ArrowRight } from "lucide-react";
import type { ConditionSnapshot } from "@/lib/types";

interface ConditionViewProps {
  condition: ConditionSnapshot | null | undefined;
}

function fmtVal(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

// Human-readable operator label (uz)
function getOperatorSentence(left: unknown, op: string, right: unknown, result: boolean): string {
  const L = fmtVal(left);
  const R = fmtVal(right);
  const res = result ? "✅ HA" : "❌ YO'Q";
  switch (op) {
    case ">":   return `${L} kattami ${R} dan? → ${res}`;
    case "<":   return `${L} kichikmi ${R} dan? → ${res}`;
    case ">=":  return `${L} katta yoki tengmi ${R} ga? → ${res}`;
    case "<=":  return `${L} kichik yoki tengmi ${R} ga? → ${res}`;
    case "===": return `${L} aynan tengmi ${R} ga? → ${res}`;
    case "!==": return `${L} farqlimi ${R} dan? → ${res}`;
    case "==":  return `${L} tengmi ${R} ga? → ${res}`;
    case "!=":  return `${L} farqlimi ${R} dan? → ${res}`;
    case "&&":  return `${L} VA ${R} ikkalasi ham rostmi? → ${res}`;
    case "||":  return `${L} YOKI ${R} — bittasi rostmi? → ${res}`;
    default:    return `${L} ${op} ${R} → ${res}`;
  }
}

const OPERATOR_SYMBOL: Record<string, string> = {
  ">": ">",  "<": "<",  ">=": "≥",  "<=": "≤",
  "===": "≡",  "!==": "≢",  "==": "=",  "!=": "≠",
  "&&": "VA",  "||": "YOKI",
};

export function ConditionView({ condition }: ConditionViewProps) {
  if (!condition) return null;

  const hasValues = condition.leftValue !== undefined && condition.rightValue !== undefined;
  const isTrue = condition.result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <GitBranch size={13} className="text-accent-light" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Shart tekshirilmoqda
        </span>
      </div>

      {/* Expression chip */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-2.5 text-center">
        <code className="text-accent-light font-mono text-base font-bold">
          {condition.expression}
        </code>
      </div>

      {/* Left OP Right breakdown */}
      {hasValues && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-stretch gap-2"
        >
          {/* Left */}
          <div className="flex-1 rounded-xl border border-border bg-surface-2 py-3 px-2 text-center">
            <p className="text-[10px] text-gray-600 mb-1 uppercase tracking-wider">Chap</p>
            <p className="text-xl font-bold font-mono text-primary-light">
              {fmtVal(condition.leftValue)}
            </p>
          </div>

          {/* Operator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 350 }}
            className="flex flex-col items-center justify-center gap-1 px-2"
          >
            <div className="w-11 h-11 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-accent-light font-mono font-bold text-lg">
                {OPERATOR_SYMBOL[condition.operator] ?? condition.operator}
              </span>
            </div>
          </motion.div>

          {/* Right */}
          <div className="flex-1 rounded-xl border border-border bg-surface-2 py-3 px-2 text-center">
            <p className="text-[10px] text-gray-600 mb-1 uppercase tracking-wider">O'ng</p>
            <p className="text-xl font-bold font-mono text-primary-light">
              {fmtVal(condition.rightValue)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Human-readable sentence */}
      {hasValues && (
        <div className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            {getOperatorSentence(condition.leftValue, condition.operator, condition.rightValue, isTrue)}
          </p>
        </div>
      )}

      {/* Big result */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 280 }}
        className={`rounded-xl border py-4 text-center ${
          isTrue
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-rose-500/40 bg-rose-500/10"
        }`}
      >
        <p className={`text-3xl font-black font-mono tracking-widest ${
          isTrue ? "text-emerald-400" : "text-rose-400"
        }`}>
          {isTrue ? "TRUE" : "FALSE"}
        </p>
        <div className={`flex items-center justify-center gap-1.5 mt-1.5 text-xs font-semibold ${
          isTrue ? "text-emerald-500" : "text-rose-500"
        }`}>
          <ArrowRight size={12} />
          <span>{isTrue ? "if { } bloki bajariladi" : "else { } bloki bajariladi"}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
