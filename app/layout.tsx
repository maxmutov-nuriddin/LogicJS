import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogicLab — JavaScript & CSS Visualizer",
  description:
    "Learn how JavaScript and CSS work interactively. Visualize JS code execution step by step and explore Flexbox, Grid, and animations visually.",
  keywords: ["JavaScript", "CSS", "learning", "visualizer", "education", "code", "flexbox", "grid"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
