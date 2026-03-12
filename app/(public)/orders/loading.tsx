export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fafafa] animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-40">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-10 w-44 rounded-xl bg-gray-200" />
            <div className="mt-3 h-4 w-64 rounded bg-gray-200" />
          </div>

          <div className="h-10 w-24 rounded-full bg-gray-200" />
        </div>

        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="h-6 w-40 rounded bg-gray-200" />
                    <div className="h-7 w-28 rounded-full bg-gray-200" />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <div className="h-3 w-12 rounded bg-gray-200" />
                      <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <div className="h-3 w-12 rounded bg-gray-200" />
                      <div className="mt-2 h-4 w-12 rounded bg-gray-200" />
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <div className="h-3 w-10 rounded bg-gray-200" />
                      <div className="mt-2 h-4 w-20 rounded bg-gray-200" />
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <div className="h-3 w-12 rounded bg-gray-200" />
                      <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 px-5 py-4 lg:min-w-[210px]">
                  <div className="h-3 w-20 rounded bg-gray-200 lg:ml-auto" />
                  <div className="mt-3 h-8 w-28 rounded bg-gray-200 lg:ml-auto" />
                  <div className="mt-4 h-4 w-24 rounded bg-gray-200 lg:ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}