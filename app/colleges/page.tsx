"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, LayoutGrid, List } from "lucide-react";
import { CollegeCard } from "@/components/college/CollegeCard";
import { FilterPanel } from "@/components/college/FilterPanel";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { CollegeSummary, FiltersState } from "@/types";
import { CollegeListRow } from "@/components/college/CollegeListRow";

const DEFAULT_FILTERS: FiltersState = {
  q: "", type: "", state: "", exam: "",
  minFees: "0", maxFees: "9999999", minRating: "0", sort: "ranking",
};

export default function CollegesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<FiltersState>({
    ...DEFAULT_FILTERS,
    q: searchParams.get("q") ?? "",
    type: searchParams.get("type") ?? "",
    state: searchParams.get("state") ?? "",
    exam: searchParams.get("exam") ?? "",
  });

  const [colleges, setColleges] = useState<CollegeSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Fetch colleges
  const fetchColleges = useCallback(async (f: FiltersState, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({
      ...f, page: String(p), limit: "12",
    });
    try {
      const res = await fetch(`/api/colleges?${params}`);
      const data = await res.json();
      setColleges(data.colleges ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch saved
  useEffect(() => {
    fetch("/api/saved")
      .then((r) => r.ok ? r.json() : [])
      .then((data: CollegeSummary[]) => setSavedIds(data.map((c) => c.id)))
      .catch(() => {});
  }, []);

  // Debounce text search; immediate for everything else
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchColleges(filters, 1);
    }, filters.q ? 400 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchColleges]);

  function handleFilterChange(key: keyof FiltersState, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    router.push("/colleges");
  }

  function handleSaveToggle(id: string, saved: boolean) {
    setSavedIds((prev) => saved ? [...prev, id] : prev.filter((x) => x !== id));
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <p className="section-label mb-2">DISCOVER</p>
          <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Explore Colleges
          </h1>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => handleFilterChange("q", e.target.value)}
              placeholder="Search by name, city, or course..."
              className="input-field pl-10 pr-10"
            />
            {filters.q && (
              <button
                onClick={() => handleFilterChange("q", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            total={total}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                <span className="text-white font-medium" style={{ fontFamily: "JetBrains Mono, monospace" }}>{total}</span> colleges
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-indigo-500/15 text-indigo-400" : "text-slate-500 hover:text-white"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-indigo-500/15 text-indigo-400" : "text-slate-500 hover:text-white"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className={viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                : "flex flex-col gap-3"}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : colleges.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-white font-semibold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>No colleges found</p>
                <p className="text-slate-500 text-sm mb-4">Try adjusting your filters or search term</p>
                <button onClick={handleReset} className="btn-ghost text-sm">Clear all filters</button>
              </div>
            ) : (
              <>
                <div className={viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"}>
                  {colleges.map((college) =>
                    viewMode === "grid" ? (
                      <CollegeCard
                        key={college.id}
                        college={college}
                        savedIds={savedIds}
                        onSaveToggle={handleSaveToggle}
                      />
                    ) : (
                      <CollegeListRow
                        key={college.id}
                        college={college}
                        savedIds={savedIds}
                        onSaveToggle={handleSaveToggle}
                      />
                    )
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      disabled={page === 1}
                      onClick={() => { setPage(p => p - 1); fetchColleges(filters, page - 1); }}
                      className="btn-ghost text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPage(p); fetchColleges(filters, p); }}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p
                          ? "bg-indigo-500 text-white"
                          : "text-slate-400 hover:text-white hover:bg-indigo-500/10"}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => { setPage(p => p + 1); fetchColleges(filters, page + 1); }}
                      className="btn-ghost text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
