import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogicJS — JavaScript Execution Visualizer",
  description:
    "Learn how JavaScript works internally. Visualize code execution step by step — variables, conditions, branches, and more.",
  keywords: ["JavaScript", "learning", "visualizer", "education", "code"],
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
