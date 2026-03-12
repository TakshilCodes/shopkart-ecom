export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto px-6 pb-12 pt-40 animate-pulse">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-10 w-44 rounded-xl bg-gray-200" />
          <div className="mt-2 h-4 w-28 rounded-lg bg-gray-200" />
        </div>

        <div className="h-4 w-32 rounded-lg bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        <section className="lg:col-span-2 space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="h-44 w-full rounded-2xl bg-gray-200 sm:h-28 sm:w-28" />

                <div className="flex-1">
                  <div className="mb-3 h-3 w-20 rounded bg-gray-200" />
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="mt-2 h-5 w-1/2 rounded bg-gray-200" />

                  <div className="mt-4 flex gap-2">
                    <div className="h-7 w-20 rounded-full bg-gray-200" />
                    <div className="h-7 w-24 rounded-full bg-gray-200" />
                  </div>

                  <div className="mt-4 h-6 w-24 rounded bg-gray-200" />
                </div>

                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-6">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="h-10 w-28 rounded-xl bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-36 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-44 rounded bg-gray-200" />

          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>

            <div className="flex justify-between">
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>

            <div className="border-t border-dashed pt-4 flex justify-between">
              <div className="h-5 w-16 rounded bg-gray-200" />
              <div className="h-5 w-24 rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-6 h-12 w-full rounded-2xl bg-gray-200" />
          <div className="mt-3 mx-auto h-3 w-40 rounded bg-gray-200" />
        </aside>
      </div>
    </main>
  );
}