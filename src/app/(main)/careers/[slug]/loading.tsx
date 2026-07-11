export default function Loading() {
  return (
    <main className="min-h-screen bg-surface animate-pulse">
      {/* Hero skeleton */}
      <section className="bg-green-50 dark:bg-[#1a1a2e] py-12 md:py-20">
        <div className="container-page">
          <div className="h-4 w-40 bg-gray-200 dark:bg-white/10 rounded mb-6" />
          <div className="h-10 w-80 bg-gray-200 dark:bg-white/10 rounded mb-4" />
          <div className="h-5 w-96 bg-gray-200 dark:bg-white/10 rounded" />
        </div>
      </section>
      {/* Cards skeleton */}
      <section className="container-page py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-gray-200 dark:bg-white/5 border border-gray-100 dark:border-white/10"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
