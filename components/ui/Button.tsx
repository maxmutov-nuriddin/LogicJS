"use client";

import { motion } from "framer-motion";
import { type ReactNode, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  children?: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-primary hover:bg-primary-dark text-white border border-primary/30 shadow-glow",
  secondary:
    "bg-surface-2 hover:bg-surface-3 text-gray-200 border border-border",
  ghost: "bg-transparent hover:bg-surface-2 text-gray-400 hover:text-gray-200 border border-transparent",
  danger: "bg-error/10 hover:bg-error/20 text-error border border-error/30",
  success:
    "bg-success/10 hover:bg-success/20 text-success border border-success/30",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2 text-sm gap-2 rounded-xl",
  lg: "px-6 py-3 text-base gap-2 rounded-xl",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ duration: 0.1 }}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </motion.button>
  );
}
