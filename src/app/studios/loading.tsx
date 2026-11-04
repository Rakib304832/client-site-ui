export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10" aria-busy="true">
      <p role="status" className="sr-only">
        Loading studios...
      </p>
      <div className="mb-3 h-4 w-36 animate-pulse rounded bg-current/10" />
      <div className="mb-2 h-10 w-64 animate-pulse rounded-lg bg-current/10" />
      <div className="mb-8 h-5 w-full max-w-xl animate-pulse rounded bg-current/10" />
      <div className="mb-8 h-44 animate-pulse rounded-2xl bg-current/5" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] animate-pulse rounded-2xl bg-current/10"
          />
        ))}
      </div>
    </main>
  );
}
