"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Box } from "lucide-react";
import type { RuntimeState } from "@/lib/types";

interface VariableViewProps {
  state: RuntimeState | null;
}

function formatDisplayValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

function getTypeColor(value: unknown): string {
  if (value === undefined) return "text-gray-500";
  if (value === null) return "text-gray-400";
  if (typeof value === "number") return "text-primary-light";
  if (typeof value === "string") return "text-success-light";
  if (typeof value === "boolean") return "text-accent-light";
  return "text-gray-300";
}

function getTypeBadge(value: unknown): string {
  if (value === undefined) return "undef";
  if (value === null) return "null";
  return typeof value;
}

function getTypeBadgeColor(value: unknown): string {
  if (value === undefined || value === null) return "bg-gray-800 text-gray-500 border-gray-700";
  if (typeof value === "number") return "bg-primary/10 text-primary-light border-primary/20";
  if (typeof value === "string") return "bg-success/10 text-success-light border-success/20";
  if (typeof value === "boolean") return "bg-accent/10 text-accent-light border-accent/20";
  return "bg-surface-2 text-gray-400 border-border";
}

interface VariableCardProps {
  name: string;
  value: unknown;
  isChanged: boolean;
}

function VariableCard({ name, value, isChanged }: VariableCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        relative rounded-xl border p-3 transition-all duration-300
        ${isChanged
          ? "border-primary/60 bg-primary/5 shadow-glow"
          : "border-border bg-surface-2"
        }
      `}
    >
      {isChanged && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 rounded-xl bg-primary/10 pointer-events-none"
        />
      )}

      {/* Variable name */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-300 font-mono">
          {name}
        </span>
        <span
          className={`text-xs px-1.5 py-0.5 rounded border font-mono ${getTypeBadgeColor(value)}`}
        >
          {getTypeBadge(value)}
        </span>
      </div>

      {/* Value box */}
      <motion.div
        key={String(value)}
        initial={isChanged ? { scale: 0.9, opacity: 0.5 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        className={`
          text-center py-2 px-3 rounded-lg font-mono font-bold text-lg
          bg-background border
          ${isChanged ? "border-primary/40" : "border-border"}
          ${getTypeColor(value)}
        `}
      >
        {formatDisplayValue(value)}
      </motion.div>
    </motion.div>
  );
}

export function VariableView({ state }: VariableViewProps) {
  const variables = state?.variables ?? {};
  const changedVariable = state?.changedVariable;
  const entries = Object.entries(variables);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <Box size={14} className="text-primary-light" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Memory
        </span>
        {entries.length > 0 && (
          <span className="ml-auto text-xs text-gray-600 font-mono">
            {entries.length} var{entries.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-3">
              <Box size={20} className="text-gray-600" />
            </div>
            <p className="text-xs text-gray-600">No variables yet</p>
            <p className="text-xs text-gray-700 mt-1">Run code to see memory</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {entries.map(([name, value]) => (
              <VariableCard
                key={name}
                name={name}
                value={value}
                isChanged={changedVariable === name}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
