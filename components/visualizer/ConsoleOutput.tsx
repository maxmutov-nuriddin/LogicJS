"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

interface ConsoleOutputProps {
  output: string[];
}

export function ConsoleOutput({ output }: ConsoleOutputProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center gap-2">
        <Terminal size={14} className="text-success-light" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Console
        </span>
        {output.length > 0 && (
          <span className="ml-auto text-xs text-gray-600 font-mono">
            {output.length} line{output.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex-1 rounded-xl bg-background border border-border overflow-y-auto font-mono text-sm min-h-[80px]">
        {output.length === 0 ? (
          <div className="flex items-center gap-2 px-4 py-3">
            <span className="text-gray-600 text-xs">No output yet...</span>
          </div>
        ) : (
          <div className="py-2">
            <AnimatePresence mode="popLayout">
              {output.map((line, i) => (
                <motion.div
                  key={`${i}-${line}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 px-4 py-1.5 hover:bg-surface-2/50 transition-colors"
                >
                  <span className="text-success shrink-0 mt-0.5 text-xs">›</span>
                  <span className="text-success-light break-all">{line}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
