import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Pitch Perfect | Perfect Your Pitch with AI Feedback",
  description: "Improve your pitch presentations with AI-powered feedback through our Discord bot. Get real-time analysis and suggestions to perfect your delivery.",
  keywords: ["pitch feedback", "discord bot", "AI feedback", "presentation practice", "pitch perfect"],
  openGraph: {
    title: "Pitch Perfect | AI-Powered Pitch Feedback Bot",
    description: "Practice and perfect your pitch presentations with AI-powered feedback via Discord.",
    images: ["/images/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable}`}>
        {children}
      </body>
    </html>
  );
} 