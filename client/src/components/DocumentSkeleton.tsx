export default function DocumentSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* PRD Skeleton */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-neutral-200 rounded w-64"></div>
          <div className="h-4 bg-neutral-200 rounded w-24"></div>
        </div>
        <div className="bg-white p-4 rounded-sm border border-neutral-200 space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-4/5"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/5"></div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="h-4 bg-neutral-200 rounded w-96"></div>
        </div>
      </div>

      {/* SOW Skeleton */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-neutral-200 rounded w-56"></div>
          <div className="h-4 bg-neutral-200 rounded w-24"></div>
        </div>
        <div className="bg-white p-4 rounded-sm border border-neutral-200 space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
          <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          <div className="h-4 bg-neutral-200 rounded w-4/5"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/5"></div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="h-4 bg-neutral-200 rounded w-96"></div>
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-neutral-600">
          <div className="w-4 h-4 border-2 border-neutral-300 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="font-mono">Generating your personalized documents...</span>
        </div>
      </div>
    </div>
  );
}
