export default function ProductsGridSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex justify-end">
        <div className="h-10 w-28 rounded-full bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="h-64 w-full rounded-2xl bg-gray-200" />
            <div className="pt-4 space-y-3">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="h-5 w-20 rounded bg-gray-200" />
                <div className="h-11 w-28 rounded-xl bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-10 rounded-xl bg-gray-200" />
        ))}
      </div>
    </div>
  );
}