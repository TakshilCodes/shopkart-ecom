export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fafafa] animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 pt-40">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-10 w-24 rounded-full bg-gray-200" />
            <div className="h-4 w-3 rounded bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-3 rounded bg-gray-200" />
            <div className="h-4 w-40 rounded bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <section>
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="h-[420px] w-full rounded-2xl bg-gray-200 sm:h-[520px] lg:h-[620px]" />
            </div>
          </section>

          <section>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <div className="mb-3 h-3 w-24 rounded bg-gray-200" />
                <div className="h-10 w-3/4 rounded-xl bg-gray-200" />
                <div className="mt-4 flex items-end gap-3">
                  <div className="h-8 w-28 rounded bg-gray-200" />
                  <div className="h-4 w-28 rounded bg-gray-200" />
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="h-5 w-24 rounded bg-gray-200" />
                  <div className="h-8 w-28 rounded-full bg-gray-200" />
                </div>

                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-12 w-16 rounded-2xl bg-gray-200"
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <div className="h-12 w-40 rounded-xl bg-gray-200" />
                  <div className="mt-3 h-4 w-52 rounded bg-gray-200" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white px-4 py-4"
                  >
                    <div className="h-3 w-16 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-20 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}