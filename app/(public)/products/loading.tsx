export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fafafa] px-4 pb-12 pt-40 sm:px-6 lg:px-8 animate-pulse">
      <main className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-5">
          <div className="h-12 w-full rounded-2xl bg-gray-200" />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="h-10 w-40 rounded-xl bg-gray-200" />
              <div className="mt-3 h-4 w-80 rounded bg-gray-200" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="h-11 w-28 rounded-xl bg-gray-200" />
              <div className="h-10 w-28 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 shrink-0 rounded-full bg-gray-200"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="h-64 w-full rounded-2xl bg-gray-200" />

              <div className="pt-4">
                <div className="mb-3 h-3 w-20 rounded bg-gray-200" />
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-5 w-1/2 rounded bg-gray-200" />

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="h-6 w-20 rounded bg-gray-200" />
                  <div className="h-11 w-28 rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
          <div className="h-10 w-16 rounded-xl bg-gray-200" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-10 rounded-xl bg-gray-200"
            />
          ))}
          <div className="h-10 w-16 rounded-xl bg-gray-200" />
        </div>
      </main>
    </div>
  );
}