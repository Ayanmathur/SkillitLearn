export default function Loading() {
  return (
    <main className="min-h-screen bg-surface animate-pulse">
      {/* Hero skeleton */}
      <section className="bg-green-50 dark:bg-[#1a1a2e] py-12 md:py-20">
        <div className="container-page">
          <div className="h-4 w-48 bg-gray-200 dark:bg-white/10 rounded mb-6" />
          <div className="h-10 w-72 bg-gray-200 dark:bg-white/10 rounded mb-4" />
          <div className="flex gap-6 mt-6">
            <div className="h-16 w-24 bg-gray-200 dark:bg-white/10 rounded-xl" />
            <div className="h-16 w-24 bg-gray-200 dark:bg-white/10 rounded-xl" />
            <div className="h-16 w-24 bg-gray-200 dark:bg-white/10 rounded-xl" />
          </div>
        </div>
      </section>
      {/* Skills skeleton */}
      <section className="container-page py-12">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-gray-200 dark:bg-white/5 border border-gray-100 dark:border-white/10"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
