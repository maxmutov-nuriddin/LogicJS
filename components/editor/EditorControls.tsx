"use client";

import { Play, SkipBack, SkipForward, ChevronRight, ChevronLeft, RotateCcw, Square, Gauge } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePlaygroundStore, useLangStore } from "@/app/playground/store";
import { UI } from "@/lib/i18n/ui";
import { CODE_PRESETS } from "@/lib/steps";

const PRESET_LABEL_KEYS: Record<string, keyof typeof UI["en"]> = {
  basic_if:   "presetBasicIf",
  for_loop:   "presetForLoop",
  while_loop: "presetWhileLoop",
  functions:  "presetFunctions",
  arrays:     "presetArrays",
  objects:    "presetObjects",
  nested_if:  "presetNestedIf",
  fibonacci:  "presetFibonacci",
};

export function EditorControls() {
  const {
    steps, currentStepIndex, status, isAutoPlaying, autoPlaySpeed,
    runCode, resetPlayground, stepForward, stepBackward,
    startAutoPlay, stopAutoPlay, setCode, setAutoPlaySpeed,
  } = usePlaygroundStore();

  const SPEED_OPTIONS = [
    { label: "0.5x", value: 3600 },
    { label: "1x",   value: 1800 },
    { label: "2x",   value: 900  },
    { label: "3x",   value: 600  },
  ];
  const { lang } = useLangStore();
  const t = UI[lang];

  const hasSteps = steps.length > 0;
  const atStart = currentStepIndex <= 0;
  const atEnd = currentStepIndex >= steps.length - 1;

  return (
    <div className="flex flex-col gap-3">
      {/* Main controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {status === "idle" || status === "error" ? (
          <Button variant="primary" size="md" icon={<Play size={14} />} onClick={runCode}>
            {t.run}
          </Button>
        ) : (
          <Button variant="danger" size="md" icon={<RotateCcw size={14} />} onClick={resetPlayground}>
            {t.reset}
          </Button>
        )}

        <Button
          variant="secondary" size="md" icon={<ChevronLeft size={14} />}
          onClick={stepBackward} disabled={!hasSteps || atStart || isAutoPlaying}
        >
          {t.back}
        </Button>

        <Button
          variant="secondary" size="md" icon={<ChevronRight size={14} />}
          onClick={stepForward} disabled={!hasSteps || atEnd || isAutoPlaying}
        >
          {t.step}
        </Button>

        {!isAutoPlaying ? (
          <Button
            variant="success" size="md" icon={<SkipForward size={14} />}
            onClick={startAutoPlay} disabled={!hasSteps || atEnd}
          >
            {t.play}
          </Button>
        ) : (
          <Button variant="secondary" size="md" icon={<Square size={14} />} onClick={stopAutoPlay}>
            {t.pause}
          </Button>
        )}

        {hasSteps && (
          <Button
            variant="ghost" size="md" icon={<SkipBack size={14} />}
            onClick={() => usePlaygroundStore.getState().goToStep(0)}
            disabled={atStart || isAutoPlaying}
            title={t.goToStart}
          />
        )}

        {/* Speed selector */}
        <div className="flex items-center gap-1 ml-1 border-l border-border pl-2">
          <Gauge size={13} className="text-gray-500" />
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAutoPlaySpeed(opt.value)}
              className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                autoPlaySpeed === opt.value
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-2 hover:bg-surface-3 text-gray-400 hover:text-gray-200 border-border"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {hasSteps && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-mono">
            {t.stepOf(currentStepIndex + 1, steps.length)}
          </span>
          <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="flex items-center gap-2 flex-wrap border-t border-border pt-3">
        <span className="text-xs text-gray-500">{t.presets}:</span>
        {Object.entries(CODE_PRESETS).map(([key, preset]) => {
          const labelKey = PRESET_LABEL_KEYS[key];
          const label = labelKey ? String(t[labelKey]) : preset.label;
          return (
            <button
              key={key}
              onClick={() => setCode(preset.code)}
              className="text-xs px-2 py-1 rounded-md bg-surface-2 hover:bg-surface-3 text-gray-400 hover:text-gray-200 border border-border transition-colors"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
