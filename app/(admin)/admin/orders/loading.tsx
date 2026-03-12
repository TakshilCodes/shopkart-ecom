export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-6 sm:px-6 lg:px-8 animate-pulse">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[28px] bg-linear-to-r from-black to-neutral-800 px-6 py-7 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="h-4 w-24 rounded bg-white/20" />
              <div className="mt-3 h-9 w-40 rounded bg-white/20" />
              <div className="mt-3 h-4 w-80 max-w-full rounded bg-white/15" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
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

        <div className="mb-6 rounded-[28px] border border-black/5 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-11 rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div>
              <div className="h-6 w-32 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-56 rounded bg-gray-100" />
            </div>
          </div>

          <div className="hidden xl:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Order",
                      "Customer",
                      "Items",
                      "Amount",
                      "Payment",
                      "Delivery",
                      "Created",
                      "Actions",
                    ].map((item) => (
                      <th key={item} className="px-5 py-4 text-left">
                        <div className="h-4 w-20 rounded bg-gray-200" />
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-t border-black/5 align-top">
                      <td className="px-5 py-5">
                        <div className="h-5 w-24 rounded bg-gray-200" />
                        <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-5 w-28 rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-40 rounded bg-gray-100" />
                        <div className="mt-2 h-3 w-24 rounded bg-gray-100" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-8 w-14 rounded-full bg-gray-100" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-5 w-24 rounded bg-gray-200" />
                        <div className="mt-2 h-3 w-20 rounded bg-gray-100" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-10 w-36 rounded-xl bg-gray-100" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-10 w-36 rounded-xl bg-gray-100" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-4 w-24 rounded bg-gray-200" />
                        <div className="mt-2 h-3 w-16 rounded bg-gray-100" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-4 w-10 rounded bg-gray-200" />
                          <div className="h-4 w-4 rounded bg-gray-100" />
                          <div className="h-4 w-12 rounded bg-gray-200" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 p-4 xl:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="h-6 w-24 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-28 rounded bg-gray-100" />
                    <div className="mt-2 h-4 w-40 rounded bg-gray-100" />
                  </div>

                  <div className="text-right">
                    <div className="ml-auto h-6 w-24 rounded bg-gray-200" />
                    <div className="mt-2 ml-auto h-3 w-14 rounded bg-gray-100" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="h-7 w-24 rounded-full bg-gray-100" />
                  <div className="h-7 w-28 rounded-full bg-gray-100" />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div>
                    <div className="mb-2 h-3 w-24 rounded bg-gray-100" />
                    <div className="h-10 w-full rounded-xl bg-gray-100" />
                  </div>

                  <div>
                    <div className="mb-2 h-3 w-24 rounded bg-gray-100" />
                    <div className="h-10 w-full rounded-xl bg-gray-100" />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-10 rounded bg-gray-200" />
                    <div className="h-4 w-12 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}