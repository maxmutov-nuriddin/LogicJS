"use client";

import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: "blue" | "purple" | "green" | "none";
  title?: string;
  titleIcon?: ReactNode;
}

const glowClasses: Record<string, string> = {
  blue: "shadow-glow border-primary/20",
  purple: "shadow-glow-accent border-accent/20",
  green: "shadow-glow-success border-success/20",
  none: "border-border",
};

export function Card({ children, className = "", glow = "none", title, titleIcon }: CardProps) {
  return (
    <div
      className={`
        bg-surface rounded-2xl border
        ${glowClasses[glow]}
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          {titleIcon && <span className="text-gray-400">{titleIcon}</span>}
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {title}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
