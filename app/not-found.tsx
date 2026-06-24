import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-indigo-500/20 mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
          Page not found
        </h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/" className="btn-primary inline-flex">← Back to home</Link>
      </div>
    </div>
  );
}
