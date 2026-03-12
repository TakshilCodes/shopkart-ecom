export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-45">
        <div className="mb-8">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="mt-3 h-10 w-52 rounded-xl bg-gray-200" />
          <div className="mt-3 h-4 w-80 rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <section className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="h-6 w-44 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
                </div>
                <div className="h-10 w-28 rounded-xl bg-gray-200" />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="w-24 h-24 rounded-full bg-gray-200 shrink-0" />

                  <div className="flex-1">
                    <div className="h-8 w-40 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-56 rounded bg-gray-200" />

                    <div className="mt-4">
                      <div className="h-10 w-32 rounded-xl bg-gray-200" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                    <div className="h-3 w-20 rounded bg-gray-200" />
                    <div className="mt-3 h-5 w-32 rounded bg-gray-200" />
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                    <div className="h-3 w-24 rounded bg-gray-200" />
                    <div className="mt-3 h-5 w-44 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="h-6 w-24 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-80 rounded bg-gray-200" />
                </div>
                <div className="h-10 w-36 rounded-xl bg-gray-200" />
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                  <div>
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
                  </div>

                  <div className="h-10 w-24 rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <div className="h-6 w-40 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
                </div>

                <div className="h-10 w-28 rounded-xl bg-gray-200" />
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-gray-200 p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="h-5 w-32 rounded bg-gray-200" />
                          <div className="mt-3 h-4 w-24 rounded bg-gray-200" />
                          <div className="mt-2 h-4 w-40 rounded bg-gray-200" />
                          <div className="mt-2 h-4 w-36 rounded bg-gray-200" />
                          <div className="mt-2 h-4 w-32 rounded bg-gray-200" />
                          <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <div className="h-10 w-20 rounded-xl bg-gray-200" />
                        <div className="h-10 w-24 rounded-xl bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="xl:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                <div className="h-6 w-36 rounded bg-gray-200" />

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-12 rounded bg-gray-200" />
                    <div className="h-4 w-24 rounded bg-gray-200" />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="h-4 w-12 rounded bg-gray-200" />
                    <div className="h-4 w-32 rounded bg-gray-200" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="h-4 w-16 rounded bg-gray-200" />
                    <div className="h-4 w-6 rounded bg-gray-200" />
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="h-11 w-full rounded-xl bg-gray-200" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                <div className="h-6 w-28 rounded bg-gray-200" />

                <div className="mt-5 flex flex-col gap-3">
                  <div className="h-11 w-full rounded-xl bg-gray-200" />
                  <div className="h-11 w-full rounded-xl bg-gray-200" />
                  <div className="h-11 w-full rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}