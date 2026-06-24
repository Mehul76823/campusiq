"use client";

import Link from "next/link";
import { MapPin, Star, TrendingUp, IndianRupee, BookOpen, Bookmark, BookmarkCheck } from "lucide-react";
import { CollegeSummary } from "@/types";
import { formatFees, formatPackage, getTypeClass, getTypeLabel, getRatingColor } from "@/lib/utils";
import { useState } from "react";

interface CollegeCardProps {
  college: CollegeSummary;
  savedIds?: string[];
  onSaveToggle?: (id: string, saved: boolean) => void;
}

export function CollegeCard({ college, savedIds = [], onSaveToggle }: CollegeCardProps) {
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
      <article className="glass-card p-6 h-full flex flex-col cursor-pointer group transition-all duration-200 relative">
        {/* Save button */}
        <button
          onClick={toggleSave}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-indigo-500/10 transition-colors z-10"
          title={isSaved ? "Remove from saved" : "Save college"}
        >
          {isSaved ? (
            <BookmarkCheck size={16} className="text-indigo-400" />
          ) : (
            <Bookmark size={16} className="text-slate-600 group-hover:text-slate-400" />
          )}
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4 pr-8">
          {/* Logo placeholder */}
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold text-sm"
            style={{ fontFamily: "Syne, sans-serif" }}>
            {college.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-indigo-300 transition-colors mb-1"
              style={{ fontFamily: "Syne, sans-serif" }}>
              {college.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin size={10} /> {college.city}, {college.state}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`tag ${getTypeClass(college.type)}`}>{getTypeLabel(college.type)}</span>
          {college.nirf && (
            <span className="tag" style={{ background: "rgba(247,168,79,0.1)", color: "#f7a84f", border: "1px solid rgba(247,168,79,0.2)" }}>
              NIRF #{college.nirf}
            </span>
          )}
          {college.accreditation && (
            <span className="tag" style={{ background: "rgba(139,156,199,0.1)", color: "#b0bdd9", border: "1px solid rgba(139,156,199,0.2)" }}>
              {college.accreditation}
            </span>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="stat-box">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className={`text-base font-bold ${getRatingColor(college.rating)}`}
                style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {college.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-slate-500">{college.reviewCount} reviews</p>
          </div>
          <div className="stat-box">
            <div className="flex items-center justify-center gap-1 mb-1">
              <IndianRupee size={11} className="text-slate-400" />
              <span className="text-sm font-bold text-white"
                style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {formatFees(college.totalFees).replace("₹", "")}
              </span>
            </div>
            <p className="text-xs text-slate-500">Annual fees</p>
          </div>
        </div>

        {/* Placement bar */}
        {college.avgPackage && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 flex items-center gap-1"><TrendingUp size={10} /> Avg Package</span>
              <span className="text-indigo-300 font-medium" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {formatPackage(college.avgPackage)}
              </span>
            </div>
            {college.placementRate && (
              <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                  style={{ width: `${college.placementRate}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Exams */}
        {college.examsAccepted.length > 0 && (
          <div className="mt-auto pt-3 border-t border-indigo-500/10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <BookOpen size={10} className="text-slate-600" />
              {college.examsAccepted.slice(0, 3).map((e) => (
                <span key={e} className="text-xs text-slate-500">{e}</span>
              ))}
            </div>
          </div>
        )}
      </article>
    </Link>
  );
}
