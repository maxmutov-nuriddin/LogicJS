"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";

interface CallStackViewProps {
  stack: string[];
}

export function CallStackView({ stack }: CallStackViewProps) {
  if (stack.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <Layers size={14} className="text-purple-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Call Stack
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {/* Current function (top of stack) */}
        {[...stack].reverse().map((fn, i) => (
          <motion.div
            key={`${fn}-${i}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg border font-mono text-sm
              ${i === 0
                ? "border-purple-500/40 bg-purple-500/10 text-purple-300 font-bold"
                : "border-border bg-surface-2 text-gray-500"
              }
            `}
          >
            <span className="text-xs text-gray-600 w-4 text-right shrink-0">{stack.length - i}</span>
            <span>{fn}()</span>
            {i === 0 && (
              <span className="ml-auto text-xs text-purple-500 font-normal">← active</span>
            )}
          </motion.div>
        ))}

        {/* Global scope */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background/50 font-mono text-xs text-gray-600">
          <span className="w-4 text-right shrink-0">0</span>
          <span>(global scope)</span>
        </div>
      </div>
    </motion.div>
  );
}
