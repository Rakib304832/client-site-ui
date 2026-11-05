export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10" aria-busy="true">
      <p role="status" className="sr-only">
        Loading dashboard...
      </p>
      <div className="h-9 w-72 animate-pulse rounded-lg bg-amber-400/10" />
      <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-amber-400/10" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-amber-400/10"
          />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="h-72 animate-pulse rounded-2xl bg-amber-400/5" />
        <div className="h-72 animate-pulse rounded-2xl bg-amber-400/5" />
      </div>
    </main>
  );
}
