import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarCheck, MessageSquare, Star } from "lucide-react";
import type { Studio } from "@/app/types/studio";
import GalleryCarousel from "@/app/components/studio/GalleryCarousel";
import BookWorkspaceButton from "@/app/components/studio/booking/BookWorkspaceButton";
import SafeImage from "@/app/components/SafeImage";
import { API_URL } from "@/lib/api";

async function getStudio(id: string): Promise<Studio | null> {
  const res = await fetch(`${API_URL}/api/studios/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load studio");

  return res.json();
}

async function StudioDetails({ id }: { id: string }) {
  const studio = await getStudio(id);

  // With streamed rendering, notFound() renders the not-found UI and marks the response noindex.
  if (!studio) notFound();

  // Gallery falls back to the main image, so the carousel never receives an empty list.
  const gallery = studio.gallery?.length ? studio.gallery : [studio.image];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/studios"
        className="mb-6 inline-flex text-sm font-medium underline opacity-70 hover:opacity-100"
      >
        ← Back to all studios
      </Link>

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
            <SafeImage
              src={studio.ownerPhoto || "/studios/fallback.jpg"}
              alt={studio.ownerName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">Hosted by {studio.ownerName}</p>
              <p className="text-sm opacity-70">{studio.ownerEmail}</p>
            </div>
          </div>

          {/* The button opens the booking modal. It checks login on the client,
              but the server still enforces it, since client checks can be bypassed. */}
          <BookWorkspaceButton
            studioId={studio._id}
            hourlyRate={studio.hourlyRate}
            securityDeposit={studio.securityDeposit}
            maxCapacity={studio.maxCapacity}
          />

          <div className="flex items-start gap-3 rounded-xl border border-current/10 bg-current/[0.02] p-4 text-sm">
            <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
            <div>
              <p className="font-semibold">Live conflict checks</p>
              <p className="mt-1 leading-relaxed opacity-70">
                Every request is checked against pending and confirmed bookings.
                If a slot is already taken, you will be asked to pick another
                time before the request is saved.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Reviews</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm opacity-70">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              {studio.rating > 0 ? studio.rating.toFixed(1) : "New"} ·{" "}
              {studio.reviewsCount}{" "}
              {studio.reviewsCount === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {studio.reviews?.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {studio.reviews.map((review, index) => (
              <article
                key={review._id ?? `${review.userName}-${index}`}
                className="rounded-2xl border border-current/10 bg-white p-5 dark:bg-zinc-900/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-400/15 text-sm font-bold text-amber-600">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{review.userName}</p>
                      <p className="text-xs opacity-60">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-600">
                    <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                    {review.rating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed opacity-80">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-current/20 px-6 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-400/15 text-amber-500">
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-lg font-semibold">No written reviews yet</p>
            <p className="max-w-md text-sm leading-relaxed opacity-70">
              {studio.reviewsCount > 0
                ? `${studio.reviewsCount} guests rated this studio ${studio.rating.toFixed(1)} out of 5. Written reviews will appear here as they are shared.`
                : "Be the first to book this space and share what the room was like for your production."}
            </p>
            <Link
              href="/studios"
              className="mt-1 rounded-lg border border-current/20 px-4 py-2 text-sm font-medium transition hover:border-amber-400"
            >
              Browse more studios
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <p role="status" className="mx-auto max-w-6xl px-4 py-10">
          Loading studio details...
        </p>
       }
    >
      <StudioDetails id={id} />
    </Suspense>
  );
}
