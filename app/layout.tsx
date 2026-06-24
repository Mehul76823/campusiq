import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "CampusIQ — College Discovery, Reimagined",
  description:
    "Discover, compare, and shortlist India's top engineering and MBA colleges with real data.",
  keywords: ["college search", "india colleges", "engineering admission", "JEE colleges"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-navy-900 text-slate-200 antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
