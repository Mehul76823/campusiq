"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkX, GitCompare, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { CollegeSummary } from "@/types";
import { CollegeCard } from "@/components/college/CollegeCard";
import { Toast, useToast } from "@/components/ui/Toast";

export default function SavedPage() {
  const [colleges, setColleges] = useState<CollegeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);
  const { toast, show, hide } = useToast();

  useEffect(() => {
    fetch("/api/saved")
      .then(r => {
        if (r.status === 401) { setAuthed(false); return []; }
        return r.json();
      })
      .then(data => setColleges(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  function handleSaveToggle(id: string, saved: boolean) {
    if (!saved) {
      setColleges(prev => prev.filter(c => c.id !== id));
      show("Removed from saved list");
    }
  }

  const savedIds = colleges.map(c => c.id);
  const compareUrl = `/compare?${colleges.slice(0, 3).map(c => `slugs=${c.slug}`).join("&")}`;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-md w-full">
          <Sparkles size={32} className="text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
            Sign in to view saved
          </h2>
          <p className="text-slate-400 text-sm mb-8">Create a free account to save colleges and build your shortlist.</p>
          <div className="flex flex-col gap-3">
            <Link href="/auth/login" className="btn-primary text-center">Sign In</Link>
            <Link href="/auth/signup" className="btn-ghost text-center text-sm">Create account</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="section-label mb-2">MY LIST</p>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Saved Colleges
            </h1>
            {!loading && (
              <p className="text-slate-500 text-sm mt-1">
                {colleges.length} college{colleges.length !== 1 ? "s" : ""} in your list
              </p>
            )}
          </div>

          {colleges.length >= 2 && (
            <Link
              href={compareUrl}
              className="flex items-center gap-2 btn-primary text-sm"
            >
              <GitCompare size={15} />
              Compare saved
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card p-6 h-64 shimmer" />
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Bookmark size={36} className="text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              No colleges saved yet
            </h3>
            <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
              Bookmark colleges while browsing to build your shortlist here.
            </p>
            <Link href="/colleges" className="btn-primary inline-flex items-center gap-2">
              Browse colleges <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {colleges.map(college => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  savedIds={savedIds}
                  onSaveToggle={handleSaveToggle}
                />
              ))}
            </div>

            {/* Quick actions */}
            {colleges.length >= 2 && (
              <div className="mt-10 glass-card p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div>
                  <p className="font-semibold text-white text-sm mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                    Ready to decide?
                  </p>
                  <p className="text-xs text-slate-500">Compare your saved colleges side by side.</p>
                </div>
                <Link href={compareUrl} className="btn-primary text-sm flex items-center gap-2 flex-shrink-0">
                  <GitCompare size={15} /> Compare all →
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}
