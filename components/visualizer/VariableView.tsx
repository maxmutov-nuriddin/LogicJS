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
  if (value === undefined) return "∅";
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") {
    const s = `"${value}"`;
    return s.length > 10 ? s.slice(0, 9) + '…"' : s;
  }
  if (Array.isArray(value)) return `[…]`;
  if (typeof value === "object") return `{…}`;
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

function ArrayDisplay({ value, changedIndex }: { value: unknown[]; changedIndex?: number }) {
  const show = value.slice(0, 20);
  const rest = value.length - show.length;

  if (value.length === 0) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <span className="font-mono text-xs text-gray-500">[ ]</span>
        <span className="text-[10px] text-gray-600">Bo'sh array</span>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] text-gray-500 font-mono">Array</span>
        <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded font-bold font-mono">
          {value.length} ta element
        </span>
        {changedIndex !== undefined && (
          <span className="text-[10px] text-yellow-400 font-mono">
            [{changedIndex}] o'zgardi
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {show.map((item, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: Math.min(i * 0.025, 0.4), type: "spring", stiffness: 500 }}
            className={`flex flex-col items-center rounded-lg border min-w-[36px] px-1.5 py-1.5 ${
              i === changedIndex
                ? "border-yellow-400/60 bg-yellow-500/10 shadow-[0_0_8px_rgba(250,204,21,0.25)]"
                : "border-border bg-background"
            }`}
          >
            <div className="text-[8px] text-gray-600 font-mono leading-none mb-1">[{i}]</div>
            <div className={`text-xs font-mono font-bold leading-tight ${
              i === changedIndex ? "text-yellow-300" : "text-gray-200"
            }`}>
              {fmtShort(item)}
            </div>
          </motion.div>
        ))}
        {rest > 0 && (
          <div className="flex items-end pb-1">
            <span className="text-xs text-gray-600 font-mono bg-surface-2 border border-border rounded px-1.5 py-0.5">
              +{rest} ta
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Object visual ─────────────────────────────────────────────────────────────

function ObjectDisplay({ value, changedKey }: { value: Record<string, unknown>; changedKey?: string }) {
  const entries = Object.entries(value);
  const show = entries.slice(0, 10);
  const rest = entries.length - show.length;

  if (entries.length === 0) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <span className="font-mono text-xs text-gray-500">{ }</span>
        <span className="text-[10px] text-gray-600">Bo'sh object</span>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] text-gray-500 font-mono">Object</span>
        <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded font-bold font-mono">
          {entries.length} ta kalit
        </span>
        {changedKey && (
          <span className="text-[10px] text-yellow-400 font-mono">
            .{changedKey} o'zgardi
          </span>
        )}
      </div>
      <div className="space-y-0.5">
        {show.map(([k, v]) => {
          const isKeyChanged = k === changedKey;
          const ti = getTypeInfo(v);
          return (
            <motion.div
              key={k}
              initial={{ x: -6, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 ${
                isKeyChanged
                  ? "border-yellow-400/40 bg-yellow-500/8 shadow-[0_0_6px_rgba(250,204,21,0.1)]"
                  : "border-border bg-background"
              }`}
            >
              <span className={`font-mono text-xs font-bold shrink-0 w-16 truncate ${
                isKeyChanged ? "text-yellow-300" : "text-violet-400"
              }`}>
                {k}:
              </span>
              <span className={`font-mono text-xs flex-1 truncate ${
                isKeyChanged ? "text-yellow-200 font-bold" : "text-gray-200"
              }`}>
                {fmtVal(v)}
              </span>
              <span className={`text-[9px] px-1 py-0.5 rounded border font-mono shrink-0 ${ti.color} ${ti.bg} ${ti.border}`}>
                {ti.icon}
              </span>
            </motion.div>
          );
        })}
        {rest > 0 && (
          <p className="text-xs text-gray-600 ml-2">…+{rest} ta kalit</p>
        )}
      </div>
    </div>
  );
}

// ─── Variable card ─────────────────────────────────────────────────────────────

interface VariableCardProps {
  name: string;
  value: unknown;
  isChanged: boolean;
  changedIndex?: number;
  changedKey?: string;
  isComplex: boolean;
}

function VariableCard({ name, value, isChanged, changedIndex, changedKey, isComplex }: VariableCardProps) {
  const ti = getTypeInfo(value);
  const isArray = Array.isArray(value);
  const isObj = !isArray && typeof value === "object" && value !== null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`relative rounded-xl border p-3 transition-all duration-200 ${
        isComplex ? "col-span-2" : ""
      } ${
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
          transition={{ duration: 0.8 }}
          className="absolute inset-0 rounded-xl bg-yellow-400/10 pointer-events-none"
        />
      )}

      {/* Header: name + type badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isChanged && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.4 }}
              className="w-2 h-2 rounded-full bg-yellow-400 shrink-0 shadow-[0_0_6px_rgba(250,204,21,0.8)]"
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
        <ArrayDisplay value={value as unknown[]} changedIndex={changedIndex} />
      ) : isObj ? (
        <ObjectDisplay value={value as Record<string, unknown>} changedKey={changedKey} />
      ) : (
        <motion.div
          key={String(value)}
          initial={isChanged ? { scale: 0.85, opacity: 0.6 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className={`text-center py-2 px-3 rounded-lg font-mono font-bold text-xl bg-background border mt-2 ${
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
            {entries.map(([name, value]) => {
              const isArray = Array.isArray(value);
              const isObj = !isArray && typeof value === "object" && value !== null;
              const isComplex = isArray || isObj;

              // Detect change: direct name match OR arr[i] / obj.prop pattern
              const isChanged =
                changedVariable === name ||
                changedVariable?.startsWith(`${name}[`) ||
                changedVariable?.startsWith(`${name}.`);

              // Extract changed array index (e.g. "arr[2]" → 2)
              let changedIndex: number | undefined;
              if (isArray && changedVariable) {
                const m = changedVariable.match(new RegExp(`^${name}\\[(\\d+)\\]$`));
                if (m) changedIndex = parseInt(m[1]);
              }

              // Extract changed object key (e.g. "person.age" → "age")
              let changedKey: string | undefined;
              if (isObj && changedVariable) {
                const m = changedVariable.match(new RegExp(`^${name}\\.(.+)$`));
                if (m) changedKey = m[1];
              }

              return (
                <VariableCard
                  key={name}
                  name={name}
                  value={value}
                  isChanged={!!isChanged}
                  changedIndex={changedIndex}
                  changedKey={changedKey}
                  isComplex={isComplex}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
