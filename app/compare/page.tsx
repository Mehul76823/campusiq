"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Plus, GitCompare, Check, Minus, Star } from "lucide-react";
import Link from "next/link";
import { CollegeSummary } from "@/types";
import { formatFees, formatPackage, getTypeLabel, getRatingColor } from "@/lib/utils";

interface CompareCollege extends CollegeSummary {
  highestPackage?: number;
  topRecruiters?: string[];
  courses?: { id: string; name: string; duration: number; fees: number }[];
  establishedIn?: number;
  accreditation?: string | null;
  affiliation?: string;
}

const MAX = 3;

export default function ComparePage() {
  const searchParams = useSearchParams();
  const initialSlugs = searchParams.getAll("slugs").flatMap(s => s.split(",")).filter(Boolean);

  const [selected, setSelected] = useState<CompareCollege[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<CollegeSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load initial colleges from query params
  useEffect(() => {
    if (initialSlugs.length === 0) return;
    setLoading(true);
    const params = new URLSearchParams();
    initialSlugs.forEach(s => params.append("slug", s));
    fetch(`/api/compare?${params}`)
      .then(r => r.json())
      .then(data => setSelected(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  // Search colleges to add
  useEffect(() => {
    if (!searchQ.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const res = await fetch(`/api/colleges?q=${encodeURIComponent(searchQ)}&limit=6`);
      const data = await res.json();
      setSearchResults(data.colleges ?? []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  async function addCollege(college: CollegeSummary) {
    if (selected.length >= MAX) return;
    if (selected.some(c => c.id === college.id)) return;

    // Fetch full details
    const res = await fetch(`/api/colleges/${college.slug}`);
    const full = await res.json();
    setSelected(prev => [...prev, full]);
    setSearchQ("");
    setSearchResults([]);
  }

  function removeCollege(id: string) {
    setSelected(prev => prev.filter(c => c.id !== id));
  }

  const rows: { label: string; key: keyof CompareCollege | "type_label" | "exams" | "topRecruiters"; format?: (v: unknown) => string }[] = [
    { label: "Type", key: "type_label" },
    { label: "Location", key: "city" },
    { label: "Established", key: "establishedIn", format: v => String(v ?? "N/A") },
    { label: "NIRF Rank", key: "nirf", format: v => v ? `#${v}` : "N/A" },
    { label: "NAAC Grade", key: "accreditation", format: v => String(v ?? "N/A") },
    { label: "Annual Fees", key: "totalFees", format: v => formatFees(v as number) },
    { label: "Rating", key: "rating", format: v => `${(v as number).toFixed(1)} / 5.0` },
    { label: "Avg Package", key: "avgPackage", format: v => v ? formatPackage(v as number) : "N/A" },
    { label: "Highest Package", key: "highestPackage", format: v => v ? `${v} Cr` : "N/A" },
    { label: "Placement Rate", key: "placementRate", format: v => v ? `${v}%` : "N/A" },
    { label: "Entrance Exams", key: "exams" },
    { label: "Affiliation", key: "affiliation", format: v => String(v ?? "N/A") },
  ];

  function getCellValue(college: CompareCollege, key: string): string {
    if (key === "type_label") return getTypeLabel(college.type);
    if (key === "exams") return college.examsAccepted?.join(", ") || "N/A";
    if (key === "topRecruiters") return college.topRecruiters?.slice(0, 3).join(", ") || "N/A";
    const row = rows.find(r => r.key === key);
    const val = college[key as keyof CompareCollege];
    return row?.format ? row.format(val) : String(val ?? "N/A");
  }

  // Determine best value per numeric row
  function getBestIdx(key: string): number {
    const numericBest: Record<string, "max" | "min"> = {
      avgPackage: "max", highestPackage: "max",
      placementRate: "max", rating: "max",
      nirf: "min", totalFees: "min",
    };
    if (!numericBest[key] || selected.length < 2) return -1;
    const values = selected.map(c => c[key as keyof CompareCollege] as number | null | undefined);
    if (values.some(v => v == null)) return -1;
    const fn = numericBest[key] === "max" ? Math.max : Math.min;
    const best = fn(...(values as number[]));
    const idx = values.indexOf(best);
    return idx;
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">ANALYSIS TOOL</p>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Compare Colleges
          </h1>
          <p className="text-slate-500 text-sm">Side-by-side comparison across fees, placements, rankings and more.</p>
        </div>

        {/* Slot cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: MAX }).map((_, i) => {
            const college = selected[i];
            return (
              <div key={i} className={`glass-card p-5 min-h-[120px] flex flex-col ${!college ? "border-dashed" : ""}`}>
                {college ? (
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300 flex-shrink-0"
                        style={{ fontFamily: "Syne, sans-serif" }}>
                        {college.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                      <button onClick={() => removeCollege(college.id)} className="p-1.5 rounded-lg hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                    <h3 className="font-semibold text-white text-sm leading-snug mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                      {college.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-auto">{college.city}, {college.state}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className={`text-sm font-medium ${getRatingColor(college.rating)}`}
                        style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        {college.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-slate-600 py-4">
                    <div className="w-10 h-10 rounded-xl border border-dashed border-slate-700 flex items-center justify-center">
                      <Plus size={16} />
                    </div>
                    <p className="text-xs">Add college {i + 1}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Search to add */}
        {selected.length < MAX && (
          <div className="relative mb-10 max-w-md">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search and add a college..."
                className="input-field pl-9 text-sm"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 inset-x-0 glass-card rounded-xl overflow-hidden z-20 border border-indigo-500/20 shadow-2xl">
                {searchResults.filter(r => !selected.some(s => s.id === r.id)).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => addCollege(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-500/10 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0"
                      style={{ fontFamily: "Syne, sans-serif" }}>
                      {r.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.city}</p>
                    </div>
                    <Plus size={14} className="text-indigo-400 ml-auto" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comparison table */}
        {selected.length >= 2 ? (
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-indigo-500/10 flex items-center gap-2">
              <GitCompare size={16} className="text-indigo-400" />
              <h2 className="font-semibold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                Detailed Comparison
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-indigo-500/10">
                    <th className="px-5 py-3 text-left w-40">
                      <span className="section-label">Parameter</span>
                    </th>
                    {selected.map((c) => (
                      <th key={c.id} className="px-5 py-3 text-left">
                        <p className="font-semibold text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
                          {c.name}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => {
                    const bestIdx = getBestIdx(row.key as string);
                    return (
                      <tr key={row.key as string} className={`border-b border-indigo-500/8 ${ri % 2 === 0 ? "bg-navy-700/15" : ""} hover:bg-indigo-500/5 transition-colors`}>
                        <td className="px-5 py-3.5 text-xs text-slate-500 font-medium whitespace-nowrap">
                          {row.label}
                        </td>
                        {selected.map((c, ci) => {
                          const val = getCellValue(c, row.key as string);
                          const isBest = bestIdx === ci;
                          return (
                            <td key={c.id} className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                {isBest && (
                                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                    <Check size={10} className="text-emerald-400" />
                                  </div>
                                )}
                                <span className={`text-sm ${isBest ? "text-emerald-300 font-semibold" : "text-slate-300"}`}
                                  style={{ fontFamily: ["nirf", "totalFees", "avgPackage", "highestPackage", "placementRate", "rating"].includes(row.key as string) ? "JetBrains Mono, monospace" : "inherit" }}>
                                  {val}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Top recruiters row */}
            {selected.some(c => (c as CompareCollege).topRecruiters?.length) && (
              <div className="px-5 py-5 border-t border-indigo-500/10">
                <p className="section-label mb-4">Top Recruiters</p>
                <div className="grid gap-4" style={{ gridTemplateColumns: `160px repeat(${selected.length}, 1fr)` }}>
                  <div />
                  {selected.map(c => (
                    <div key={c.id} className="flex flex-wrap gap-2">
                      {((c as CompareCollege).topRecruiters ?? []).slice(0, 5).map(r => (
                        <span key={r} className="text-xs px-2.5 py-1 rounded-lg bg-navy-700/60 border border-indigo-500/10 text-slate-400">
                          {r}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="px-5 py-3 border-t border-indigo-500/10 flex items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Check size={9} className="text-emerald-400" />
                </div>
                Best value in this category
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <GitCompare size={32} className="text-slate-700 mx-auto mb-4" />
            <p className="text-white font-semibold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
              Add at least 2 colleges to compare
            </p>
            <p className="text-slate-500 text-sm mb-6">Search and add colleges using the search box above</p>
            <Link href="/colleges" className="btn-primary inline-flex text-sm">Browse colleges →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
