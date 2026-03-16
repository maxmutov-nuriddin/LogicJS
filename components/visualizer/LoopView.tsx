"use client";

import { motion } from "framer-motion";
import { Repeat } from "lucide-react";

interface LoopViewProps {
  iteration: number;
  loopType?: string;
  expression?: string;
  conditionResult?: boolean;
}

export function LoopView({ iteration, loopType = "for", expression, conditionResult }: LoopViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <Repeat size={14} className="text-yellow-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {loopType} Loop
        </span>
      </div>

      {/* Iteration counter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Iteration</p>
          <p className="text-4xl font-black font-mono text-yellow-300">{iteration}</p>
        </div>

        {/* Dots representing iterations */}
        <div className="flex flex-col gap-1">
          {Array.from({ length: Math.min(iteration, 10) }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`w-2 h-2 rounded-full ${
                i === iteration - 1
                  ? "bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.6)]"
                  : "bg-yellow-600/40"
              }`}
            />
          ))}
          {iteration > 10 && (
            <div className="text-xs text-gray-600 font-mono">+{iteration - 10}</div>
          )}
        </div>
      </div>

      {/* Condition */}
      {expression !== undefined && conditionResult !== undefined && (
        <div className={`rounded-xl border p-3 text-center ${
          conditionResult
            ? "border-success/30 bg-success/5"
            : "border-error/30 bg-error/5"
        }`}>
          <code className="text-xs font-mono text-accent-light">{expression}</code>
          <p className={`text-lg font-black font-mono mt-1 ${
            conditionResult ? "text-success" : "text-error"
          }`}>
            {conditionResult ? "TRUE — continue" : "FALSE — stop loop"}
          </p>
        </div>
      )}
    </motion.div>
  );
}
