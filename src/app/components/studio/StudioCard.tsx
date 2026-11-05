import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart, MapPin, Star } from "lucide-react";
import SafeImage from "@/app/components/SafeImage";
import type { Studio } from "@/app/types/studio";

type StudioCardProps = {
  studio: Studio;
  priority?: boolean;
};

export default function StudioCard({ studio, priority = false }: StudioCardProps) {
  const [favorited, setFavorited] = useState(false);

  function toggleFavorite() {
    setFavorited((prev) => !prev);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-current/10 bg-white transition hover:-translate-y-0.5 hover:border-amber-400/70 hover:shadow-lg dark:bg-zinc-900/60">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <SafeImage
          src={studio.image}
          alt={studio.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {studio.category}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
          {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleFavorite();
          }}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className={`absolute left-1/2 -bottom-8 z-20 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition duration-300 group-hover:bottom-3 backdrop-blur-sm shadow-sm ${
            favorited
              ? "text-red-500"
              : "text-zinc-700 hover:text-amber-600 border border-current/20"
          }`}
        >
          <Heart
            className={`h-5 w-5 favorite-heart ${favorited ? "liked" : ""}`}
            strokeWidth={favorited ? 0 : 2}
            fill={favorited ? "currentColor" : "none"}
            aria-hidden="true"
          />
          {favorited && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-amber-400 text-[10px] font-semibold text-black whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
              Saved
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold leading-snug">{studio.title}</h3>
        <p className="flex items-center gap-1.5 text-sm opacity-70">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{studio.location}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-xl font-bold text-amber-500">
            ${studio.hourlyRate}
            <span className="text-sm font-normal opacity-70"> / hr</span>
          </p>
          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-current/25 px-3.5 py-2 text-sm font-medium transition hover:border-amber-400 hover:text-amber-500"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
