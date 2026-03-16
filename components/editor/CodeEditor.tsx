"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { usePlaygroundStore } from "@/app/playground/store";

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

export function CodeEditor({ height = "100%" }: CodeEditorProps) {
  const { code, setCode, steps, currentStepIndex } = usePlaygroundStore();
  const editorRef = useRef<unknown>(null);
  const decorationsRef = useRef<string[]>([]);

  // Highlight current line
  useEffect(() => {
    if (!editorRef.current) return;
    const editor = editorRef.current as {
      deltaDecorations: (old: string[], newDecs: unknown[]) => string[];
    };

    const currentStep = steps[currentStepIndex];
    if (!currentStep || currentStep.line === 0) {
      decorationsRef.current = editor.deltaDecorations(
        decorationsRef.current,
        []
      );
      return;
    }

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      [
        {
          range: {
            startLineNumber: currentStep.line,
            startColumn: 1,
            endLineNumber: currentStep.line,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: "monaco-line-highlight",
            linesDecorationsClassName: "monaco-line-gutter-highlight",
          },
        },
      ]
    );
  }, [currentStepIndex, steps]);

  return (
    <div className="relative h-full rounded-xl overflow-hidden border border-border">
      <style>{`
        .monaco-line-highlight {
          background: rgba(59, 130, 246, 0.12) !important;
          border-left: 2px solid #3b82f6 !important;
        }
        .monaco-line-gutter-highlight {
          background: #3b82f6 !important;
          width: 3px !important;
          margin-left: 3px !important;
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
