import type { Metadata } from "next";

const BASE_URL = "https://logiclab.dev";

export const metadata: Metadata = {
  title: "Performance Benchmark — JS Algorithms",
  description:
    "Benchmark and compare JavaScript algorithms visually: for vs while loops, recursion vs iteration, if/else vs switch, linear vs binary search. See real execution steps and performance differences.",
  keywords: [
    "JavaScript performance",
    "algorithm benchmark",
    "for loop vs while loop",
    "recursion vs iteration",
    "if else vs switch",
    "linear search vs binary search",
    "JavaScript optimization",
    "algorithm comparison",
    "JS profiler visual",
    "code performance education",
    "algorithm steps counter",
  ],
  alternates: {
    canonical: `${BASE_URL}/performance`,
  },
  openGraph: {
    title: "JS Performance Benchmark — LogicLab",
    description:
      "Compare JavaScript algorithms side by side. Measure execution steps, memory usage and efficiency of loops, recursion, search and sorting.",
    url: `${BASE_URL}/performance`,
    images: [{ url: `${BASE_URL}/og-performance.png`, width: 1200, height: 630, alt: "Performance Benchmark" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JS Performance Benchmark — LogicLab",
    description: "Compare JS algorithms visually — loops, recursion, search, sorting and more.",
    images: [`${BASE_URL}/og-performance.png`],
  },
};
