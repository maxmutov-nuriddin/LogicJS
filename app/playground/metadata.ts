import type { Metadata } from "next";

const BASE_URL = "https://logiclab.dev";

export const metadata: Metadata = {
  title: "JavaScript Playground",
  description:
    "Interactive JavaScript execution visualizer. Write JS code and watch variables, call stack, loops, and functions execute step-by-step with animated diagrams.",
  keywords: [
    "JavaScript playground",
    "JS visualizer",
    "JavaScript execution",
    "code step by step",
    "variables visualizer",
    "call stack animation",
    "JavaScript for beginners",
    "learn JavaScript online",
    "interactive JavaScript",
    "JS debugger visual",
  ],
  alternates: {
    canonical: `${BASE_URL}/playground`,
  },
  openGraph: {
    title: "JavaScript Playground — LogicLab",
    description:
      "Write JavaScript code and watch it execute step-by-step. Visualize variables, loops, functions and the call stack in real time.",
    url: `${BASE_URL}/playground`,
    images: [{ url: `${BASE_URL}/og-playground.png`, width: 1200, height: 630, alt: "JS Playground" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript Playground — LogicLab",
    description: "Write JS code and watch it execute step-by-step with animated visualizations.",
    images: [`${BASE_URL}/og-playground.png`],
  },
};
