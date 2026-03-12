export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse bg-zinc-50 p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-2">
        <div className="h-9 w-28 rounded bg-zinc-300" />
        <div className="h-4 w-64 rounded bg-zinc-200" />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h-7 w-24 rounded bg-zinc-300" />
              <div className="mt-2 h-4 w-32 rounded bg-zinc-200" />
            </div>

            <div className="w-full sm:w-80">
              <div className="h-11 w-full rounded-xl bg-zinc-100" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-zinc-50">
                <tr>
                  {["User", "Role", "Orders", "Cart", "Addresses", "Joined", "Actions"].map(
                    (item) => (
                      <th key={item} className="px-4 py-3">
                        <div className="h-4 w-16 rounded bg-zinc-200" />
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-100 text-sm">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <div className="h-5 w-32 rounded bg-zinc-300" />
                        <div className="mt-2 h-3 w-44 rounded bg-zinc-200" />
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-7 w-16 rounded-full bg-zinc-200" />
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-4 w-6 rounded bg-zinc-200" />
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-4 w-6 rounded bg-zinc-200" />
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-4 w-6 rounded bg-zinc-200" />
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-4 w-24 rounded bg-zinc-200" />
                    </td>

                    <td className="px-4 py-4">
                      <div className="h-9 w-20 rounded-xl bg-zinc-200" />
                      <div className="mt-2 h-3 w-20 rounded bg-zinc-100" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}