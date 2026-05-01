import type { Metadata } from "next";
import "./globals.css";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Weekly AI Signals",
    template: "%s · Weekly AI Signals",
  },
  description:
    "A weekly read on what changed in AI — for executives, builders, and practitioners.",
  openGraph: {
    title: "Weekly AI Signals",
    description:
      "A weekly read on what changed in AI — for executives, builders, and practitioners.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Weekly AI Signals"
          href="/rss.xml"
        />
      </head>
      <body className="bg-paper text-ink">
        <Masthead />
        <main className="mx-auto w-full max-w-prose px-6 pb-24 pt-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
