import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFees(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L/yr`;
  }
  return `₹${amount.toLocaleString("en-IN")}/yr`;
}

export function formatPackage(lpa: number): string {
  return `${lpa.toFixed(1)} LPA`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-emerald-400";
  if (rating >= 4.0) return "text-green-400";
  if (rating >= 3.5) return "text-yellow-400";
  if (rating >= 3.0) return "text-amber-400";
  return "text-red-400";
}

export function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    GOVERNMENT: "Government",
    PRIVATE: "Private",
    DEEMED: "Deemed",
    AUTONOMOUS: "Autonomous",
  };
  return map[type] ?? type;
}

export function getTypeClass(type: string): string {
  const map: Record<string, string> = {
    GOVERNMENT: "tag-gov",
    PRIVATE: "tag-private",
    DEEMED: "tag-deemed",
    AUTONOMOUS: "tag-deemed",
  };
  return map[type] ?? "tag-gov";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
