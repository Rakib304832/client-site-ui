export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto max-w-6xl px-4 py-10"
    >
      <p role="status" className="sr-only">
        Loading studio details...
      </p>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-amber-400/10" />

        <div className="flex animate-pulse flex-col gap-5">
          <div className="h-6 w-28 rounded-full bg-amber-400/10" />
          <div className="h-9 w-3/4 rounded bg-amber-400/10" />
          <div className="h-5 w-2/3 rounded bg-amber-400/10" />
          <div className="h-20 rounded bg-amber-400/10" />
          <div className="h-16 border-y border-current/10 bg-amber-400/5" />
          <div className="h-16 rounded bg-amber-400/10" />
          <div className="h-16 rounded-xl bg-amber-400/10" />
          <div className="h-12 w-48 rounded-lg bg-amber-400/10" />
        </div>
      </div>

      <section aria-hidden="true" className="mt-14 animate-pulse">
        <div className="mb-4 h-8 w-32 rounded bg-current/10" />
        <div className="h-24 rounded-2xl border border-dashed bg-amber-400/5" />
      </section>
    </main>
  );
}
