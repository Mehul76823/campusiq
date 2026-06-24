"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  Building2,
  BookOpen,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";

const PLACEHOLDERS = [
  "Search IIT Bombay, NIT Trichy...",
  "Find colleges accepting JEE Main...",
  "Explore B.Tech Computer Science...",
  "Compare fees across top NITs...",
  "Search colleges in Bangalore...",
];

const STATS = [
  { value: "500+", label: "Colleges", icon: Building2 },
  { value: "4.8★", label: "Avg rating accuracy", icon: Award },
  { value: "98%", label: "Data verified", icon: Target },
  { value: "2L+", label: "Students helped", icon: TrendingUp },
];

const FEATURED = [
  { name: "IIT Madras", rank: "#1 NIRF", tag: "Government", slug: "iit-madras" },
  { name: "IIT Delhi", rank: "#2 NIRF", tag: "Government", slug: "iit-delhi" },
  { name: "IIT Bombay", rank: "#3 NIRF", tag: "Government", slug: "iit-bombay" },
  { name: "BITS Pilani", rank: "#16 NIRF", tag: "Deemed", slug: "bits-pilani" },
  { name: "NIT Trichy", rank: "#10 NIRF", tag: "Government", slug: "nit-trichy" },
  { name: "VIT Vellore", rank: "#11 NIRF", tag: "Private", slug: "vit-vellore" },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const [phIndex, setPhIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPhIndex((i) => {
        const next = (i + 1) % PLACEHOLDERS.length;
        setPlaceholder(PLACEHOLDERS[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/colleges?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />

        {/* Content */}
        <div
          className="relative z-10 text-center max-w-4xl mx-auto"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease" }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 mb-8">
            <Zap size={12} className="text-indigo-400" />
            <span
              className="section-label text-indigo-400"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}
            >
              INDIA'S SMARTEST COLLEGE DISCOVERY
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Find your{" "}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-indigo-500">
                perfect college
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="6"
                viewBox="0 0 300 6"
                fill="none"
              >
                <path
                  d="M0 3 Q75 0 150 3 Q225 6 300 3"
                  stroke="#4F6EF7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
            </span>
            <br />
            with real data.
          </h1>

          <p
            className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Compare fees, placements, rankings, and reviews across India's top engineering and
            management colleges — all in one place.
          </p>

          {/* Search bar — the hero interaction */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-indigo-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-center bg-navy-700/90 backdrop-blur-sm border border-indigo-500/20 rounded-2xl overflow-hidden focus-within:border-indigo-500/50 transition-colors">
                <Search size={20} className="ml-5 text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent px-4 py-5 text-white placeholder:text-slate-600 text-lg outline-none"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
                <button
                  type="submit"
                  className="m-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  Search
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </form>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {["JEE Advanced", "JEE Main", "BITSAT", "Government", "Private", "Deemed"].map(
              (tag) => (
                <Link
                  key={tag}
                  href={`/colleges?filter=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 rounded-lg border border-indigo-500/15 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/35 transition-all text-xs"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {tag}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Scroll fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-navy-900 to-transparent" />
      </section>

      {/* ── Stats Strip ── */}
      <section className="relative py-10 border-y border-indigo-500/10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-indigo-400" />
              </div>
              <div>
                <div
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {value}
                </div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Colleges ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-2">TOP PICKS</p>
              <h2
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Trending Colleges
              </h2>
            </div>
            <Link
              href="/colleges"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED.map(({ name, rank, tag, slug }, i) => (
              <Link key={slug} href={`/college/${slug}`}>
                <div className="glass-card p-6 cursor-pointer group transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`tag ${
                        tag === "Government"
                          ? "tag-gov"
                          : tag === "Deemed"
                          ? "tag-deemed"
                          : "tag-private"
                      }`}
                    >
                      {tag}
                    </div>
                    <span
                      className="text-xs text-slate-500"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      #{i + 1}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {name}
                  </h3>
                  <p className="text-sm text-slate-500">{rank}</p>

                  <div className="mt-4 pt-4 border-t border-indigo-500/10 flex items-center justify-between">
                    <span className="text-xs text-slate-500">View details</span>
                    <ArrowRight
                      size={14}
                      className="text-indigo-500 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 px-4 border-t border-indigo-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">WHY CAMPUSIQ</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Decision-grade data,
              <br />
              <span className="text-indigo-400">not opinion.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Side-by-side Compare",
                desc: "Compare up to 3 colleges on fees, placements, rankings, and courses simultaneously.",
                link: "/compare",
              },
              {
                icon: Search,
                title: "Smart Search & Filter",
                desc: "Filter by exam, fees range, state, college type, and NIRF ranking with instant results.",
                link: "/colleges",
              },
              {
                icon: BookOpen,
                title: "Deep College Profiles",
                desc: "Full course listings, placement stats, top recruiters, and verified reviews in one page.",
                link: "/colleges",
              },
            ].map(({ icon: Icon, title, desc, link }) => (
              <Link key={title} href={link}>
                <div className="glass-card p-7 h-full group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/12 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:border-indigo-500/50 transition-colors">
                    <Icon size={20} className="text-indigo-400" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-white mb-2"
                    style={{ fontFamily: "Syne, sans-serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 to-transparent" />
            <div className="relative">
              <p className="section-label mb-4">GET STARTED FREE</p>
              <h2
                className="text-3xl font-bold text-white mb-4"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                Save colleges, track decisions.
              </h2>
              <p className="text-slate-400 mb-8">
                Create a free account to save colleges, build comparison lists, and track your
                shortlist.
              </p>
              <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2">
                Create free account <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-500/10 py-8 px-4 text-center text-xs text-slate-600">
        <p style={{ fontFamily: "JetBrains Mono, monospace" }}>
          © 2024 CampusIQ — Built for Indian students, by engineers.
        </p>
      </footer>
    </div>
  );
}
