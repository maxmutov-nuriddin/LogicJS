"use client";

import { useEffect } from "react";
import { usePlaygroundStore } from "@/app/playground/store";

const AUTO_PLAY_INTERVAL = 1800; // ms per step

export function AutoPlayController() {
  const { isAutoPlaying, stepForward, steps, currentStepIndex, stopAutoPlay } =
    usePlaygroundStore();

  useEffect(() => {
    if (!isAutoPlaying) return;

    if (currentStepIndex >= steps.length - 1) {
      stopAutoPlay();
      return;
    }

    const timer = setTimeout(() => {
      stepForward();
    }, AUTO_PLAY_INTERVAL);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStepIndex, steps.length, stepForward, stopAutoPlay]);

  return null;
}
