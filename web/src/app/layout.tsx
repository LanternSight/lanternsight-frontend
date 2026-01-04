// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LanternSight",
  description: "AI Copilot with Video Citations",
};

import { ClientLayout } from "@/components/layout/ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <body className="bg-[var(--background)] h-full overflow-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
