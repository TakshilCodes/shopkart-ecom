export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f6f7fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[28px] bg-linear-to-r from-black to-neutral-800 px-6 py-7 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="h-4 w-24 rounded bg-white/20" />
              <div className="mt-3 h-9 w-44 rounded bg-white/20" />
              <div className="mt-3 h-4 w-80 max-w-full rounded bg-white/15" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="h-3 w-16 rounded bg-white/20" />
                  <div className="mt-3 h-6 w-12 rounded bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-6 xl:grid-cols-[1.1fr_1.9fr]">
          <section className="rounded-[28px] border border-black/5 bg-white p-5 shadow-sm">
            <div className="h-6 w-36 rounded bg-gray-300" />
            <div className="mt-2 h-4 w-56 rounded bg-gray-200" />

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-2xl bg-gray-100" />
              </div>

              <div>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-2xl bg-gray-100" />
              </div>

              <div className="flex gap-3 pt-2">
                <div className="h-11 flex-1 rounded-2xl bg-gray-200" />
                <div className="h-11 w-24 rounded-2xl bg-gray-100" />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-black/5 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="h-6 w-32 rounded bg-gray-300" />
                <div className="mt-2 h-4 w-52 rounded bg-gray-200" />
              </div>

              <div className="h-11 w-full rounded-2xl bg-gray-100 sm:w-72" />
            </div>

            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Category", "Slug", "Products", "Created", "Actions"].map(
                        (item) => (
                          <th key={item} className="px-5 py-4 text-left">
                            <div className="h-4 w-20 rounded bg-gray-200" />
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-t border-black/5">
                        <td className="px-5 py-5">
                          <div className="h-5 w-28 rounded bg-gray-300" />
                        </td>
                        <td className="px-5 py-5">
                          <div className="h-4 w-36 rounded bg-gray-200" />
                        </td>
                        <td className="px-5 py-5">
                          <div className="h-8 w-14 rounded-full bg-gray-100" />
                        </td>
                        <td className="px-5 py-5">
                          <div className="h-4 w-24 rounded bg-gray-200" />
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-4 w-10 rounded bg-gray-200" />
                            <div className="h-4 w-12 rounded bg-gray-200" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 p-4 md:hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="h-6 w-28 rounded bg-gray-300" />
                      <div className="mt-2 h-4 w-36 rounded bg-gray-200" />
                    </div>

                    <div className="h-8 w-14 rounded-full bg-gray-100" />
                  </div>

                  <div className="mt-4 h-4 w-24 rounded bg-gray-200" />

                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-4 w-10 rounded bg-gray-200" />
                    <div className="h-4 w-12 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}