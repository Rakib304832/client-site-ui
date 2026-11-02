import { notFound } from "next/navigation";
import type { Studio } from "@/app/types/studio";
import GalleryCarousel from "@/app/components/studio/GalleryCarousel";
import BookWorkspaceButton from "@/app/components/studio/booking/BookWorkspaceButton";


const API = process.env.NEXT_PUBLIC_API_URL;

async function getStudio(id: string): Promise<Studio | null> {
  const res = await fetch("http://localhost:5000/api/studios", { cache: "no-store" });

  // A 404 from the server means this studio does not exist, so we show the not-found page.
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load studio");
  return res.json();
}

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studio = await getStudio(id);

  // notFound() renders app/not-found.tsx and sets a real 404 status code for search engines.
  if (!studio) notFound();

  // Gallery falls back to the main image, so the carousel never receives an empty list.
  const gallery = studio.gallery?.length ? studio.gallery : [studio.image];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery carousel is a client component because it needs Swiper in the browser. */}
        <GalleryCarousel images={gallery} title={studio.title} />

        <section className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black">
            {studio.category}
          </span>

          <h1 className="text-3xl font-bold">{studio.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm opacity-80">
            <span>📍 {studio.location}</span>
            <span>★ {studio.rating.toFixed(1)} ({studio.reviewsCount} reviews)</span>
            <span>👥 Up to {studio.maxCapacity} guests</span>
          </div>

          <p className="leading-relaxed opacity-80">{studio.overview}</p>

          <div className="flex items-baseline gap-6 border-y border-current/10 py-5">
            <p className="text-3xl font-bold text-amber-400">
              ${studio.hourlyRate}
              <span className="text-base font-normal opacity-70"> / hr</span>
            </p>
            <p className="text-sm opacity-70">Security deposit: ${studio.securityDeposit}</p>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Amenities</h2>
            <ul className="flex flex-wrap gap-2">
              {studio.amenities.map((item) => (
                <li key={item} className="rounded-full border border-current/20 px-3 py-1 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-current/10 p-4">
            <img
              src={studio.ownerPhoto}
              alt={studio.ownerName}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">Hosted by {studio.ownerName}</p>
              <p className="text-sm opacity-70">{studio.ownerEmail}</p>
            </div>
          </div>

          {/* The button opens the booking modal. It checks login on the client,
              but the server still enforces it, since client checks can be bypassed. */}
          <BookWorkspaceButton studioId={studio._id} hourlyRate={studio.hourlyRate} />
        </section>
      </div>

      {/* Reviews section. The data has a count but no review list yet,
          so this shows an empty state instead of inventing reviews. */}
      <section className="mt-14">
        <h2 className="mb-4 text-2xl font-bold">Reviews</h2>
        <div className="rounded-2xl border border-dashed p-8 text-center opacity-70">
          {studio.reviewsCount > 0
            ? `${studio.reviewsCount} reviews. Review details will appear here.`
            : "No reviews yet. Be the first to book and share your experience."}
        </div>
      </section>
    </main>
  );
}