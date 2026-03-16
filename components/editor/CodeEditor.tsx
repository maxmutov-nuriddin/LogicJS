"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { usePlaygroundStore } from "@/app/playground/store";
import type { ExecutionStep } from "@/lib/types";
import { formatValue } from "@/lib/engine/executor";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-surface-2 rounded-xl">
      <div className="flex items-center gap-2 text-gray-500">
        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-sm">Loading editor...</span>
      </div>
    </div>
  ),
});

interface CodeEditorProps {
  height?: string;
}

/** Returns a short inline annotation for the after-line hint */
function getAnnotation(step: ExecutionStep): string {
  switch (step.type) {
    case "declare-variable":
      return `  ← ${step.name} = ${formatValue(step.value)}`;
    case "assign-variable":
      return `  ← ${step.name}: ${formatValue(step.oldValue)} → ${formatValue(step.value)}`;
    case "update-variable":
      return `  ← ${step.name}: ${formatValue(step.oldValue)} → ${formatValue(step.newValue)}`;
    case "evaluate-condition":
    case "loop-condition":
      return step.result ? "  ← ✓ TRUE" : "  ← ✗ FALSE";
    case "enter-if-branch":
      return step.branch === "if" ? "  ← if { } ga kirdi" : "  ← else { } ga kirdi";
    case "skip-branch":
      return step.branch === "if" ? "  ← if o'tkazib yuborildi" : "  ← else o'tkazib yuborildi";
    case "console-output":
      return `  ← ${step.value.length > 20 ? step.value.slice(0, 20) + "…" : step.value}`;
    case "loop-iteration":
      return `  ← ${step.iteration}-chi aylanish`;
    case "loop-end":
      return `  ← tsikl tugadi (${step.totalIterations} marta)`;
    case "function-call":
      return `  ← ${step.name}() chaqirildi`;
    case "function-return":
      return `  ← ${formatValue(step.value)} qaytdi`;
    case "function-declare":
      return `  ← ${step.name}() aniqlandi`;
    case "program-start":
      return "  ← dastur boshlandi";
    case "program-end":
      return "  ← dastur tugadi";
    default:
      return "";
  }
}

export function CodeEditor({ height = "100%" }: CodeEditorProps) {
  const { code, setCode, steps, currentStepIndex } = usePlaygroundStore();
  const editorRef = useRef<unknown>(null);
  const decorationsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!editorRef.current) return;
    const editor = editorRef.current as {
      deltaDecorations: (old: string[], newDecs: unknown[]) => string[];
    };

    const currentStep = steps[currentStepIndex];
    if (!currentStep || currentStep.line === 0) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
      return;
    }

    const line = currentStep.line;
    const col = currentStep.col;
    const annotation = getAnnotation(currentStep);
    const decorations: unknown[] = [];

    // 1. Whole-line background highlight
    decorations.push({
      range: {
        startLineNumber: line,
        startColumn: 1,
        endLineNumber: line,
        endColumn: 1,
      },
      options: {
        isWholeLine: true,
        className: "monaco-line-highlight",
        linesDecorationsClassName: "monaco-line-gutter-highlight",
      },
    });

    // 2. Token-level inline highlight (specific column range)
    if (col) {
      const endLine = col.endLine ?? line;
      decorations.push({
        range: {
          startLineNumber: line,
          startColumn: col.start,
          endLineNumber: endLine,
          endColumn: col.end,
        },
        options: {
          inlineClassName: "monaco-token-highlight",
        },
      });
    }

    // 3. After-line annotation text
    if (annotation) {
      decorations.push({
        range: {
          startLineNumber: line,
          startColumn: 9999,
          endLineNumber: line,
          endColumn: 9999,
        },
        options: {
          after: {
            content: annotation,
            inlineClassName: "monaco-after-annotation",
          },
        },
      });
    }

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations);
  }, [currentStepIndex, steps]);

  return (
    <div className="relative h-full rounded-xl overflow-hidden border border-border">
      <style>{`
        /* Whole-line background */
        .monaco-line-highlight {
          background: rgba(59, 130, 246, 0.10) !important;
        }

        /* Left gutter indicator */
        .monaco-line-gutter-highlight {
          background: #3b82f6 !important;
          width: 3px !important;
          margin-left: 3px !important;
        }

        /* Token-level highlight (specific expression) */
        .monaco-token-highlight {
          background: rgba(251, 191, 36, 0.25) !important;
          border-bottom: 2px solid rgba(251, 191, 36, 0.8) !important;
          border-radius: 2px !important;
        }

        /* After-line annotation */
        .monaco-after-annotation {
          color: rgba(156, 163, 175, 0.75) !important;
          font-style: italic !important;
          font-size: 12px !important;
          letter-spacing: 0.01em !important;
        }
      `}</style>
      <MonacoEditor
        height={height}
        language="javascript"
        value={code}
        onChange={(val) => setCode(val ?? "")}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "JetBrains Mono, Fira Code, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "none",
          padding: { top: 16, bottom: 16 },
          lineDecorationsWidth: 8,
          folding: false,
          glyphMargin: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          scrollbar: {
            vertical: "auto",
            horizontal: "hidden",
          },
        }}
      />
    </div>
  );
}
