"use client";

import { create } from "zustand";
import { runCode, DEFAULT_CODE } from "@/lib/steps";
import type { PlaygroundStore, ExecutionStep } from "@/lib/types";
import type { Lang } from "@/lib/i18n";

interface LangStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangStore>((set) => ({
  lang: "en",
  setLang: (lang) => set({ lang }),
}));

export const usePlaygroundStore = create<PlaygroundStore>((set, get) => ({
  code: DEFAULT_CODE,
  steps: [],
  currentStepIndex: -1,
  status: "idle",
  errorMessage: null,
  isAutoPlaying: false,
  autoPlaySpeed: 1800,

  setAutoPlaySpeed: (speed: number) => {
    set({ autoPlaySpeed: speed });
  },

  setCode: (code: string) => {
    set({ code, status: "idle", steps: [], currentStepIndex: -1, errorMessage: null });
  },

  runCode: () => {
    const { code } = get();
    const lang = useLangStore.getState().lang;
    const { steps, error } = runCode(code, lang);

    if (error) {
      set({ status: "error", errorMessage: error, steps: [], currentStepIndex: -1 });
      return;
    }

    set({
      steps,
      currentStepIndex: 0,
      status: "paused",
      errorMessage: null,
      isAutoPlaying: false,
    });
  },

  resetPlayground: () => {
    set({
      steps: [],
      currentStepIndex: -1,
      status: "idle",
      errorMessage: null,
      isAutoPlaying: false,
    });
  },

  stepForward: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      const next = currentStepIndex + 1;
      set({ currentStepIndex: next, status: next === steps.length - 1 ? "complete" : "paused" });
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1, status: "paused" });
    }
  },

  goToStep: (index: number) => {
    const { steps } = get();
    if (index >= 0 && index < steps.length) {
      set({ currentStepIndex: index, status: index === steps.length - 1 ? "complete" : "paused" });
    }
  },

  startAutoPlay: () => {
    const { steps, currentStepIndex } = get();
    if (currentStepIndex >= steps.length - 1) {
      set({ currentStepIndex: 0, isAutoPlaying: true, status: "running" });
    } else {
      set({ isAutoPlaying: true, status: "running" });
    }
  },

  stopAutoPlay: () => {
    set({ isAutoPlaying: false, status: "paused" });
  },
}));

export function getCurrentStep(steps: ExecutionStep[], index: number): ExecutionStep | null {
  if (index < 0 || index >= steps.length) return null;
  return steps[index];
}
