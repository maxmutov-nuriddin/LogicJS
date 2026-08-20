import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = "https://logiclab.dev";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
    { media: "(prefers-color-scheme: light)", color: "#0d1117" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "LogicLab — JavaScript, CSS & Backend Visualizer",
    template: "%s | LogicLab",
  },

  description:
    "LogicLab — o'rganuvchilar uchun interaktiv JavaScript, CSS va Backend vizualizatori. JS kodni qadam-baqadam vizualizatsiya qiling, Flexbox/Grid animatsiyalarini ko'ring, Node.js HTTP, Event Loop va File System'ni tushunib oling.",

  keywords: [
    "JavaScript visualizer",
    "CSS visualizer",
    "JS code execution",
    "learn JavaScript",
    "learn CSS",
    "flexbox tutorial",
    "grid tutorial",
    "Node.js tutorial",
    "backend visualizer",
    "HTTP request animation",
    "event loop animation",
    "JavaScript playground",
    "interactive coding",
    "web development learning",
    "JS step by step",
    "CSS animations",
    "code education",
    "programming tutorial",
    "frontend learning",
    "backend learning",
    "O'zbekiston dasturlash",
    "JavaScript o'rganish",
    "CSS o'rganish",
  ],

  authors: [{ name: "LogicLab Team" }],
  creator: "LogicLab",
  publisher: "LogicLab",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "LogicLab",
    title: "LogicLab — JavaScript, CSS & Backend Visualizer",
    description:
      "Interactive visualizer for JavaScript execution, CSS layout, Node.js backend concepts. Learn by watching your code come alive — step by step animations.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "LogicLab — Interactive Code Visualizer",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "LogicLab — JavaScript, CSS & Backend Visualizer",
    description:
      "Interactive visualizer for JavaScript execution, CSS layout, Node.js backend concepts. Learn by watching your code come alive.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@logiclab_dev",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },

  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "LogicLab",
              url: BASE_URL,
              description:
                "Interactive JavaScript, CSS and Backend visualizer for learning web development concepts through step-by-step animations.",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "JavaScript execution visualizer",
                "CSS Flexbox and Grid visualizer",
                "Node.js backend concepts animator",
                "HTTP request/response animation",
                "Event Loop simulation",
                "File System operations",
                "Performance benchmark tool",
              ],
              author: {
                "@type": "Organization",
                name: "LogicLab",
                url: BASE_URL,
              },
            }),
          }}
        />
      </head>
      <body className="bg-background text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
