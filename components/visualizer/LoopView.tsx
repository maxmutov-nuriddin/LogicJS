"use client";

import { motion } from "framer-motion";
import { Repeat, CheckCircle2, XCircle } from "lucide-react";

interface LoopViewProps {
  iteration: number;
  loopType?: string;
  expression?: string;
  conditionResult?: boolean;
  variables?: Record<string, unknown>;
}

function fmtVal(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undef";
  if (typeof value === "string") {
    const s = `"${value}"`;
    return s.length > 14 ? s.slice(0, 13) + '…"' : s;
  }
  if (Array.isArray(value)) return `[${value.length} ta]`;
  if (typeof value === "object") return `{…}`;
  return String(value);
}

function getVarColor(value: unknown): string {
  if (typeof value === "number") return "text-blue-300";
  if (typeof value === "string") return "text-green-300";
  if (typeof value === "boolean") return value ? "text-emerald-300" : "text-rose-300";
  if (Array.isArray(value)) return "text-orange-300";
  if (typeof value === "object") return "text-violet-300";
  return "text-gray-300";
}

export function LoopView({
  iteration,
  loopType = "for",
  expression,
  conditionResult,
  variables,
}: LoopViewProps) {
  const MAX_DOTS = 15;
  const dots = Math.min(iteration, MAX_DOTS);
  const extra = iteration > MAX_DOTS ? iteration - MAX_DOTS : 0;

  const loopLabel: Record<string, string> = {
    for: "for",
    while: "while",
    "do-while": "do-while",
    "for-of": "for-of",
    "for-in": "for-in",
  };

  // Show only simple variables (skip functions and complex objects without length)
  const loopVars = variables
    ? Object.entries(variables).filter(([, v]) => {
        if (typeof v === "function") return false;
        if (Array.isArray(v)) return false;
        if (typeof v === "object" && v !== null) return false;
        return true;
      })
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Repeat size={13} className="text-yellow-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {loopLabel[loopType] ?? loopType} tsikli
        </span>
      </div>

      {/* Iteration counter + dots */}
      <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/5 p-4">
        <div className="flex items-start gap-4">
          {/* Big number */}
          <div className="text-center shrink-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Aylanish</p>
            <motion.p
              key={iteration}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="text-5xl font-black font-mono text-yellow-300 leading-none"
            >
              {iteration}
            </motion.p>
          </div>

          {/* Dot progress + vars */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-600 mb-1.5">Bajarilgan aylanishlar:</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Array.from({ length: dots }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: Math.min(i * 0.04, 0.3),
                    type: "spring",
                    stiffness: 400,
                  }}
                  className={`w-3 h-3 rounded-full ${
                    i === dots - 1
                      ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.7)]"
                      : "bg-yellow-700/60"
                  }`}
                />
              ))}
              {extra > 0 && (
                <div className="flex items-center">
                  <span className="text-xs text-yellow-700 font-mono">+{extra}</span>
                </div>
              )}
            </div>

            {/* Current variable values */}
            {loopVars.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-600 mb-1">O'zgaruvchilar holati:</p>
                <div className="flex flex-wrap gap-1.5">
                  {loopVars.map(([name, value]) => (
                    <motion.div
                      key={name}
                      layout
                      className="flex items-center gap-1 rounded-md border border-yellow-500/20 bg-yellow-500/5 px-2 py-1"
                    >
                      <span className="text-yellow-500 font-mono text-xs font-bold">{name}</span>
                      <span className="text-gray-500 text-xs">=</span>
                      <motion.span
                        key={`${name}-${String(value)}`}
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className={`font-mono text-xs font-bold ${getVarColor(value)}`}
                      >
                        {fmtVal(value)}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Condition result */}
      {expression !== undefined && conditionResult !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl border p-3 flex items-center gap-3 ${
            conditionResult
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-rose-500/30 bg-rose-500/5"
          }`}
        >
          {conditionResult ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <XCircle size={18} className="text-rose-400 shrink-0" />
          )}
          <div>
            <code className="text-xs font-mono text-accent-light">{expression}</code>
            <p
              className={`text-sm font-bold mt-0.5 ${
                conditionResult ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {conditionResult ? "TRUE — tsikl davom etadi" : "FALSE — tsikl to'xtaydi"}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
