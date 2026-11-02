import Link from "next/link";
import type { Studio } from "@/app/types/studio";

// The Express server address. NEXT_PUBLIC_ is needed only if the browser reads it,
// and it is harmless here since it contains no secret.
const API = process.env.NEXT_PUBLIC_API_URL;

// Same category names as the Add Studio form, so filtering matches what hosts saved.
const CATEGORIES = ["All", "Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

async function getStudios(category: string): Promise<Studio[]> {
  // "All" means no filter, so we skip the query string entirely.
  const query = category !== "All" ? `?category=${encodeURIComponent(category)}` : "";

  // no-store makes every visit fetch fresh data, so a newly added studio appears immediately.
  const res = await fetch(`${API}/api/studios${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load studios");
  return res.json();
}

// In Next.js 15, searchParams is a Promise, so it must be awaited before reading.
export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category ?? "All";
  const studios = await getStudios(active);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Explore Studios</h1>
        <p className="mt-2 text-sm opacity-70">
          Find a space for your next shoot, recording, or workshop.
        </p>
      </header>

      {/* Category chips are plain links, so the selected category lives in the URL
          and survives a reload or a shared link. */}
      <nav className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <Link
              key={cat}
              href={cat === "All" ? "/studios" : `/studios?category=${encodeURIComponent(cat)}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                isActive
                  ? "border-amber-400 bg-amber-400 font-semibold text-black"
                  : "border-current/20 hover:border-amber-400"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </nav>

      {studios.length === 0 ? (
        // Empty state with a CTA, as the spec asks, instead of a blank page.
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed p-12 text-center">
          <p className="text-lg font-medium">No studios found in this category yet.</p>
          <Link
            href="/add-studio"
            className="rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-black"
          >
            Host Your Space
          </Link>
        </div>
      ) : (
        // items-stretch plus h-full on each card keeps all cards the same height, as the spec requires.
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <article
              key={studio._id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-current/10"
            >
              {/* A plain img tag is used because imgbb hosts are not whitelisted in next.config,
                  so next/image would need extra setup for the same result. */}
              <div className="relative aspect-[4/3] w-full">
                <img
                  src={studio.image}
                  alt={studio.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                  {studio.category}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                  ★ {studio.rating.toFixed(1)}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-5">
                <h2 className="text-lg font-semibold">{studio.title}</h2>
                <p className="text-sm opacity-70">{studio.location}</p>

                {/* mt-auto pushes the price and button to the bottom, so cards align even with different text lengths. */}
                <div className="mt-auto flex items-center justify-between pt-4">
                  <p className="text-xl font-bold text-amber-400">
                    ${studio.hourlyRate}
                    <span className="text-sm font-normal opacity-70"> / hr</span>
                  </p>
                  <Link
                    href={`/studios/${studio._id}`}
                    className="rounded-lg border border-current/30 px-4 py-2 text-sm font-medium hover:border-amber-400"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}