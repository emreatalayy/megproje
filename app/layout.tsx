import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Yeşil Vadi Parkı | Doğayla buluş",
  description:
    "Şehrin kalbinde yeşil bir kaçış: yürüyüş yolları, oyun alanları ve huzurlu bir piknik köşesi.",
  openGraph: {
    title: "Yeşil Vadi Parkı",
    description: "Doğayla buluş, nefes al.",
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
