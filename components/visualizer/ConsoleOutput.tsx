"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

interface ConsoleOutputProps {
  output: string[];
}

export function ConsoleOutput({ output }: ConsoleOutputProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Terminal size={13} className="text-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Konsol natijasi
        </span>
        {output.length > 0 && (
          <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-mono">
            {output.length} ta
          </span>
        )}
      </div>

      <div className="rounded-xl bg-[#0d1117] border border-border overflow-hidden font-mono text-sm min-h-[60px]">
        {/* Terminal titlebar */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border/50 bg-surface-2/50">
          <div className="w-2 h-2 rounded-full bg-rose-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
          <span className="ml-2 text-[10px] text-gray-600">console output</span>
        </div>

        {output.length === 0 ? (
          <div className="px-4 py-3 text-xs text-gray-700 italic">
            // hali hech narsa chiqarilmadi
          </div>
        ) : (
          <div className="py-1.5">
            <AnimatePresence mode="popLayout">
              {output.map((line, i) => (
                <motion.div
                  key={`${i}-${line}`}
                  initial={{ opacity: 0, x: -6, backgroundColor: "rgba(16,185,129,0.12)" }}
                  animate={{ opacity: 1, x: 0, backgroundColor: "rgba(16,185,129,0)" }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 px-4 py-1"
                >
                  <span className="text-gray-600 shrink-0 text-xs mt-0.5 select-none">
                    {String(i + 1).padStart(2, " ")}
                  </span>
                  <span className="text-emerald-300 shrink-0 mt-0.5">›</span>
                  <span className="text-emerald-200 break-all">{line}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
