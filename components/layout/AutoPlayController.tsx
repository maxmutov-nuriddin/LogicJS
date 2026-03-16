"use client";

import { useEffect } from "react";
import { usePlaygroundStore } from "@/app/playground/store";

export function AutoPlayController() {
  const { isAutoPlaying, stepForward, steps, currentStepIndex, stopAutoPlay, autoPlaySpeed } =
    usePlaygroundStore();

  useEffect(() => {
    if (!isAutoPlaying) return;

    if (currentStepIndex >= steps.length - 1) {
      stopAutoPlay();
      return;
    }

    const timer = setTimeout(() => {
      stepForward();
    }, autoPlaySpeed);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStepIndex, steps.length, stepForward, stopAutoPlay, autoPlaySpeed]);

  return null;
}
