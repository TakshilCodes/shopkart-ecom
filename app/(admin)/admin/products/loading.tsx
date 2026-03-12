export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-32 rounded bg-gray-300" />
            <div className="mt-2 h-4 w-72 max-w-full rounded bg-gray-200" />
          </div>

          <div className="h-11 w-32 rounded-xl bg-gray-300" />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-11 w-full rounded-xl bg-gray-100" />
            <div className="h-11 w-28 rounded-xl bg-gray-200" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Product", "Category", "Price", "Variants", "Status", "Actions"].map(
                    (item) => (
                      <th key={item} className="px-6 py-4 text-left">
                        <div className="h-4 w-20 rounded bg-gray-200" />
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-gray-200" />
                        <div className="min-w-0">
                          <div className="h-5 w-40 rounded bg-gray-300" />
                          <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-4 w-20 rounded bg-gray-300" />
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-4 w-10 rounded bg-gray-200" />
                    </td>

                    <td className="px-6 py-4">
                      <div className="h-7 w-20 rounded-full bg-gray-200" />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <div className="h-10 w-20 rounded-xl bg-gray-200" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 p-4 lg:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 p-4"
              >
                <div className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 rounded-xl bg-gray-200" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="h-5 w-32 rounded bg-gray-300" />
                        <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
                      </div>

                      <div className="h-7 w-20 rounded-full bg-gray-200" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <div className="h-4 w-12 rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-16 rounded bg-gray-300" />
                      </div>

                      <div>
                        <div className="h-4 w-14 rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-8 rounded bg-gray-300" />
                      </div>
                    </div>

                    <div className="mt-4 h-10 w-28 rounded-xl bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}