import type { Metadata } from "next";
import { Inter } from "next/font/google";
export const dynamic = "auto";
import "@/app/globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CartaFlow",
  description: " A card sorting web app.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
