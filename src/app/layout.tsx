import { Header } from "@/components/Header";
import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from "@/lib/brand";
import { getSiteUrlSync } from "@/lib/site-url";
import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrlSync();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: "Lista de presentes — casamento",
  description: "Reserva um presente e celebra connosco.",
  icons: {
    icon: [
      {
        url: BRAND_LOGO_SRC,
        type: "image/avif",
        sizes: "any",
      },
    ],
    shortcut: [{ url: BRAND_LOGO_SRC, type: "image/avif" }],
    apple: [{ url: BRAND_LOGO_SRC, type: "image/avif", sizes: "180x180" }],
  },
  openGraph: {
    title: "Lista de presentes — casamento",
    description: "Reserva um presente e celebra connosco.",
    images: [{ url: BRAND_LOGO_SRC, alt: BRAND_LOGO_ALT }],
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Lista de presentes — casamento",
    description: "Reserva um presente e celebra connosco.",
    images: [BRAND_LOGO_SRC],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
