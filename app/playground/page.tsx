"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Code2, AlertCircle, Layers, BarChart3, Server, Play } from "lucide-react";
import { usePlaygroundStore, useLangStore } from "./store";
import { UI } from "@/lib/i18n/ui";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { EditorControls } from "@/components/editor/EditorControls";
import { MainVisualizer } from "@/components/visualizer/MainVisualizer";
import { ExplanationPanel } from "@/components/layout/ExplanationPanel";
import { Timeline } from "@/components/timeline/Timeline";
import { AutoPlayController } from "@/components/layout/AutoPlayController";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export default function PlaygroundPage() {
  const { status, errorMessage, steps, currentStepIndex, setCode } = usePlaygroundStore();
  const { lang } = useLangStore();
  const t = UI[lang];

  useEffect(() => {
    const preload = sessionStorage.getItem("logiclab:preload");
    if (preload) {
      setCode(preload);
      sessionStorage.removeItem("logiclab:preload");
    }
  }, [setCode]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <AutoPlayController />

      <header className="shrink-0 border-b border-border bg-surface/80 backdrop-blur-sm z-20">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-mono tracking-tight text-white font-black">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Code2 size={14} className="text-white" />
            </div>
            <span>
              Logic<span className="text-primary-light">Lab</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/css"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-150 font-medium">
              <Layers size={13} />
              CSS
            </Link>
            <Link href="/playground"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white bg-surface-2 border border-border transition-all duration-150 font-medium">
              <Play size={13} />
              JavaScript
            </Link>
            <Link href="/backend"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-150 font-medium">
              <Server size={13} />
              Backend
            </Link>
            <Link href="/performance"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-150 font-medium">
              <BarChart3 size={13} />
              Resurs
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Error banner */}
      {status === "error" && errorMessage && (
        <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-error/10 border-b border-error/20 text-error-light text-sm">
          <AlertCircle size={14} className="shrink-0" />
          <span className="font-mono text-xs truncate">{errorMessage}</span>
          <span className="ml-auto text-xs text-error/60 shrink-0">{t.errorHint}</span>
        </div>
      )}

      {/* Main 3-panel layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT: Editor panel */}
        <div className="flex flex-col border-r border-border w-[38%] min-w-[280px] max-w-[520px] overflow-hidden">
          <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-border bg-surface-2">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-gray-500 font-mono">editor.js</span>
          </div>

          <div className="flex-1 min-h-0 p-2">
            <CodeEditor height="100%" />
          </div>

          <div className="shrink-0 border-t border-border bg-surface-2 px-3 py-3">
            <EditorControls />
          </div>
        </div>

        {/* CENTER: Visualizer panel */}
        <div className="flex flex-col flex-1 min-w-0 border-r border-border overflow-hidden">
          <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-border bg-surface-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {t.visualizer}
            </span>
            <span className="text-xs text-gray-600 font-mono">
              {steps.length > 0
                ? t.stepOf(currentStepIndex + 1, steps.length)
                : "—"}
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <MainVisualizer />
          </div>
        </div>

        {/* RIGHT: Explanation panel */}
        <div className="flex flex-col w-[280px] min-w-[220px] overflow-hidden">
          <div className="shrink-0 flex items-center px-4 py-2 border-b border-border bg-surface-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {t.stepInfo}
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <ExplanationPanel />
          </div>
        </div>
      </div>

      {/* BOTTOM: Timeline */}
      <div className="shrink-0 border-t border-border bg-surface-2 overflow-hidden" style={{ height: "88px" }}>
        <div className="flex items-center gap-3 px-3 h-full">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 shrink-0">
            {t.timeline}
          </span>
          <div className="flex-1 overflow-x-auto h-full">
            <Timeline />
          </div>
        </div>
      </div>
    </div>
  );
}
