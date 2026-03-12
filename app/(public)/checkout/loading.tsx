export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fafafa] animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-40">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="mt-4 h-10 w-40 rounded-xl bg-gray-200" />
            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />
          </div>

          <div className="flex gap-2">
            <div className="h-10 w-24 rounded-full bg-gray-200" />
            <div className="h-10 w-32 rounded-full bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <section className="xl:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <div className="h-6 w-44 rounded bg-gray-200" />
                <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl border border-gray-200 p-5">
                  <div className="h-5 w-40 rounded bg-gray-200" />
                  <div className="mt-4 h-4 w-36 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-52 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-48 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-28 rounded bg-gray-200" />

                  <div className="mt-5 flex flex-wrap gap-2">
                    <div className="h-10 w-32 rounded-xl bg-gray-200" />
                    <div className="h-10 w-32 rounded-xl bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <div className="h-6 w-40 rounded bg-gray-200" />
                <div className="mt-2 h-4 w-36 rounded bg-gray-200" />
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 sm:flex-row"
                  >
                    <div className="h-28 w-full rounded-2xl bg-gray-200 sm:w-28 shrink-0" />

                    <div className="flex flex-1 flex-col justify-between gap-3">
                      <div>
                        <div className="h-5 w-3/4 rounded bg-gray-200" />

                        <div className="mt-3 flex flex-wrap gap-2">
                          <div className="h-8 w-20 rounded-full bg-gray-200" />
                          <div className="h-8 w-16 rounded-full bg-gray-200" />
                          <div className="h-8 w-24 rounded-full bg-gray-200" />
                        </div>
                      </div>

                      <div className="h-6 w-24 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="xl:col-span-1">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <div className="h-6 w-40 rounded bg-gray-200" />
                <div className="mt-2 h-4 w-28 rounded bg-gray-200" />
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-4 w-24 rounded bg-gray-200" />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </div>

                  <div className="mt-2 border-t border-dashed border-gray-200 pt-4 flex items-center justify-between">
                    <div className="h-5 w-16 rounded bg-gray-200" />
                    <div className="h-8 w-24 rounded bg-gray-200" />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="h-11 w-full rounded-xl bg-gray-200" />
                  <div className="mx-auto mt-4 h-4 w-52 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}