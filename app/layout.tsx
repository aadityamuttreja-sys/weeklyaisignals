import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { Masthead } from "@/components/Masthead";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: { default: "Weekly AI Signals", template: "%s · Weekly AI Signals" },
  description: "A weekly read of what changed in AI. Curated, skeptical, short.",
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body>
        <div className="tx-scanline" aria-hidden />
        <div className="tx-content">
          <Masthead />
          {children}
        </div>
      </body>
    </html>
  );
}
