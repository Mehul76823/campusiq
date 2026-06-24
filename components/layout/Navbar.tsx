"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Search, GitCompare, Bookmark, LogIn, Menu, X, Sparkles } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { href: "/colleges", label: "Explore", icon: Search },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-xl border-b border-indigo-500/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:border-indigo-500/60 transition-colors">
            <Sparkles size={15} className="text-indigo-400" />
          </div>
          <span
            className="font-syne font-bold text-lg tracking-tight text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Campus<span className="text-indigo-400">IQ</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                pathname.startsWith(href)
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            <LogIn size={15} />
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="btn-primary text-sm flex items-center gap-2"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-navy-800/95 backdrop-blur-xl border-b border-indigo-500/10 py-4 px-4 flex flex-col gap-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-indigo-500/10 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <div className="border-t border-indigo-500/10 pt-3 mt-1 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="px-4 py-3 text-sm text-slate-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="btn-primary text-sm text-center"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
