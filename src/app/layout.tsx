import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ali Haider | Software Engineer",
  description: "Portfolio of Ali Haider, a Software Engineer building modern web, mobile, and full-stack applications.",
  openGraph: {
    title: "Ali Haider | Software Engineer",
    description: "Portfolio of Ali Haider, a Software Engineer building modern web, mobile, and full-stack applications.",
    url: "https://alihaider.dev",
    siteName: "Ali Haider Portfolio",
    type: "website",
  },
};

import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden`} suppressHydrationWarning>
        <CustomCursor />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
