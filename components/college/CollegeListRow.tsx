"use client";

import Link from "next/link";
import { MapPin, Star, TrendingUp, IndianRupee, Bookmark, BookmarkCheck, ArrowRight } from "lucide-react";
import { CollegeSummary } from "@/types";
import { formatFees, formatPackage, getTypeClass, getTypeLabel, getRatingColor } from "@/lib/utils";
import { useState } from "react";

interface CollegeListRowProps {
  college: CollegeSummary;
  savedIds?: string[];
  onSaveToggle?: (id: string, saved: boolean) => void;
}

export function CollegeListRow({ college, savedIds = [], onSaveToggle }: CollegeListRowProps) {
  const isSaved = savedIds.includes(college.id);
  const [saving, setSaving] = useState(false);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const method = isSaved ? "DELETE" : "POST";
      const res = await fetch("/api/saved", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: college.id }),
      });
      if (res.ok) onSaveToggle?.(college.id, !isSaved);
      else if (res.status === 401) window.location.href = "/auth/login";
    } finally {
      setSaving(false);
    }
  }

  return (
    <Link href={`/college/${college.slug}`}>
      <article className="glass-card px-5 py-4 flex items-center gap-4 cursor-pointer group hover:border-indigo-500/30 transition-all">
        {/* Rank */}
        {college.nirf && (
          <div className="w-10 text-center flex-shrink-0">
            <span className="text-xs text-slate-600" style={{ fontFamily: "JetBrains Mono, monospace" }}>#{college.nirf}</span>
          </div>
        )}

        {/* Logo */}
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-400"
          style={{ fontFamily: "Syne, sans-serif" }}>
          {college.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </div>

        {/* Name + location */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors truncate"
            style={{ fontFamily: "Syne, sans-serif" }}>
            {college.name}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin size={9} /> {college.city}, {college.state}
          </p>
        </div>

        {/* Type tag */}
        <span className={`tag ${getTypeClass(college.type)} hidden sm:inline-flex`}>
          {getTypeLabel(college.type)}
        </span>

        {/* Rating */}
        <div className="flex items-center gap-1 w-16 flex-shrink-0">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className={`text-sm font-medium ${getRatingColor(college.rating)}`}
            style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {college.rating.toFixed(1)}
          </span>
        </div>

        {/* Fees */}
        <div className="w-24 flex-shrink-0 hidden md:block">
          <div className="flex items-center gap-1">
            <IndianRupee size={10} className="text-slate-500" />
            <span className="text-xs text-slate-300" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {formatFees(college.totalFees).replace("₹", "")}
            </span>
          </div>
          <p className="text-xs text-slate-600">Annual</p>
        </div>

        {/* Package */}
        {college.avgPackage && (
          <div className="w-24 flex-shrink-0 hidden lg:block">
            <div className="flex items-center gap-1">
              <TrendingUp size={10} className="text-indigo-400" />
              <span className="text-xs text-indigo-300" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {formatPackage(college.avgPackage)}
              </span>
            </div>
            <p className="text-xs text-slate-600">Avg pkg</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={toggleSave} className="p-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors">
            {isSaved
              ? <BookmarkCheck size={14} className="text-indigo-400" />
              : <Bookmark size={14} className="text-slate-600 group-hover:text-slate-400" />}
          </button>
          <ArrowRight size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
        </div>
      </article>
    </Link>
  );
}
