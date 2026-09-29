import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo_Black, DM_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-archivo-black",
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Yussif Sare — Frontend Developer",
  description: "Yussif Sare, frontend developer from Accra, Ghana. Profile, arsenal, quests, and contact.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${dmMono.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
