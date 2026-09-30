import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo_Black, DM_Mono, Space_Grotesk } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Frontend Developer`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Yussif Sare, frontend developer from Accra, Ghana. Profile, arsenal, quests, and contact.",
  keywords: [
    "Yussif Sare",
    "frontend developer",
    "web developer",
    "frontend engineer",
    "Accra",
    "Ghana",
    "React",
    "Next.js",
    "GSAP",
    "motion design",
    "portfolio",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Frontend Developer`,
    description:
      "Yussif Sare, frontend developer from Accra, Ghana. Profile, arsenal, quests, and contact.",
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Frontend Developer, Accra Ghana`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Frontend Developer`,
    description:
      "Yussif Sare, frontend developer from Accra, Ghana. Profile, arsenal, quests, and contact.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${dmMono.variable}`} lang="en">
      <body>
        {children}
        <JsonLd />
      </body>
    </html>
  );
}
