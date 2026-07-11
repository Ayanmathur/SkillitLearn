export default function Loading() {
  return (
    <main className="min-h-screen bg-surface animate-pulse">
      {/* Breadcrumb skeleton */}
      <section className="bg-green-50 dark:bg-[#1a1a2e] py-12 md:py-20">
        <div className="container-page">
          <div className="h-4 w-64 bg-gray-200 dark:bg-white/10 rounded mb-6" />
          <div className="h-10 w-80 bg-gray-200 dark:bg-white/10 rounded mb-4" />
          <div className="h-5 w-96 bg-gray-200 dark:bg-white/10 rounded" />
        </div>
      </section>
      {/* Content skeleton */}
      <section className="container-page py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-48 bg-gray-200 dark:bg-white/10 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/5 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
