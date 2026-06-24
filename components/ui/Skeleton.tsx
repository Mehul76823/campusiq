export function SkeletonCard() {
  return (
    <div className="glass-card p-6 h-64 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 shimmer rounded w-3/4" />
          <div className="h-3 shimmer rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-20 shimmer rounded-md" />
        <div className="h-5 w-16 shimmer rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 shimmer rounded-xl" />
        <div className="h-16 shimmer rounded-xl" />
      </div>
      <div className="h-2 shimmer rounded-full mt-auto" />
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 shimmer rounded-2xl" />
      <div className="space-y-3">
        <div className="h-8 shimmer rounded w-1/2" />
        <div className="h-4 shimmer rounded w-1/3" />
        <div className="h-4 shimmer rounded w-full" />
        <div className="h-4 shimmer rounded w-5/6" />
      </div>
    </div>
  );
}
