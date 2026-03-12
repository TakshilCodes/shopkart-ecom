export default function Loading() {
  return (
    <div className="min-h-screen px-4 pb-12 pt-40 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8 space-y-5">
          <div className="h-14 rounded-3xl bg-gray-200" />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="h-10 w-40 rounded-xl bg-gray-200" />
              <div className="h-5 w-96 rounded-lg bg-gray-200" />
            </div>

            <div className="flex gap-3">
              <div className="h-11 w-28 rounded-full bg-gray-200" />
              <div className="h-11 w-28 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="mb-8 flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-11 w-24 rounded-full bg-gray-200" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-gray-200 bg-white p-4">
              <div className="h-64 rounded-2xl bg-gray-200" />
              <div className="pt-4 space-y-3">
                <div className="h-3 w-24 rounded bg-gray-200" />
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-20 rounded bg-gray-200" />
                  <div className="h-11 w-28 rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}