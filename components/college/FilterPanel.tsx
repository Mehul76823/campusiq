"use client";

import { FiltersState } from "@/types";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FilterPanelProps {
  filters: FiltersState;
  onChange: (key: keyof FiltersState, value: string) => void;
  onReset: () => void;
  total: number;
}

const STATES = [
  "Maharashtra", "Tamil Nadu", "Delhi", "Karnataka", "Telangana",
  "Rajasthan", "Uttar Pradesh", "West Bengal", "Gujarat", "Madhya Pradesh",
];
const EXAMS = ["JEE Advanced", "JEE Main", "BITSAT", "VITEEE", "MET", "COMEDK"];
const TYPES = [
  { value: "GOVERNMENT", label: "Government" },
  { value: "PRIVATE", label: "Private" },
  { value: "DEEMED", label: "Deemed" },
  { value: "AUTONOMOUS", label: "Autonomous" },
];
const SORTS = [
  { value: "ranking", label: "NIRF Ranking" },
  { value: "rating", label: "Rating" },
  { value: "fees_asc", label: "Fees: Low → High" },
  { value: "fees_desc", label: "Fees: High → Low" },
  { value: "package", label: "Avg Package" },
  { value: "name", label: "Name A–Z" },
];

export function FilterPanel({ filters, onChange, onReset, total }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const activeCount = [filters.type, filters.state, filters.exam, filters.minRating !== "0" ? "1" : ""].filter(Boolean).length;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex items-center gap-2 btn-ghost text-sm mb-4"
      >
        <SlidersHorizontal size={15} />
        Filters {activeCount > 0 && <span className="bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeCount}</span>}
      </button>

      <aside className={`${open ? "block" : "hidden"} md:block w-full md:w-64 flex-shrink-0`}>
        <div className="glass-card p-5 sticky top-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-indigo-400" />
              <span className="font-semibold text-sm text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                Filters
              </span>
              {activeCount > 0 && (
                <span className="text-xs bg-indigo-500/20 text-indigo-300 rounded-full px-2 py-0.5">{activeCount}</span>
              )}
            </div>
            {activeCount > 0 && (
              <button onClick={onReset} className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors">
                <X size={12} /> Reset
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-slate-500 mb-5 pb-4 border-b border-indigo-500/10"
            style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {total} colleges found
          </p>

          {/* Sort */}
          <div className="mb-5">
            <label className="section-label block mb-2">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => onChange("sort", e.target.value)}
              className="input-field text-sm py-2"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-navy-800">{s.label}</option>
              ))}
            </select>
          </div>

          {/* College type */}
          <div className="mb-5">
            <label className="section-label block mb-3">College Type</label>
            <div className="space-y-2">
              {TYPES.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={filters.type === value}
                    onChange={() => onChange("type", filters.type === value ? "" : value)}
                    className="accent-indigo-500 w-3.5 h-3.5"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* State */}
          <div className="mb-5">
            <label className="section-label block mb-2">State</label>
            <select
              value={filters.state}
              onChange={(e) => onChange("state", e.target.value)}
              className="input-field text-sm py-2"
            >
              <option value="" className="bg-navy-800">All States</option>
              {STATES.map((s) => (
                <option key={s} value={s} className="bg-navy-800">{s}</option>
              ))}
            </select>
          </div>

          {/* Exam */}
          <div className="mb-5">
            <label className="section-label block mb-3">Entrance Exam</label>
            <div className="space-y-2">
              {EXAMS.map((exam) => (
                <label key={exam} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.exam === exam}
                    onChange={() => onChange("exam", filters.exam === exam ? "" : exam)}
                    className="accent-indigo-500 w-3.5 h-3.5 rounded"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{exam}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Min rating */}
          <div className="mb-5">
            <label className="section-label block mb-2">
              Min Rating: <span className="text-indigo-400">{filters.minRating || "Any"}★</span>
            </label>
            <input
              type="range"
              min="0" max="5" step="0.5"
              value={filters.minRating}
              onChange={(e) => onChange("minRating", e.target.value)}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>Any</span><span>5★</span>
            </div>
          </div>

          {/* Fees range */}
          <div>
            <label className="section-label block mb-2">Max Annual Fees</label>
            <select
              value={filters.maxFees}
              onChange={(e) => onChange("maxFees", e.target.value)}
              className="input-field text-sm py-2"
            >
              <option value="9999999" className="bg-navy-800">Any</option>
              <option value="100000" className="bg-navy-800">Up to ₹1L</option>
              <option value="200000" className="bg-navy-800">Up to ₹2L</option>
              <option value="300000" className="bg-navy-800">Up to ₹3L</option>
              <option value="500000" className="bg-navy-800">Up to ₹5L</option>
            </select>
          </div>
        </div>
      </aside>
    </>
  );
}
