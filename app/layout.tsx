import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";

const sans = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const display = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Meg Proje | Yakında",
  description:
    "Meg Proje — Mimarlık, iç mimarlık ve mühendislik. Kurumsal web sitemiz yakında.",
  openGraph: {
    title: "Meg Proje",
    description: "Mimarlık · İç mimarlık · Mühendislik — Yakında.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${sans.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}
