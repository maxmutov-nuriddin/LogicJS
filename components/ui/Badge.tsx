"use client";

import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "blue" | "purple" | "green" | "red" | "yellow" | "gray";
  size?: "sm" | "md";
}

const variantClasses: Record<string, string> = {
  blue: "bg-primary/10 text-primary-light border-primary/20",
  purple: "bg-accent/10 text-accent-light border-accent/20",
  green: "bg-success/10 text-success-light border-success/20",
  red: "bg-error/10 text-error-light border-error/20",
  yellow: "bg-warning/10 text-warning-light border-warning/20",
  gray: "bg-surface-2 text-gray-400 border-border",
};

const sizeClasses: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs rounded-md",
  md: "px-3 py-1 text-sm rounded-lg",
};

export function Badge({ children, variant = "gray", size = "sm" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium border font-mono
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
    >
      {children}
    </span>
  );
}
