import Link from "next/link";
import { Aperture, ArrowLeft, Clapperboard, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative mb-8 grid h-48 w-48 place-items-center">
        <span className="absolute inset-0 rounded-full border border-amber-400/20" />
        <span className="absolute inset-5 rounded-full border border-amber-400/30" />
        <span className="absolute inset-10 rounded-full bg-amber-400/10" />
        <span className="relative grid h-24 w-24 place-items-center rounded-full bg-amber-400 text-black shadow-[0_0_60px_rgba(251,191,36,0.35)]">
          <Aperture className="h-12 w-12" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <span className="absolute -right-1 top-3 grid h-10 w-10 place-items-center rounded-xl border border-current/15 bg-white text-amber-500 shadow-lg dark:bg-zinc-900">
          <Clapperboard className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="absolute -left-1 bottom-4 grid h-9 w-9 place-items-center rounded-xl border border-current/15 bg-white text-amber-500 shadow-lg dark:bg-zinc-900">
          <Search className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
        404 · Scene not found
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
        This set has already been struck.
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed opacity-70 sm:text-base">
        The studio or page you are looking for may have been removed, renamed, or
        the link may be incorrect. The rest of the collection is still standing
        by.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Return to Home
        </Link>
        <Link
          href="/studios"
          className="rounded-lg border border-current/25 px-5 py-3 text-sm font-semibold transition hover:border-amber-400"
        >
          Explore studios
        </Link>
      </div>
    </main>
  );
}
