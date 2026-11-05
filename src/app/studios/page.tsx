import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import StudiosBrowser from "@/app/components/studio/studios-browser";
import { API_URL } from "@/lib/api";
import type { Studio } from "@/app/types/studio";

async function getStudios(): Promise<Studio[]> {
  const response = await fetch(`${API_URL}/api/studios`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load studios: ${response.status}`);
  }
  return response.json();
}

async function StudiosContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const studios = await getStudios();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
            The full collection
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore studios
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-70">
            Find a space for your next shoot, recording, workshop, or production.
            Filter by type, budget, and capacity, then book the hours you need.
          </p>
        </div>
        <Link
          href="/add-studio"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Host your space
        </Link>
      </header>

      <StudiosBrowser studios={studios} initialCategory={category} />
    </main>
  );
}

function StudiosSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10" aria-busy="true">
      <p role="status" className="sr-only">
        Loading studios...
      </p>
      <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-amber-400/10" />
      <div className="mb-8 h-40 animate-pulse rounded-2xl bg-amber-400/5" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] animate-pulse rounded-2xl bg-amber-400/10"
          />
        ))}
      </div>
    </main>
  );
}

export default function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <Suspense fallback={<StudiosSkeleton />}>
      <StudiosContent searchParams={searchParams} />
    </Suspense>
  );
}
