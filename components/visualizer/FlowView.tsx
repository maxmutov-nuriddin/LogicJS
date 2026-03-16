"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { RuntimeState } from "@/lib/types";

interface FlowViewProps {
  state: RuntimeState | null;
}

export function FlowView({ state }: FlowViewProps) {
  const condition = state?.activeCondition;
  const activeBranch = state?.activeBranch;

  if (!condition && !activeBranch) return null;

  const conditionResult = condition?.result;

  // Determine which paths are highlighted
  const ifActive =
    activeBranch === "if" ||
    (condition !== undefined && conditionResult === true);
  const elseActive =
    activeBranch === "else" ||
    (condition !== undefined && conditionResult === false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-0 select-none"
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 self-start">
        Flow
      </span>

      {/* Start node */}
      <FlowNode label="Start" color="blue" active />

      <FlowArrow />

      {/* Condition node */}
      <motion.div
        animate={
          condition
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(168,85,247,0)",
                  "0 0 0 6px rgba(168,85,247,0.2)",
                  "0 0 0 0 rgba(168,85,247,0)",
                ],
              }
            : {}
        }
        transition={{ duration: 0.8, repeat: condition ? Infinity : 0 }}
        className={`
          px-4 py-2 rounded-xl border text-sm font-mono font-semibold
          transition-all duration-300
          ${condition
            ? "bg-accent/10 border-accent/40 text-accent-light"
            : "bg-surface-2 border-border text-gray-400"
          }
        `}
      >
        {condition ? condition.expression : "condition"}
      </motion.div>

      {/* Branch arrows */}
      <div className="flex items-start gap-8 mt-0 relative w-full justify-center">
        {/* Left (IF) */}
        <div className="flex flex-col items-center gap-0 mt-0">
          {/* Diagonal line left */}
          <div className="relative h-8 w-20 flex justify-end">
            <svg
              width="80"
              height="32"
              className="absolute top-0 right-0"
              viewBox="0 0 80 32"
            >
              <line
                x1="80"
                y1="0"
                x2="0"
                y2="32"
                stroke={ifActive ? "#3b82f6" : "#1e3a5f"}
                strokeWidth={ifActive ? "2" : "1"}
                strokeDasharray={!ifActive && elseActive ? "4 3" : undefined}
              />
            </svg>
          </div>

          <motion.div
            animate={ifActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BranchNode
              label="TRUE"
              sublabel="if block"
              active={!!ifActive}
              skipped={!ifActive && !!elseActive}
              color="green"
            />
          </motion.div>
        </div>

        {/* Right (ELSE) */}
        <div className="flex flex-col items-center gap-0 mt-0">
          {/* Diagonal line right */}
          <div className="relative h-8 w-20 flex justify-start">
            <svg
              width="80"
              height="32"
              className="absolute top-0 left-0"
              viewBox="0 0 80 32"
            >
              <line
                x1="0"
                y1="0"
                x2="80"
                y2="32"
                stroke={elseActive ? "#ef4444" : "#1e3a5f"}
                strokeWidth={elseActive ? "2" : "1"}
                strokeDasharray={!elseActive && ifActive ? "4 3" : undefined}
              />
            </svg>
          </div>

          <motion.div
            animate={elseActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BranchNode
              label="FALSE"
              sublabel="else block"
              active={!!elseActive}
              skipped={!elseActive && !!ifActive}
              color="red"
            />
          </motion.div>
        </div>
      </div>

      <FlowArrow />

      {/* End node */}
      <FlowNode label="Continue" color="blue" active />
    </motion.div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FlowNodeProps {
  label: string;
  color: "blue" | "green" | "red" | "purple";
  active?: boolean;
}

function FlowNode({ label, color, active }: FlowNodeProps) {
  const colorMap = {
    blue: "bg-primary/10 border-primary/30 text-primary-light",
    green: "bg-success/10 border-success/30 text-success-light",
    red: "bg-error/10 border-error/30 text-error-light",
    purple: "bg-accent/10 border-accent/30 text-accent-light",
  };

  return (
    <div
      className={`
        px-5 py-2 rounded-full border text-xs font-semibold font-mono
        transition-all duration-300
        ${colorMap[color]}
        ${active ? "shadow-glow" : "opacity-60"}
      `}
    >
      {label}
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-4 bg-border" />
      <ArrowDown size={12} className="text-gray-600 -mt-1" />
    </div>
  );
}

interface BranchNodeProps {
  label: string;
  sublabel: string;
  active: boolean;
  skipped: boolean;
  color: "green" | "red";
}

function BranchNode({ label, sublabel, active, skipped, color }: BranchNodeProps) {
  const colorMap = {
    green: {
      active: "bg-success/10 border-success/40 text-success-light",
      inactive: "bg-surface-2 border-border text-gray-600",
      skipped: "bg-surface-2 border-border text-gray-700 opacity-40",
    },
    red: {
      active: "bg-error/10 border-error/40 text-error-light",
      inactive: "bg-surface-2 border-border text-gray-600",
      skipped: "bg-surface-2 border-border text-gray-700 opacity-40",
    },
  };

  const classes = skipped
    ? colorMap[color].skipped
    : active
    ? colorMap[color].active
    : colorMap[color].inactive;

  return (
    <div
      className={`
        px-4 py-2 rounded-xl border text-center transition-all duration-300
        ${classes}
      `}
    >
      <p className="text-sm font-bold font-mono">{label}</p>
      <p className="text-xs opacity-70 mt-0.5">{sublabel}</p>
      {skipped && (
        <p className="text-xs mt-1 text-gray-600">skipped</p>
      )}
    </div>
  );
}
