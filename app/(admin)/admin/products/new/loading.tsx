export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
            <div className="h-8 w-36 rounded bg-gray-300" />
            <div className="mt-2 h-4 w-72 max-w-full rounded bg-gray-200" />
          </div>

          <div className="h-11 w-36 rounded-xl bg-gray-300" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-xl bg-gray-100" />
              </div>

              <div>
                <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-xl bg-gray-100" />
              </div>

              <div>
                <div className="mb-2 h-4 w-28 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-xl bg-gray-100" />
              </div>

              <div>
                <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-xl bg-gray-100" />
              </div>

              <div>
                <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
                <div className="h-12 w-full rounded-xl bg-gray-100" />
              </div>

              <div className="space-y-3">
                <div className="h-5 w-24 rounded bg-gray-300" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid gap-3 rounded-2xl border border-gray-200 p-4 sm:grid-cols-3"
                  >
                    <div className="h-11 rounded-xl bg-gray-100" />
                    <div className="h-11 rounded-xl bg-gray-100" />
                    <div className="h-11 rounded-xl bg-gray-100" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="h-6 w-32 rounded bg-gray-300" />

              <div className="mt-5 flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100">
                <div className="h-16 w-40 rounded bg-gray-200" />
              </div>

              <div className="mt-4">
                <div className="h-6 w-32 rounded bg-gray-300" />
                <div className="mt-2 h-4 w-40 rounded bg-gray-200" />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="h-6 w-28 rounded bg-gray-300" />

              <div className="mt-5 flex flex-col gap-3">
                <div className="h-11 w-full rounded-xl bg-gray-300" />
                <div className="h-11 w-full rounded-xl bg-gray-200" />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}