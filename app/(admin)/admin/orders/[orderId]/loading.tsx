export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f6f7fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="h-11 w-40 rounded-2xl bg-white shadow-sm" />

            <div className="mt-4">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="mt-3 h-9 w-40 rounded bg-gray-300" />
              <div className="mt-3 h-4 w-72 max-w-full rounded bg-gray-200" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-24 rounded-full bg-gray-200" />
            <div className="h-8 w-28 rounded-full bg-gray-200" />
            <div className="h-10 w-24 rounded-2xl bg-gray-200" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="h-7 w-40 rounded bg-gray-300" />
                  <div className="mt-2 h-4 w-32 rounded bg-gray-200" />
                </div>
              </div>

              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-3xl border border-black/5 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="h-24 w-24 rounded-2xl bg-gray-200" />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="h-6 w-52 max-w-full rounded bg-gray-300" />
                          <div className="mt-2 h-4 w-28 rounded bg-gray-200" />
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="h-6 w-24 rounded bg-gray-300 sm:ml-auto" />
                          <div className="mt-2 h-4 w-20 rounded bg-gray-200 sm:ml-auto" />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="h-8 w-20 rounded-full bg-gray-200" />
                        <div className="h-8 w-24 rounded-full bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <div className="h-6 w-32 rounded bg-gray-300" />

              <div className="mt-5 space-y-5">
                <div>
                  <div className="mb-2 h-3 w-24 rounded bg-gray-200" />
                  <div className="h-10 w-full rounded-xl bg-gray-200" />
                </div>

                <div>
                  <div className="mb-2 h-3 w-24 rounded bg-gray-200" />
                  <div className="h-10 w-full rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <div className="h-6 w-20 rounded bg-gray-300" />

              <div className="mt-5 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-300" />
                  </div>
                ))}

                <div className="border-t border-dashed border-black/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-14 rounded bg-gray-300" />
                    <div className="h-7 w-24 rounded bg-gray-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <div className="h-6 w-24 rounded bg-gray-300" />

              <div className="mt-5 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-16 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-40 rounded bg-gray-300" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <div className="h-6 w-36 rounded bg-gray-300" />

              <div className="mt-5 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-4/5 rounded bg-gray-200" />
                <div className="h-4 w-1/3 rounded bg-gray-200" />
              </div>
            </div>

            <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
              <div className="h-6 w-16 rounded bg-gray-300" />

              <div className="mt-5 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-28 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-full rounded bg-gray-300" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}