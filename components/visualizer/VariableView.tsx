"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Box } from "lucide-react";
import type { RuntimeState } from "@/lib/types";

interface VariableViewProps {
  state: RuntimeState | null;
}

function fmtVal(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  if (Array.isArray(value)) return `[${value.length} ta]`;
  if (typeof value === "object") return `{${Object.keys(value as object).length} kalit}`;
  return String(value);
}

function fmtShort(value: unknown): string {
  if (value === undefined) return "undef";
  if (value === null) return "null";
  if (typeof value === "string") {
    const s = `"${value}"`;
    return s.length > 12 ? s.slice(0, 11) + "…\"" : s;
  }
  return String(value);
}

function getTypeInfo(value: unknown): { icon: string; label: string; color: string; bg: string; border: string } {
  if (value === undefined) return { icon: "∅", label: "undef", color: "text-gray-500", bg: "bg-gray-800/50", border: "border-gray-700" };
  if (value === null)      return { icon: "∅", label: "null",  color: "text-gray-400", bg: "bg-gray-800/50", border: "border-gray-700" };
  if (typeof value === "boolean") return value
    ? { icon: "✓", label: "true",  color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" }
    : { icon: "✗", label: "false", color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/30" };
  if (typeof value === "number")  return { icon: "#", label: "number", color: "text-blue-400",  bg: "bg-blue-500/10",  border: "border-blue-500/30" };
  if (typeof value === "string")  return { icon: "T", label: "string", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" };
  if (Array.isArray(value))       return { icon: "[]", label: "array", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" };
  return { icon: "{}", label: "object", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" };
}

// ─── Array visual ──────────────────────────────────────────────────────────────

function ArrayDisplay({ value }: { value: unknown[] }) {
  const show = value.slice(0, 8);
  const rest = value.length - show.length;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {show.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="text-[9px] text-gray-600 mb-0.5 font-mono">[{i}]</div>
          <div className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-xs text-gray-300 min-w-[28px] text-center">
            {fmtShort(item)}
          </div>
        </div>
      ))}
      {rest > 0 && (
        <div className="flex items-end pb-0.5">
          <span className="text-xs text-gray-600 font-mono">+{rest}</span>
        </div>
      )}
    </div>
  );
}

// ─── Object visual ─────────────────────────────────────────────────────────────

function ObjectDisplay({ value }: { value: Record<string, unknown> }) {
  const entries = Object.entries(value).slice(0, 5);
  const rest = Object.keys(value).length - entries.length;
  return (
    <div className="flex flex-col gap-0.5 mt-1">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-center gap-1 text-xs font-mono">
          <span className="text-violet-400 shrink-0">{k}:</span>
          <span className="text-gray-300 truncate max-w-[90px]">{fmtShort(v)}</span>
        </div>
      ))}
      {rest > 0 && <span className="text-xs text-gray-600">…+{rest} ta</span>}
    </div>
  );
}

// ─── Variable card ─────────────────────────────────────────────────────────────

interface VariableCardProps {
  name: string;
  value: unknown;
  isChanged: boolean;
}

function VariableCard({ name, value, isChanged }: VariableCardProps) {
  const ti = getTypeInfo(value);
  const isArray = Array.isArray(value);
  const isObj = !isArray && typeof value === "object" && value !== null;
  const isComplex = isArray || isObj;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`relative rounded-xl border p-3 transition-all duration-200 ${
        isChanged
          ? "border-yellow-400/60 bg-yellow-500/5 shadow-[0_0_12px_rgba(250,204,21,0.15)]"
          : `${ti.border} ${ti.bg}`
      }`}
    >
      {/* Flash overlay on change */}
      {isChanged && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 rounded-xl bg-yellow-400/10 pointer-events-none"
        />
      )}

      {/* Header: name + type badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {isChanged && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.4 }}
              className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0"
            />
          )}
          <span className="text-sm font-bold font-mono text-gray-200">{name}</span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-mono font-semibold ${ti.color} ${ti.bg} ${ti.border}`}>
          {ti.icon} {ti.label}
        </span>
      </div>

      {/* Value display */}
      {isArray ? (
        <ArrayDisplay value={value as unknown[]} />
      ) : isObj ? (
        <ObjectDisplay value={value as Record<string, unknown>} />
      ) : (
        <motion.div
          key={String(value)}
          initial={isChanged ? { scale: 0.85, opacity: 0.6 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className={`text-center py-2 px-3 rounded-lg font-mono font-bold text-xl bg-background border ${
            isChanged ? "border-yellow-400/40" : "border-border"
          } ${ti.color}`}
        >
          {fmtVal(value)}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function VariableView({ state }: VariableViewProps) {
  const variables = state?.variables ?? {};
  const changedVariable = state?.changedVariable;
  const entries = Object.entries(variables);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Box size={13} className="text-primary-light" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Xotira (o'zgaruvchilar)
        </span>
        {entries.length > 0 && (
          <span className="ml-auto text-xs text-gray-600 font-mono">
            {entries.length} ta
          </span>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-2">
              <Box size={18} className="text-gray-600" />
            </div>
            <p className="text-xs text-gray-600">Hali o'zgaruvchi yo'q</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
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
