import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import CommandPalette from "@/components/ui/CommandPalette";
import ToastNotification from "@/components/ui/ToastNotification";

export const metadata: Metadata = {
  title: "RESQFOOD — Rescue Food. Route Hope.",
  description:
    "Next-generation AI Food Rescue SaaS Platform connecting donors, shelters, and drivers in real time with explainable matching and verified impact.",
  keywords: [
    "food rescue",
    "food waste",
    "AI logistics",
    "sustainability",
    "ESG",
    "hunger relief",
  ],
  openGraph: {
    title: "RESQFOOD — Rescue Food. Route Hope.",
    description:
      "Turn surplus food into real-time impact. Fast, intelligent, traceable, and scalable food rescue network.",
    url: "https://resqfood.org",
    siteName: "RESQFOOD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-resq-bg text-resq-text antialiased flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <MobileBottomNav />
        <CommandPalette />
        <ToastNotification />
      </body>
    </html>
  );
}
