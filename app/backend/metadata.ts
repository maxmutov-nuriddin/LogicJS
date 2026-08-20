import type { Metadata } from "next";

const BASE_URL = "https://logiclab.dev";

export const metadata: Metadata = {
  title: "Backend Visualizer — Node.js",
  description:
    "Visualize Node.js backend concepts: HTTP requests, File System, Event Loop, and native HTTP server. Watch animations of request lifecycle, async I/O, microtasks, and more.",
  keywords: [
    "Node.js visualizer",
    "backend tutorial",
    "HTTP request animation",
    "Event Loop visualization",
    "Node.js File System",
    "Node.js HTTP server",
    "async JavaScript",
    "microtasks macrotasks",
    "process.nextTick",
    "Node.js for beginners",
    "backend learning",
    "REST API animation",
    "server-side JavaScript",
  ],
  alternates: {
    canonical: `${BASE_URL}/backend`,
  },
  openGraph: {
    title: "Backend Visualizer — Node.js | LogicLab",
    description:
      "Learn Node.js visually: HTTP lifecycle, File System, Event Loop, and native HTTP server — all with step-by-step animations.",
    url: `${BASE_URL}/backend`,
    images: [{ url: `${BASE_URL}/og-backend.png`, width: 1200, height: 630, alt: "Backend Visualizer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backend Visualizer — Node.js | LogicLab",
    description: "Visualize Node.js HTTP, Event Loop, File System and more with interactive animations.",
    images: [`${BASE_URL}/og-backend.png`],
  },
};
