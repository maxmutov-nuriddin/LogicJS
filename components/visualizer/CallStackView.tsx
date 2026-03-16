"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";

interface CallStackViewProps {
  stack: string[];
}

export function CallStackView({ stack }: CallStackViewProps) {
  if (stack.length === 0) return null;

  const reversed = [...stack].reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Layers size={13} className="text-purple-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Funksiya steki
        </span>
        <span className="ml-auto text-xs text-gray-600 font-mono">{stack.length} ta</span>
      </div>

      {/* Stack tower */}
      <div className="flex flex-col gap-0.5">
        {/* Active function at top */}
        {reversed.map((fn, i) => (
          <motion.div
            key={`${fn}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border font-mono text-sm ${
              i === 0
                ? "border-purple-500/50 bg-purple-500/15 text-purple-200 font-bold shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                : "border-purple-500/15 bg-purple-500/5 text-gray-400"
            }`}
            style={{
              marginLeft: `${i * 8}px`,
            }}
          >
            {/* Stack level indicator */}
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
              i === 0
                ? "bg-purple-500/30 text-purple-300"
                : "bg-surface-2 text-gray-600"
            }`}>
              {stack.length - i}
            </div>
            <span>{fn}()</span>
            {i === 0 && (
              <span className="ml-auto text-[10px] text-purple-500 font-normal bg-purple-500/15 px-1.5 py-0.5 rounded-md">
                ← hozir shu yerda
              </span>
            )}
          </motion.div>
        ))}

        {/* Global scope */}
        <div
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-border bg-background/50 font-mono text-xs text-gray-600"
          style={{ marginLeft: `${reversed.length * 8}px` }}
        >
          <div className="w-5 h-5 rounded-md bg-surface-2 flex items-center justify-center text-[10px] text-gray-700 shrink-0">
            0
          </div>
          <span>(global scope)</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-lg bg-surface-2 border border-border px-3 py-2">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="text-purple-400 font-semibold">{stack[stack.length - 1]}()</span>{" "}
          funksiyasi ichida ishlamoqda. Tugagach, yuqoridagi funksiyaga qaytadi.
        </p>
      </div>
    </motion.div>
  );
}
