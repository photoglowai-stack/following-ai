import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff005c",
};

export const metadata: Metadata = {
  title: {
    default: "Recently Followed — See Who Someone Followed on Instagram",
    template: "%s | Recently Followed",
  },
  description:
    "Enter a public Instagram username and generate a clean preview of recent public following activity. No login required. Public profiles only.",
  keywords: [
    "instagram following checker",
    "who did they follow instagram",
    "recently followed instagram",
    "instagram follower activity",
    "public instagram preview",
  ],
  authors: [{ name: "Recently Followed" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://recently-followed.com",
    siteName: "Recently Followed",
    title: "Recently Followed — See Who Someone Followed on Instagram",
    description:
      "Generate a clean public preview of recent Instagram following activity. No login required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recently Followed — See Who Someone Followed on Instagram",
    description:
      "Generate a clean public preview of recent Instagram following activity. No login required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
