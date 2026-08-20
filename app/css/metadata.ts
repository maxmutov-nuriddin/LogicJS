import type { Metadata } from "next";

const BASE_URL = "https://logiclab.dev";

export const metadata: Metadata = {
  title: "CSS Visualizer",
  description:
    "Interactive CSS visualizer covering Flexbox, Grid, Box Model, Position, Animations, Transitions, Responsive design, Box Shadow, Pseudo-classes and Pseudo-elements with live previews.",
  keywords: [
    "CSS visualizer",
    "Flexbox tutorial",
    "CSS Grid tutorial",
    "CSS animations",
    "Box Model visualizer",
    "CSS transitions",
    "responsive CSS",
    "CSS pseudo-class",
    "CSS pseudo-element",
    "CSS box shadow",
    "interactive CSS learning",
    "CSS playground",
    "learn CSS online",
  ],
  alternates: {
    canonical: `${BASE_URL}/css`,
  },
  openGraph: {
    title: "CSS Visualizer — LogicLab",
    description:
      "Explore Flexbox, Grid, animations, transitions and more with live interactive CSS previews. Change values and see instant results.",
    url: `${BASE_URL}/css`,
    images: [{ url: `${BASE_URL}/og-css.png`, width: 1200, height: 630, alt: "CSS Visualizer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSS Visualizer — LogicLab",
    description: "Interactive Flexbox, Grid, animations and more — with live CSS previews.",
    images: [`${BASE_URL}/og-css.png`],
  },
};
