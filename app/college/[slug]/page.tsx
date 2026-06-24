"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Star, Globe, Phone, Mail, Award, TrendingUp,
  BookOpen, Users, ChevronRight, Bookmark, BookmarkCheck,
  GitCompare, ArrowLeft, Building2, Calendar, Percent,
  IndianRupee, ChevronDown, ChevronUp
} from "lucide-react";
import { CollegeDetail, Review } from "@/types";
import { formatFees, formatPackage, getTypeClass, getTypeLabel, getRatingColor, timeAgo } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { SkeletonDetail } from "@/components/ui/Skeleton";
import { Toast, useToast } from "@/components/ui/Toast";

const TABS = ["Overview", "Courses", "Placements", "Reviews"] as const;
type Tab = typeof TABS[number];

export default function CollegeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [isSaved, setIsSaved] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: "", body: "", batch: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { toast, show, hide } = useToast();

  useEffect(() => {
    Promise.all([
      fetch(`/api/colleges/${slug}`).then(r => r.json()),
      fetch("/api/saved").then(r => r.ok ? r.json() : []),
    ]).then(([col, saved]) => {
      if (col.error) router.push("/colleges");
      else {
        setCollege(col);
        setIsSaved(saved.some((c: CollegeDetail) => c.slug === slug));
      }
    }).catch(() => router.push("/colleges"))
      .finally(() => setLoading(false));
  }, [slug, router]);

  async function toggleSave() {
    const method = isSaved ? "DELETE" : "POST";
    const res = await fetch("/api/saved", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId: college!.id }),
    });
    if (res.status === 401) { window.location.href = "/auth/login"; return; }
    if (res.ok) {
      setIsSaved(!isSaved);
      show(isSaved ? "Removed from saved" : "Saved to your list");
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (reviewForm.rating === 0) { show("Please select a rating", "error"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/colleges/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewForm.rating,
          title: reviewForm.title,
          body: reviewForm.body,
          batch: reviewForm.batch ? parseInt(reviewForm.batch) : undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 401) { window.location.href = "/auth/login"; return; }
      if (!res.ok) { show(data.error || "Failed to submit review", "error"); return; }
      setCollege(prev => prev ? { ...prev, reviews: [data, ...prev.reviews] } : prev);
      setReviewForm({ rating: 0, title: "", body: "", batch: "" });
      setShowReviewForm(false);
      show("Review submitted!");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10"><SkeletonDetail /></div>
  );
  if (!college) return null;

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="relative h-48 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 border-b border-indigo-500/10">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 h-full flex items-end pb-0">
          {/* Back */}
          <button onClick={() => router.back()} className="absolute top-6 left-4 flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* College header card */}
        <div className="glass-card p-6 -mt-8 mb-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-xl font-bold text-indigo-300 flex-shrink-0"
              style={{ fontFamily: "Syne, sans-serif" }}>
              {college.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`tag ${getTypeClass(college.type)}`}>{getTypeLabel(college.type)}</span>
                {college.nirf && (
                  <span className="tag" style={{ background: "rgba(247,168,79,0.1)", color: "#f7a84f", border: "1px solid rgba(247,168,79,0.2)" }}>
                    NIRF #{college.nirf}
                  </span>
                )}
                {college.accreditation && (
                  <span className="tag tag-deemed">NAAC {college.accreditation}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
                {college.name}
              </h1>
              <p className="text-slate-400 flex items-center gap-1 text-sm">
                <MapPin size={13} /> {college.location}
              </p>
              {college.affiliation && (
                <p className="text-xs text-slate-600 mt-1">{college.affiliation}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-row sm:flex-col gap-2 sm:items-end">
              <button
                onClick={toggleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${isSaved
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                  : "border-indigo-500/15 text-slate-400 hover:text-white hover:border-indigo-500/30"}`}
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                {isSaved ? "Saved" : "Save"}
              </button>
              <Link
                href={`/compare?slugs=${college.slug}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-indigo-500/15 text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                <GitCompare size={14} /> Compare
              </Link>
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="stat-box">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className={`text-lg font-bold ${getRatingColor(college.rating)}`}
                  style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {college.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-500">{college.reviewCount} reviews</p>
            </div>
            <div className="stat-box">
              <div className="flex items-center justify-center gap-1 mb-1">
                <IndianRupee size={12} className="text-slate-400" />
                <span className="text-base font-bold text-white"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {formatFees(college.totalFees).replace("₹", "")}
                </span>
              </div>
              <p className="text-xs text-slate-500">Annual fees</p>
            </div>
            <div className="stat-box">
              <div className="text-base font-bold text-indigo-300 mb-1"
                style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {college.avgPackage ? formatPackage(college.avgPackage) : "N/A"}
              </div>
              <p className="text-xs text-slate-500">Avg package</p>
            </div>
            <div className="stat-box">
              <div className="text-base font-bold text-emerald-400 mb-1"
                style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {college.placementRate ? `${college.placementRate}%` : "N/A"}
              </div>
              <p className="text-xs text-slate-500">Placement rate</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-navy-700/40 p-1 rounded-xl w-fit border border-indigo-500/10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                ? "bg-indigo-500 text-white shadow-md"
                : "text-slate-400 hover:text-white"}`}
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pb-16">
          {activeTab === "Overview" && (
            <div className="space-y-6">
              {/* About */}
              {college.description && (
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>About</h2>
                  <p className="text-slate-400 leading-relaxed">{college.description}</p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-indigo-500/10">
                    {college.establishedIn && (
                      <div className="flex items-center gap-3">
                        <Calendar size={15} className="text-indigo-400" />
                        <div>
                          <p className="text-xs text-slate-500">Established</p>
                          <p className="text-sm text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>{college.establishedIn}</p>
                        </div>
                      </div>
                    )}
                    {college.affiliation && (
                      <div className="flex items-center gap-3">
                        <Building2 size={15} className="text-indigo-400" />
                        <div>
                          <p className="text-xs text-slate-500">Affiliation</p>
                          <p className="text-sm text-white">{college.affiliation}</p>
                        </div>
                      </div>
                    )}
                    {college.website && (
                      <div className="flex items-center gap-3">
                        <Globe size={15} className="text-indigo-400" />
                        <a href={college.website} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                          Visit website →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Exams */}
              {college.examsAccepted.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
                    <BookOpen size={16} className="text-indigo-400" /> Exams Accepted
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {college.examsAccepted.map(exam => (
                      <span key={exam} className="px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/8 text-sm text-indigo-300">
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Courses" && (
            <div className="glass-card overflow-hidden">
              <div className="p-5 border-b border-indigo-500/10">
                <h2 className="text-lg font-semibold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                  Available Courses
                </h2>
              </div>
              <div className="divide-y divide-indigo-500/10">
                {college.courses.map((course) => (
                  <div key={course.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-indigo-500/5 transition-colors">
                    <div>
                      <p className="font-medium text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>{course.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{course.duration} year{course.duration > 1 ? "s" : ""} program</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {formatFees(course.fees)}
                        </p>
                        <p className="text-xs text-slate-500">Annual fees</p>
                      </div>
                      {course.seats && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                            {course.seats}
                          </p>
                          <p className="text-xs text-slate-500">Seats</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Placements" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Average Package", value: college.avgPackage ? `${formatPackage(college.avgPackage)}` : "N/A", icon: TrendingUp, color: "text-indigo-400" },
                  { label: "Highest Package", value: college.highestPackage ? `${college.highestPackage} Cr` : "N/A", icon: Award, color: "text-amber-400" },
                  { label: "Placement Rate", value: college.placementRate ? `${college.placementRate}%` : "N/A", icon: Percent, color: "text-emerald-400" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="glass-card p-6 text-center">
                    <Icon size={24} className={`${color} mx-auto mb-3`} />
                    <p className={`text-2xl font-bold ${color} mb-1`} style={{ fontFamily: "JetBrains Mono, monospace" }}>{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              {college.topRecruiters.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Syne, sans-serif" }}>
                    <Users size={16} className="text-indigo-400" /> Top Recruiters
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {college.topRecruiters.map((r) => (
                      <div key={r} className="px-4 py-2 rounded-xl bg-navy-700/60 border border-indigo-500/15 text-sm text-slate-300 font-medium">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="space-y-4">
              {/* Write review */}
              <div className="glass-card overflow-hidden">
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-indigo-500/5 transition-colors"
                >
                  <span className="font-semibold text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>
                    Write a Review
                  </span>
                  {showReviewForm ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>

                {showReviewForm && (
                  <form onSubmit={submitReview} className="px-5 pb-5 space-y-4 border-t border-indigo-500/10 pt-4">
                    <div>
                      <label className="section-label block mb-2">Your Rating *</label>
                      <StarRating
                        value={reviewForm.rating}
                        onChange={(v) => setReviewForm(f => ({ ...f, rating: v }))}
                        size={24}
                      />
                    </div>
                    <div>
                      <label className="section-label block mb-2">Title</label>
                      <input
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="Summarize your experience"
                        className="input-field text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="section-label block mb-2">Review</label>
                      <textarea
                        value={reviewForm.body}
                        onChange={(e) => setReviewForm(f => ({ ...f, body: e.target.value }))}
                        placeholder="Share your experience with placements, faculty, infrastructure..."
                        className="input-field text-sm resize-none"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={reviewForm.batch}
                        onChange={(e) => setReviewForm(f => ({ ...f, batch: e.target.value }))}
                        placeholder="Batch year (e.g. 2022)"
                        className="input-field text-sm w-44"
                        min={2000} max={2030}
                      />
                      <button type="submit" disabled={submitting} className="btn-primary text-sm disabled:opacity-60">
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Reviews list */}
              {college.reviews.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <p className="text-slate-500">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                college.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <StarRating value={review.rating} readonly size={14} />
          <h4 className="font-semibold text-white text-sm mt-1" style={{ fontFamily: "Syne, sans-serif" }}>
            {review.title}
          </h4>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-500">{timeAgo(review.createdAt)}</p>
          {review.batch && <p className="text-xs text-slate-600">Batch of {review.batch}</p>}
        </div>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{review.body}</p>
      <p className="text-xs text-slate-600 mt-3">— {review.user.name ?? "Anonymous"}</p>
    </div>
  );
}
